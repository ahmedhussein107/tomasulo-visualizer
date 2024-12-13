import React, { useState } from "react";
import Table from "./components/Table";
import { Paper, Typography, Box, Grid } from "@mui/material";

function App() {
    // State for Tomasulo components
    const [clockCycle, setClockCycle] = useState(1);
    const [currentInstruction, setCurrentInstruction] = useState(0);

    const integerRegisterFile = [
        { id: 0, value: 0 },
        { id: 1, value: 10 },
        { id: 2, value: 20 },
    ];

    const floatingRegisterFile = [
        { id: 0, value: 0.4 },
        { id: 1, value: 5.7 },
        { id: 2, value: 9.2 },
    ];

    const cache = [5, 9];

    const reservationStations = Array(6)
        .fill(null)
        .map((_, index) => {
            return {
                id: index,
                busy: false,
                op: null,
                vj: null,
                vk: null,
                qj: null,
                qk: null,
                a: null,
            };
        });

    console.log(reservationStations);

    const instructionTable = [];

    // Columns for rendering register files
    const registerColumns = [
        { field: "id", headerName: "Register", width: 120 },
        { field: "value", headerName: "Value", width: 120 },
    ];

    // Columns for reservation stations
    const reservationColumns = [
        { field: "id", headerName: "ID", width: 80 },
        { field: "busy", headerName: "Busy", width: 80 },
        { field: "op", headerName: "Op", width: 80 },
        { field: "vj", headerName: "Vj", width: 80 },
        { field: "vk", headerName: "Vk", width: 80 },
        { field: "qj", headerName: "Qj", width: 80 },
        { field: "qk", headerName: "Qk", width: 80 },
        { field: "a", headerName: "A", width: 80 },
    ];

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Tomasulo Algorithm Simulation
            </Typography>

            {/* Clock Cycle and Current Instruction */}
            <Typography variant="h6">Clock Cycle: {clockCycle}</Typography>
            <Typography variant="h6">
                Current Instruction: {currentInstruction}
            </Typography>

            <Grid container spacing={4} mt={2}>
                {/* Register Files */}
                <Grid item xs={12} md={6}>
                    <Table
                        rows={integerRegisterFile}
                        columns={registerColumns}
                        title="Integer Register File"
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Table
                        rows={floatingRegisterFile}
                        columns={registerColumns}
                        title="Floating Point Register File"
                    />
                </Grid>

                {/* Cache */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6">Cache</Typography>
                        <Typography>{cache.join(", ")}</Typography>
                    </Paper>
                </Grid>

                {/* Reservation Stations */}
                <Grid item xs={12}>
                    <Table
                        rows={reservationStations}
                        columns={reservationColumns}
                        title="Reservation Stations"
                    />
                </Grid>

                {/* Instruction Table */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6">Instruction Table</Typography>
                        <Typography>Currently empty</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default App;
