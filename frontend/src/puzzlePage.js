// src/App.js
import React, { useState } from 'react';
import './App.css';

// Hardcoded Grid and Pairs
const gridSize = 5;
const pairs = [
  { id: 1, color: 'red', cells: [[0, 0], [4, 4]] },
  { id: 2, color: 'blue', cells: [[0, 1], [4, 3]] },
  { id: 3, color: 'green', cells: [[1, 1], [3, 3]] },
  { id: 4, color: 'yellow', cells: [[2, 2], [2, 3]] },
];

function App() {
  // Initialize grid with empty cells
  const [grid, setGrid] = useState(
    Array.from({ length: gridSize }, () => Array(gridSize).fill(null))
  );
  const [currentColor, setCurrentColor] = useState(null);

  // Handle cell click
  const handleCellClick = (row, col) => {
    // Check if a color is selected
    if (!currentColor) return;

    // Create a new grid to avoid mutating state directly
    const newGrid = grid.map((rowData, rowIndex) => 
      rowData.map((cellData, colIndex) => 
        rowIndex === row && colIndex === col ? currentColor : cellData
      )
    );

    // Find the pair for the selected color
    const selectedPair = pairs.find(pair => pair.color === currentColor);
    if (!selectedPair) return;

    // Check if the clicked cell is part of the selected pair's path
    const isInPath = selectedPair.cells.some(cell => cell[0] === row && cell[1] === col);
    if (isInPath) {
      // Update the cell color in the new grid
      setGrid(newGrid);
      // Reset current color after placing it on the grid
      setCurrentColor(null);
    }
  };
// Render grid and puzzle setup
  return (
    <div className="App">
      <h1>Flow Free - Hard Puzzle</h1>
      <div
        className="grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, 50px)`,
          gap: '2px', // Optional: adds space between cells for visibility
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="cell"
              style={{
                width: '50px',
                height: '50px',
                backgroundColor: cell || 'lightgray',
                border: '1px solid black',
              }}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            ></div>
          ))
        )}
      </div>

      <div className="controls">
        <h2>Select Color</h2>
        {pairs.map(pair => (
          <button
            key={pair.color}
            style={{ backgroundColor: pair.color, color: 'white', margin: '5px' }}
            onClick={() => setCurrentColor(pair.color)}
          >
            {pair.color}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;