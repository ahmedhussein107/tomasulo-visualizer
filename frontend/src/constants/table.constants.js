// Columns for rendering register files
export const registerColumns = [
    { field: "id", headerName: "Register", width: 120 },
    { field: "q", headerName: "Q", width: 120 },
    { field: "v", headerName: "V", width: 120 },
];

// Columns for rendering Code
export const codeColumns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "opCode", headerName: "Op", width: 80 },
    { field: "op1", headerName: "A", width: 80 },
    { field: "op2", headerName: "B", width: 80 },
    { field: "op3", headerName: "C", width: 80 },
    { field: "address", headerName: "Address", width: 80 },
];

// Columns for rendering instruction table
export const instructionColumns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "issue", headerName: "Issue", width: 80 },
    { field: "station", headerName: "Station", width: 80 },
    { field: "opCode", headerName: "Op", width: 80 },
    { field: "op1", headerName: "A", width: 80 },
    { field: "op2", headerName: "B", width: 80 },
    { field: "op3", headerName: "C", width: 80 },
    { field: "address", headerName: "Address", width: 80 },
    { field: "start", headerName: "Start", width: 80 },
    { field: "end", headerName: "End", width: 80 },
    { field: "write result", headerName: "Write Result", width: 80 },
];

// Columns for rendering cache
export const cacheColumns = [
    { field: "id", headerName: "Cache", width: 120 },
    { field: "blockNum", headerName: "Block", width: 120 },
    { field: "block", headerName: "Value", width: 120 },
];

// Columns for reservation stations
export const reservationColumns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "busy", headerName: "Busy", width: 80 },
    { field: "op", headerName: "Op", width: 80 },
    { field: "vj", headerName: "Vj", width: 80 },
    { field: "vk", headerName: "Vk", width: 80 },
    { field: "qj", headerName: "Qj", width: 80 },
    { field: "qk", headerName: "Qk", width: 80 },
];

// Columns for branch
export const branchColumns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "busy", headerName: "Busy", width: 80 },
    { field: "op", headerName: "Op", width: 80 },
    { field: "vj", headerName: "Vj", width: 80 },
    { field: "vk", headerName: "Vk", width: 80 },
    { field: "qj", headerName: "Qj", width: 80 },
    { field: "qk", headerName: "Qk", width: 80 },
    { field: "address", headerName: "A", width: 80 },
];

// Columns for load
export const loadColumns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "busy", headerName: "Busy", width: 80 },
    { field: "op", headerName: "Op", width: 80 },
    { field: "vj", headerName: "Vj", width: 80 },
    { field: "qj", headerName: "Qj", width: 80 },
    { field: "address", headerName: "A", width: 80 },
];

// Columns for store
export const storeColumns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "busy", headerName: "Busy", width: 80 },
    { field: "op", headerName: "Op", width: 80 },
    { field: "vj", headerName: "Vj", width: 80 },
    { field: "vk", headerName: "Vk", width: 80 },
    { field: "qj", headerName: "Qj", width: 80 },
    { field: "qk", headerName: "Qk", width: 80 },
    { field: "address", headerName: "A", width: 80 },
];
