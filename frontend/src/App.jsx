import React, { useState, useEffect } from "react";
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

function App() {
    // State for Tomasulo components
    const [clockCycle, setClockCycle] = useState(1);
    const [currentInstruction, setCurrentInstruction] = useState(0);
    const [code, setCode] = useState([]);

    const [views, setViews] = useState([]);
    const [index, setIndex] = useState(0);

    const parseCode = (code) => {
        let tags = new Map();
        const parsedCode = code.map((line, index) => {
            let tokens = line.split(":");
            let tag = null;
            if (tokens.length > 1) {
                tag = tokens[0].replace(/\s/g, "");
                tags[tag] = index;
                tokens.shift();
            }
            tokens = tokens[0].split(",");
            let first = tokens[0].split(" ").filter((token) => token !== "");
            const opCode = first[0];
            const op1 = first[1];
            const op2 = tokens[1].replace(/\s/g, "");
            let op3 = tokens.length > 2 ? tokens[2].replace(/\s/g, "") : null;
            console.log(op3);
            if (tags[op3]) {
                op3 = tags[op3];
            }
            if (tokens[0])
                return {
                    opCode,
                    op1,
                    op2,
                    op3,
                };
        });
        return parsedCode;
    };

    useEffect(() => {
        const fetchCode = async () => {
            try {
                const response = await axios.get("/files/code.txt");
                const parsedCode = parseCode(response.data.split("\n"));
                console.log(parsedCode);
                setCode(parsedCode);
            } catch (error) {
                console.error("Error fetching code:", error);
            }
        };

        fetchCode();
    }, []);

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
            <Typography variant="h6">
                Current Instruction: {currentInstruction}
            </Typography>

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
