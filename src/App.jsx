import { useEffect , useState } from 'react'
import './App.css'
import { Nav } from './nav.jsx'
import { Home } from './Home.jsx'
import { MakeQuiz } from './MakeQuiz.jsx'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)
     useEffect(() => {
        fetch('http://localhost:5000/api/items')
          .then((response) => response.json())
          .then((data) => console.log(data));
      }, []);
  return (
    <>
    <Router>
    <Nav />
    <Routes>
    <Route path="/" element={<Navigate to="/Home" />} />
    <Route path="/Home" element={<Home />} />
    <Route path="/MakeQuiz" element={<MakeQuiz />} />
    </Routes>
    </Router>
    </>
  )
}

export default App
