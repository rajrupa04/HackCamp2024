import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { sendGameData } from './api';

const gridSize = 5;  // Sample 5x5 grid for demonstration
const pairs = [
  { color: 'red', start: [1, 2], end: [1, 4] },
  { color: 'blue', start: [0, 0], end: [2, 3] },
  { color: 'yellow', start: [4,0], end: [2, 4] },
  { color: 'green', start: [2, 2], end: [0, 4] },
  // Add more pairs as needed
];

function App() {
  const [grid, setGrid] = useState(
    Array.from({ length: gridSize }, () => Array(gridSize).fill(null))
  );
  const [activeFlow, setActiveFlow] = useState(null); // Stores current flow being drawn
  const [moveCount, setMoveCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false); // Track if dragging is active
  const [timeSpent, setTimeSpent] = useState(0);
  const [correctMoves, setCorrectMoves] = useState(0);
  const [incorrectMoves, setIncorrectMoves] = useState(0);
  const [isGameCompleted, setIsGameCompleted] = useState(false);

  const navigate = useNavigate();

  const [error, setError] = useState(null);


  // Initialize the grid with color pairs' start and end points
  const initializeGrid = () => {
    const newGrid = grid.map(row => row.slice());
    pairs.forEach(pair => {
      newGrid[pair.start[0]][pair.start[1]] = pair.color; // Set start point
      newGrid[pair.end[0]][pair.end[1]] = pair.color; // Set end point
    });
    setGrid(newGrid);
  };

  // Call initializeGrid once when the app is mounted
  useEffect(() => {
    initializeGrid();
    const timer = setInterval(() => {
      setTimeSpent(prevTime => prevTime + 1);
    }, 1000);
    console.log("isGameCompleted:", isGameCompleted);
    return () => clearInterval(timer);
  }, [isGameCompleted]);



  const handleCellDown = (row, col) => {
    const selectedPair = pairs.find(
      pair => (pair.start[0] === row && pair.start[1] === col) || 
              (pair.end[0] === row && pair.end[1] === col)
    );
    if (selectedPair) {
      setActiveFlow({ color: selectedPair.color, path: [[row, col]] });
      setIsDragging(true); // Start dragging
    }
  };

  const handleCellOver = (row, col) => {
    if (!activeFlow || !isDragging) return;  // Only update during dragging

    // Avoid adding duplicate cells to the path
    const lastCell = activeFlow.path[activeFlow.path.length - 1];

    // Only add the cell to the path if it is adjacent to the last cell
    if (
      (Math.abs(lastCell[0] - row) === 1 && lastCell[1] === col) ||  // Adjacent in row
      (Math.abs(lastCell[1] - col) === 1 && lastCell[0] === row)     // Adjacent in column
    ) {
      // Avoid adding the same cell again
      if (lastCell[0] !== row || lastCell[1] !== col) {
        // Check if the cell is already colored
        if (grid[row][col] !== null) return;  // Skip if the cell is already filled

        const newPath = [...activeFlow.path, [row, col]];
        setActiveFlow({ ...activeFlow, path: newPath });
        updateGridPath(newPath);
      }
    }
  };

  const handleCellUp = () => {
    if (activeFlow) {
      
      setMoveCount(prevCount => prevCount + 1); // Increment move count for completed flow
      completeFlow(activeFlow);
      if (isPuzzleSolved()) {
        console.log('Puzzle solved!');
        setIsGameCompleted(true);
        // Trigger any end-of-game logic here, like showing a success message or triggering save to backend
        
        handleGameComplete(true);
      }
    }
    setActiveFlow(null);
    setIsDragging(false); // Stop dragging
  };

  const updateGridPath = (path) => {
    const newGrid = grid.map(row => row.slice()); // Deep copy
    path.forEach(([row, col]) => {
      newGrid[row][col] = activeFlow.color; // Set the cell to active flow color
    });
    setGrid(newGrid);
  };

  const completeFlow = (flow) => {
    // Find the start and end pair for the flow color
    const pair = pairs.find(p => p.color === flow.color);
    if (!pair) return;

    // Check if the path ends at the correct endpoint
    const lastCell = flow.path[flow.path.length - 1];
    const isFlowComplete = (lastCell[0] === pair.end[0] && lastCell[1] === pair.end[1]);

    if (isFlowComplete) {
      console.log(`${flow.color} flow completed`);
      // Add any other logic to mark the flow as complete
      // For example, store it in a completed flows array or mark it as complete in state
    } else {
      console.log(`${flow.color} flow is incomplete`);
    }
    // Check if path completes a pair, update accordingly
    // Logic to finalize the flow and check if puzzle is solved

  };

  const isPuzzleSolved = () => {
    // Check if all pairs are connected correctly
    for (const pair of pairs) {
      const startColor = grid[pair.start[0]][pair.start[1]];
      const endColor = grid[pair.end[0]][pair.end[1]];
  
      // Check if start and end points are connected with the correct color path
      if (!startColor || startColor !== endColor) {
        return false;
      }
    }
  
    // Optionally, check that there are no empty cells if that's part of the puzzle rules
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (!grid[row][col]) {
          return false;
        }
      }
    }
  
    return true; // If all pairs are connected and grid is filled, puzzle is solved
  };

  const getPathForFlow = (color) => {
    return []; // Replace with actual path logic
  };
  
  const handleGameComplete = async(isComplete = false) => {
    
    const gameData = {
        totalTime: timeSpent,
        totalMoves: moveCount,
        correctMoves: correctMoves,
        incorrectMoves: incorrectMoves,
        completed: isComplete,
        flows: pairs.map(pair => ({        
          color: pair.color,        
          start: pair.start,        
          end: pair.end,        
          path: getPathForFlow(pair.color),      
        }))
    };

    console.log(JSON.stringify(gameData, null, 2));
    try {
      const response = await sendGameData(gameData);

      //setAssessment(response.assessment);
      //console.log('Assessment received:', response.assessment);
      navigate('/results-page', { 
        state: { 
            assessment: response.assessment,
            timeTaken: gameData.totalTime,
            moves: gameData.totalMoves,
            correctMoves: gameData.correctMoves,
            incorrectMoves: gameData.incorrectMoves,
            completed: gameData.completed
        }
      });
    } catch (err) {
      setError('Error saving game data');
    }

  };

  
  // Reset function to clear the grid
  const resetGrid = () => {
    setMoveCount(0); // Reset move count
    setActiveFlow(null); // Clear the active flow
    setIsDragging(false); // Stop dragging
    // Manually reset the grid to the initial state
    const newGrid = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
    pairs.forEach(pair => {
      newGrid[pair.start[0]][pair.start[1]] = pair.color; // Set start point
      newGrid[pair.end[0]][pair.end[1]] = pair.color; // Set end point
    });
    setGrid(newGrid); // Set the grid state to the reset grid
  };
  

  return (
    <div className="App">
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${gridSize}, 50px)` }}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((cellColor, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`grid-cell ${cellColor ? `filled-${cellColor}` : ''}`}
                onMouseDown={() => handleCellDown(rowIndex, colIndex)}
                onMouseEnter={() => handleCellOver(rowIndex, colIndex)}
                onMouseUp={handleCellUp}
                style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: cellColor ? cellColor : 'lightgray',
                  border: '1px solid black',
                  position: 'relative',
                }}
              >
                {cellColor && <div className="dot" style={{
                  backgroundColor: cellColor,
                  width: '15px',
                  height: '15px',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}></div>}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="info">
        <p>Moves: {moveCount}</p>
      </div>
      <button onClick={resetGrid} style={{ padding: '10px', margin: '20px' }}>Reset</button>
      <button onClick={handleGameComplete} 
        style={{ padding: '10px', margin: '20px' }}>Finish Game</button>
    </div>
  );
}

export default App;
