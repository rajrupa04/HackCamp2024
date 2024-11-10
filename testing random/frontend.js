import './frontend.css';
import { useState, useEffect } from 'react';
import React from 'react';


const GameState = {
};

const intro = "yayaypyappyapyapyap";


function App() {
  return (
    <div className = "body">
      <header className="header">
        <h1>Skill Scope</h1>
        <p>Discover your learning style and career path through engaging puzzles.</p>
        <button onClick={() => alert('Get Started!')}>Get Started</button>
      </header>
    </div>
  );
}
export default App;
