import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Home from './Pages/Home';
import ConnectWorldWide from './Pages/ConnectWorldWide';

import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ConnectWorldWide" element={<ConnectWorldWide />} />
      </Routes>
    </Router>
  );
}

export default App;
