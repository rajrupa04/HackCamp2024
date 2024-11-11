import logo from './logo.svg';
import './App.css';
import { Link } from 'react-router-dom';

const intro = "Unlock your full potential with personalized career recommendations based on your unique learning style, skills, and interests. Our tool uses data-driven insights to guide you towards career opportunities that align with your strengths, growth potential, and personal aspirations. Whether you're exploring new career paths or looking to advance in your current field, we’ll help you navigate your journey with confidence and clarity.";

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