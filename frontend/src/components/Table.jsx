import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, Typography } from "@mui/material";

const Table = ({ rows, columns, title }) => {
    return (
        <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">{title}</Typography>
            <DataGrid rows={rows} columns={columns} autoHeight disableSelectionOnClick />
        </Paper>
    );
};

export default Table;
