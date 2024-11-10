import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import StartPage from './startPage'
import PuzzlePage from './puzzlePage'
import './App.css';

const intro = "yayaypyappyapyapyap";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<StartPage/>} />
          <Route path="/puzzle-page" element={<PuzzlePage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
