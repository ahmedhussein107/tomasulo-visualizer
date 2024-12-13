import React, { useState, useEffect, cache } from "react";
import Table from "./components/Table";
import { Typography, Box, Button } from "@mui/material";
import axios from "axios";

import {
    registerColumns,
    cacheColumns,
    reservationColumns,
    branchColumns,
    loadColumns,
    storeColumns,
} from "./constants/table.constants";

import { stationsTemplates } from "./constants/stations.constants";

function App() {
    // State for Tomasulo components
    const [clockCycle, setClockCycle] = useState(1);
    const [code, setCode] = useState([]);

    const [views, setViews] = useState([]);
    const [index, setIndex] = useState(0);

    const [latencies, setLatencies] = useState({});
    const [blockSize, setBlockSize] = useState(3); // TODO: read it from file

    const parseCode = (code) => {
        let tags = new Map();
        code.map((line, index) => {
            let tokens = line.split(":");
            let tag = null;
            if (tokens.length > 1) {
                tag = tokens[0].replace(/\s/g, "");
                tags.set(tag, index);
                tokens.shift();
            }
        });
        console.log(tags);
        const parsedCode = code.map((line, index) => {
            let tokens = line.split(":");
            let tag = null;
            if (tokens.length > 1) {
                tokens.shift();
            }
            tokens = tokens[0].split(",");
            let first = tokens[0].split(" ").filter((token) => token !== "");
            const opCode = first[0];
            const op1 = first[1];
            let op2 = tokens[1].replace(/\s/g, "");
            let op3 = tokens.length > 2 ? tokens[2].replace(/\s/g, "") : null;
            let address = null;
            if (!op3) {
                // LW, LD, L.S, L.D, SW, SD, S.S, S.D
                if (op2[0] !== "F" && op2[0] !== "R") {
                    address = Number(op2);
                    op2 = null;
                }
            }
            if (tags.has(op3)) {
                // BNE, BEQ
                address = tags.get(op3);
                op3 = null;
            }
            if (opCode === "DADDI" || opCode === "DSUBI") {
                op3 = Number(op3);
            }
            return {
                opCode,
                op1,
                op2,
                op3,
                address,
            };
        });
        console.log(parsedCode);
        return parsedCode;
    };

    const getReservationStation = (Instruction) => {
        switch (Instruction.opCode) {
            case "DADDI":
            case "DSUBI":
                return "IA"; // Integer Add/Sub
            // IA data structure
            // {busy: false, op: null, vj: null, vk: null, qj: null, qk: null}
            case "ADD.S":
            case "ADD.D":
            case "SUB.S":
            case "SUB.D":
                return "FA"; // Floating Point Add/Sub
            // FA data structure
            // {busy: false, op: null, vj: null, vk: null, qj: null, qk: null}
            case "MUL.D":
            case "MUL.S":
            case "DIV.D":
            case "DIV.S":
                return "FM"; // Floating Point Multiply/Divide
            // FM data structure
            // {busy: false, op: null, vj: null, vk: null, qj: null, qk: null}
            case "LW":
            case "LD":
            case "L.S":
            case "L.D":
                return "LW"; // Load
            // LW data structure
            // {busy: false, op: null, address: null}
            case "SW":
            case "SD":
            case "S.S":
            case "S.D":
                return "SW"; // Store
            // SW data structure
            // {busy: false, op: null, vj: null, qj: null, address: null}
            case "BNE":
            case "BEQ":
                return "BR"; // Branch
            // BR data structure
            // {busy: false, op: null, vj: null, vk: null, qj: null, qk: null, address: null}
            default:
                return null;
        }
    };

    useEffect(() => {
        let view = {
            clockCycle: 0,
            pc: 0,
            integerRegs: [],
            floatingPointRegs: [],
            cache: [],
            reservationStations: { IA: [], FA: [], FM: [], BR: [], LW: [], SW: [] },
            instructionTable: [],
            readyToWrite: [],
        };
        const fetchCode = async () => {
            try {
                const response = await axios.get("/files/code.txt");
                const parsedCode = parseCode(response.data.split("\n"));
                setCode(parsedCode);
            } catch (error) {
                console.error("Error fetching code:", error);
            }
        };
        const fetchIntegerRegs = async () => {
            let integerRegs = [];
            try {
                const response = await axios.get("/files/integer_reg.txt");
                integerRegs = response.data.split("\n").map((val) => {
                    return { q: 0, v: Number(val.trim()) };
                });
            } catch (error) {
                console.error("Error fetching integer registers:", error);
                integerRegs = Array(32).fill({ q: 0, v: 0 });
            } finally {
                view.integerRegs = integerRegs;
            }
        };

        const fetchFloatingPointRegs = async () => {
            let floatingPointRegs = [];
            try {
                const response = await axios.get("/files/floating_reg.txt");
                floatingPointRegs = response.data.split("\n").map((val) => {
                    return { q: 0, v: Number(val.trim()) };
                });
            } catch (error) {
                console.error("Error fetching floating point registers:", error);
                floatingPointRegs = Array(32).fill({ q: 0, v: 0 });
            } finally {
                view.floatingPointRegs = floatingPointRegs;
            }
        };

        const fetchReservationStations = async () => {
            const createStations = (count, template) =>
                Array.from({ length: count }, () => ({ ...template }));

            let stationsSize = { IA: 3, FA: 3, FM: 2, BR: 1, LW: 2, SW: 2 };
            const response = await axios.get("/files/reservation_stations.txt");
            response.data.split("\n").map((line) => {
                const splittedLine = line.split(":");
                stationsSize[splittedLine[0].trim()] = Number(splittedLine[1].trim());
            });
            let reservationStations = {};
            Object.keys(stationsTemplates).map((key) => {
                reservationStations[key] = createStations(
                    stationsSize[key],
                    stationsTemplates[key]
                );
            });

            view.reservationStations = reservationStations;
        };

        const fetchLatencies = async () => {
            let latencies = {};
            try {
                const response = await axios.get("/files/latencies.txt");
                response.data.split("\n").map((line) => {
                    const splittedLine = line.split(":");
                    latencies[splittedLine[0].trim()] = Number(splittedLine[1].trim());
                });
            } catch (error) {
                console.error("Error fetching latencies:", error);
            } finally {
                setLatencies(latencies);
            }
        };

        fetchCode();
        fetchIntegerRegs();
        fetchFloatingPointRegs();
        fetchReservationStations();
        fetchLatencies();
        setViews([view]);
        // console.log(view);
    }, []);

    // useEffect(() => {
    //     if (views.length === 0) return;
    //     if (code.length === 0) return;
    //     issue(views.at(-1));
    //     console.log(views.at(-1));
    // }, [views, code]);

    const stepBack = () => {
        if (views.length === 1) return;
        setViews(views.slice(0, -1));
    };

    const destructeStationId = (stationId) => {
        let station = stationId.slice(0, 2);
        let index = stationId.slice(2);
        return { station, index };
    };

    const execute = (view) => {
        // who would start
        for (let instruction of view.instructionTable) {
            if (instruction.start) continue;
            const stationId = instruction.station;
            const { station, index } = destructeStationId(stationId);
            let reservationStation = view.reservationStations[station];
            if (!reservationStation[index].busy) continue;
            if (reservationStation[index].qj || reservationStation[index].qk) {
                continue;
            }
            instruction.start = view.clockCycle;
            instruction.end = view.clockCycle + latencies[instruction.opCode] - 1;
            if (station === "LW" || station === "SW") {
                const blockNum = reservationStation[index].address / (blockSize * 4);
                const offset = reservationStation[index].address % (blockSize * 4);
                if (instruction.opCode.includes("D")) {
                } else {
                }
            }
        }
        // who finished
        for (let instruction of view.instructionTable) {
            if (instruction.end !== view.clockCycle - 1) continue;
            view.readyToWrite.push(instruction);
        }
    };

    const calc = (view, station, index) => {
        const tag = station + index;
        if (station === "BR") {
            if (station[index].op === "BEQ") {
                if (station[index].vj === station[index].vk) {
                    view.pc = station[index].address;
                }
            } else {
                if (station[index].vj !== station[index].vk) {
                    view.pc = station[index].address;
                }
            }
            return { tag, value: 0 };
        }
        if (station === "IA") {
            if (station[index].op === "DADDI") {
                const res = Number(station[index].vj) + Number(station[index].vk);
                return { tag, value: res };
            } else {
                const res = Number(station[index].vj) - Number(station[index].vk);
                return { tag, value: res };
            }
        }
        if (station === "FA") {
            if (station[index].op === "ADD.D") {
                const res = Number(station[index].vj) + Number(station[index].vk);
                return { tag, value: res };
            } else if (station[index].op === "SUB.D") {
                const res = Number(station[index].vj) - Number(station[index].vk);
                return { tag, value: res };
            } else if (station[index].op === "ADD.S") {
                const res = Number(station[index].vj) + Number(station[index].vk);
                return { tag, value: res };
            } else if (station[index].op === "SUB.S") {
                const res = Number(station[index].vj) - Number(station[index].vk);
                return { tag, value: res };
            } else {
                return { tag, value: null };
            }
        }
        if (station === "FM") {
            if (station[index].op === "MUL.D") {
                const res = Number(station[index].vj) * Number(station[index].vk);
                return { tag, value: res };
            } else if (station[index].op === "DIV.D") {
                const res = Number(station[index].vj) / Number(station[index].vk);
                return { tag, value: res };
            } else if (station[index].op === "MUL.S") {
                const res = Number(station[index].vj) * Number(station[index].vk);
                return { tag, value: res };
            } else if (station[index].op === "DIV.S") {
                const res = Number(station[index].vj) / Number(station[index].vk);
                return { tag, value: res };
            } else {
                return { tag, value: null };
            }
        }
        if (station === "LW") {
        }
        if (station === "SW") {
        }
    };

    const writeback = (view) => {
        if (view.readyToWrite.length === 0) return;
        const instruction = view.readyToWrite.shift();
        const { station, index } = destructeStationId(instruction.station);
        view.reservationStations[station][index].busy = false;
    };

    const setValOrQ = (view, station, index, operand, v = "vj", q = "qj") => {
        let reg = view.integerRegs[Number(operand.slice(1))];
        if (operand[0] === "F") {
            reg = view.floatingPointRegs[Number(operand.slice(1))];
        }
        if (reg.q === 0) {
            station[index][v] = reg.v;
        } else {
            station[index][q] = reg.q;
        }
    };

    const issue = (view) => {
        if (view.pc === code.length || view.reservationStations["BR"][0].busy) {
            return;
        }
        let instruction = code[view.pc];
        let reservationStation = getReservationStation(instruction);
        if (reservationStation === null) return;
        let station = view.reservationStations[reservationStation];
        let index = station.findIndex((station) => station && !station.busy);
        if (index === -1) return;
        station[index].busy = true;
        station[index].op = instruction.opCode;

        // check for operands
        if (reservationStation === "LW") {
            if (instruction.op2) {
                setValOrQ(view, station, index, instruction.op2);
            } else {
                station[index].address = instruction.address;
            }
        } else if (reservationStation === "SW") {
            setValOrQ(view, station, index, instruction.op1);
            if (instruction.op2) {
                setValOrQ(view, station, index, instruction.op2, "vk", "qk");
            } else {
                station[index].address = instruction.address;
            }
            return;
        } else if (reservationStation === "BR") {
            setValOrQ(view, station, index, instruction.op1);
            setValOrQ(view, station, index, instruction.op2, "vk", "qk");
            station[index].address = instruction.address;
            return;
        } else if (reservationStation === "IA") {
            setValOrQ(view, station, index, instruction.op2);
            station[index].vk = instruction.op3;
        } else {
            setValOrQ(view, station, index, instruction.op2);
            setValOrQ(view, station, index, instruction.op3, "vk", "qk");
        }
        // issue instruction

        if (instruction.op1[0] === "F") {
            view.floatingPointRegs[Number(instruction.op1.slice(1))].q =
                reservationStation + index;
        } else {
            view.integerRegs[Number(instruction.op1.slice(1))].q =
                reservationStation + index;
        }
        view.pc += 1;
    };

    const stepForward = () => {
        // check for issue
        // check for execute
        // check for writeback
        // check for commit

        let view = { ...views.at(-1) };
        view.clockCycle += 1;
        issue(view);
        execute(view);
        writeback(view);
        setViews([...views, view]);
    };

    return (
        <Box
            sx={{
                padding: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Typography variant="h4" gutterBottom>
                Tomasulo Algorithm Simulation
            </Typography>

            {/* Clock Cycle and Current Instruction */}
            <Typography variant="h6">Clock Cycle: {clockCycle}</Typography>
            <Typography variant="h6">Current Instruction:</Typography>

            <Box sx={{ display: "flex", gap: "5%", width: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "column", width: "30%" }}>
                    {/* Code in a table */}
                    <h1>This is Code</h1>
                    {/* Instructions table */}
                    <h1>This is Instructions</h1>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", width: "65%" }}>
                    <Box sx={{ display: "flex", gap: "2%" }}>
                        {/* Integer Register File */}
                        <h1>This is Integer Register File</h1>
                        {/* Floating Point Register File */}
                        <h1>This is Floating Point Register File</h1>
                        {/* Cache */}
                        <h1>This is Cache</h1>
                    </Box>
                    <Box sx={{}}>
                        {/* Integer Add/Sub Reservation Stations */}{" "}
                        <h1>This is Integer Add/Sub Reservation Stations</h1>
                    </Box>
                    <Box sx={{}}>
                        {/* Floating point Add/Sub Reservation Stations */}{" "}
                        <h1>This is Floating point Add/Sub Reservation Stations</h1>
                    </Box>
                    <Box sx={{}}>
                        {/* Floating point Multiply/Divide Reservation Stations */}{" "}
                        <h1>
                            This is Floating point Multiply/Divide Reservation Stations
                        </h1>
                    </Box>
                    <Box sx={{}}>
                        {/* Branch Reservation Stations */}{" "}
                        <h1>This is Branch Reservation Stations</h1>
                    </Box>
                    <Box sx={{ display: "flex", width: "100%", gap: "2%" }}>
                        <Box>
                            {/* Load Reservation Stations */}{" "}
                            <h1>This is Load Reservation Stations</h1>
                        </Box>
                        <Box>
                            {/* Store Reservation Stations */}{" "}
                            <h1>This is Store Reservation Stations</h1>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "2%",
                }}
            >
                <Button
                    variant="contained"
                    onClick={() => {
                        console.log("prev was clicked!");
                    }}
                >
                    Prev Clock Cycle
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        console.log("next was clicked!");
                    }}
                >
                    Next Clock Cycle
                </Button>
            </Box>
        </Box>
    );
}

export default App;
