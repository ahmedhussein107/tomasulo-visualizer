# Tomasulo Algorithm Visualizer

An interactive web-based visualization tool for understanding the Tomasulo Algorithm, built with React. This project helps visualize dynamic instruction scheduling and out-of-order execution in modern processors.

## Features

- Real-time visualization of processor components
- Step-by-step execution tracking
- Support for multiple instruction types:
  - Arithmetic operations (ADD, SUB, MUL, DIV)
  - Memory operations (LOAD, STORE)
  - Branch operations
- Interactive clock cycle navigation
- Visual representation of:
  - Register files (Integer and Floating Point)
  - Reservation stations
  - Instruction status
  - Common Data Bus operations

## Demo

[Add screenshots or GIF here]

## Installation

Make sure you have Node.js (v14 or higher) installed on your system.

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tomasulo-visualizer.git
cd tomasulo-visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Usage

1. Load your assembly code in the supported format:
```assembly
ADD.D F1, F2, F3
MUL.D F4, F1, F5
L.D F6, 100
```

2. Use the control buttons to:
- Step forward through clock cycles
- Step backward to review previous states
- View current processor state

3. Monitor the visualization panels showing:
- Current instruction status
- Register file contents
- Reservation station states
- Memory operations

## File Format

The simulator accepts input files in the following formats:

### Code File (code.txt)
```assembly
ADD.D F1, F2, F3
MUL.D F4, F1, F5
```

### Register Values (integer_reg.txt, floating_reg.txt)
```
0
1
2
2
5
1
...
```

### Latencies (latencies.txt)
```
ADD.D:2
MUL.D:10
L.D:2
```

### Reservation Station sizes (reservation_stations.txt)
```
IA:6
FA:6
FM:6
BR:1
LW:6
SW:6
```

