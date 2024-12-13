// Columns for rendering register files
export const registerColumns = [
    { field: "id", headerName: "Register", width: 120 },
    { field: "value", headerName: "Value", width: 120 },
];

// Columns for rendering cache
export const cacheColumns = [
    { field: "id", headerName: "Cache", width: 120 },
    { field: "value", headerName: "Block", width: 120 },
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
    { field: "op", headerName: "Op", width: 80 },
    { field: "vj", headerName: "Vj", width: 80 },
    { field: "vk", headerName: "Vk", width: 80 },
    { field: "qj", headerName: "Qj", width: 80 },
    { field: "qk", headerName: "Qk", width: 80 },
    { field: "a", headerName: "A", width: 80 },
];

// Columns for load
export const loadColumns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "op", headerName: "Op", width: 80 },
    { field: "a", headerName: "A", width: 80 },
];

// Columns for store
export const storeColumns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "op", headerName: "Op", width: 80 },
    { field: "vj", headerName: "Vj", width: 80 },
    { field: "qj", headerName: "Qj", width: 80 },
    { field: "a", headerName: "A", width: 80 },
];
