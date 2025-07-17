import { useEffect, useState } from "react";
import "./App.css";
import { Nav } from "./Nav.jsx";
import { Home } from "./Home.jsx";
import { MakeQuiz } from "./MakeQuiz.jsx";
import { QuizPlatform } from "./QuizPlatform.jsx";
import { Result } from "./Result.jsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

function AppContent() {
  const location = useLocation();
  // Hide Nav on /QuizPlatform
  const hideNav = location.pathname.toLowerCase() === "/quizplatform";

  return (
    <>
      {!hideNav && (
        <div className="mb-20">
          <Nav />
        </div>
      )}
      <Routes>
        <Route path="/" element={<Navigate to="/Home" />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/MakeQuiz" element={<MakeQuiz />} />
        <Route path="/QuizPlatform" element={<QuizPlatform />} />
        <Route path="/Result" element={<Result />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
