import React from 'react';
import { useLocation } from 'react-router-dom';

function ResultsPage() {

    const location = useLocation();
    //eslint-disable-next-line
    const { assessment, timeTaken, moves, correctMoves, incorrectMoves, completed, flows } = location.state || {};
    //eslint-disable-next-line
    console.log(location.state);
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

export default ResultsPage;