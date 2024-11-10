import logo from './logo.svg';
import './App.css';
import { Link } from 'react-router-dom';

const intro = "yayaypyappyapyapyap";

function startPage() {
  return (
    <div>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            <strong>Skill Scope</strong>
          </p>
        </header>
        
      </div>
      
      <div className="App">
        <header className="App-text">
            <p>
            {intro}
            </p>
            <Link to="/puzzle-page">
                <button className = "center-button">
                    Lets go
                </button>
            </Link>
        </header>
        
    </div>
  </div>
  );
}

export default startPage;