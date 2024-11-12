import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { sendGameData } from './api';

const gridSize = 5;  
const pairs = [
  { color: 'red', start: [1, 2], end: [1, 4] },
  { color: 'blue', start: [0, 0], end: [2, 3] },
  { color: 'yellow', start: [4,0], end: [2, 4] },
  { color: 'green', start: [2, 2], end: [0, 4] },

];

function App() {
  const [grid, setGrid] = useState(
    Array.from({ length: gridSize }, () => Array(gridSize).fill(null))
  );
  const [activeFlow, setActiveFlow] = useState(null); 
  const [moveCount, setMoveCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false); 
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
      newGrid[pair.start[0]][pair.start[1]] = pair.color; 
      newGrid[pair.end[0]][pair.end[1]] = pair.color; 
    });
    setGrid(newGrid);
  };

  
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
      setIsDragging(true); 
    }
  };

  const handleCellOver = (row, col) => {
    if (!activeFlow || !isDragging) return;  

    
    const lastCell = activeFlow.path[activeFlow.path.length - 1];

    // Only add the cell to the path if it is adjacent to the last cell
    if (
      (Math.abs(lastCell[0] - row) === 1 && lastCell[1] === col) ||  
      (Math.abs(lastCell[1] - col) === 1 && lastCell[0] === row)     
    ) {
      
      if (lastCell[0] !== row || lastCell[1] !== col) {
        // Check if the cell is already colored
        if (grid[row][col] !== null) return; 

        const newPath = [...activeFlow.path, [row, col]];
        setActiveFlow({ ...activeFlow, path: newPath });
        updateGridPath(newPath);
      }
    }
  };

  const handleCellUp = () => {
    if (activeFlow) {
      
      setMoveCount(prevCount => prevCount + 1); 
      completeFlow(activeFlow);
      if (isPuzzleSolved()) {
        console.log('Puzzle solved!');
        setIsGameCompleted(true);
        
        handleGameComplete(true);
      }
    }
    setActiveFlow(null);
    setIsDragging(false); 
  };

  const updateGridPath = (path) => {
    const newGrid = grid.map(row => row.slice()); // Deep copy
    path.forEach(([row, col]) => {
      newGrid[row][col] = activeFlow.color; 
    });
    setGrid(newGrid);
  };

  const completeFlow = (flow) => {
    
    const pair = pairs.find(p => p.color === flow.color);
    if (!pair) return;

    // Check if the path ends at the correct endpoint
    const lastCell = flow.path[flow.path.length - 1];
    const isFlowComplete = (lastCell[0] === pair.end[0] && lastCell[1] === pair.end[1]);

    if (isFlowComplete) {
      console.log(`${flow.color} flow completed`);
      
    } else {
      console.log(`${flow.color} flow is incomplete`);
    }
   

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
  
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (!grid[row][col]) {
          return false;
        }
      }
    }
  
    return true; 
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
    setMoveCount(0); 
    setActiveFlow(null); 
    setIsDragging(false); 
    
    const newGrid = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
    pairs.forEach(pair => {
      newGrid[pair.start[0]][pair.start[1]] = pair.color; 
      newGrid[pair.end[0]][pair.end[1]] = pair.color; 
    });
    setGrid(newGrid); 
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
