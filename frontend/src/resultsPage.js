import React from 'react';
import './App.css';
import { useLocation } from 'react-router-dom';

function ResultsPage() {

    const location = useLocation();
    //eslint-disable-next-line
    const { assessment, timeTaken, moves, correctMoves, incorrectMoves, completed } = location.state || {};
    //eslint-disable-next-line
    console.log(location.state);
    return (
        <div>
            <header className = "App-header">
                <p>
                    <strong>Puzzle Results</strong>
                </p>
            </header>
            <header className = "App-text">
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
            </header>
        </div>
    );
}

export default ResultsPage;