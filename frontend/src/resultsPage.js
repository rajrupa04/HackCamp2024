import React from 'react';

function resultsPage() {
    const { assessment, timeTaken, moves, correctMoves, incorrectMoves, completed } = location.state || {};
    return (
        <div>
            <h1>Game Results</h1>
            {completed ? (
                <>
                    <p>Learning Style Assessment: {assessment}</p>
                    <p>Total Moves: {moves}</p>
                    <p>Time Taken: {timeTaken} seconds</p>
                    <p>Correct Moves: {correctMoves}</p>
                    <p>Incorrect Moves: {incorrectMoves}</p>
                </>
            ) : (
                <p>No data available.</p>
            )}
        </div>
    );
}

export default resultsPage;