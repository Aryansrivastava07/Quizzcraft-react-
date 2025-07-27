import { useEffect, useState } from "react";
import "./App.css";
import { Nav, anchor } from "./Nav.jsx";
import { Home } from "./Home.jsx";
import { Login } from "./Login.jsx";
import { Dashboard } from "./Dashboard.jsx";
import { MakeQuiz } from "./MakeQuiz.jsx";
import { QuizPlatform } from "./QuizPlatform.jsx";
import { Result } from "./Result.jsx";
import { ThemeProvider } from "./ThemeContext";
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
  const hideNav =
    location.pathname.toLowerCase() === "/quizplatform" ||
    location.pathname.toLowerCase() === "/login" ||
    location.pathname.toLowerCase() === "/register";
  
  return (
    <>
      <ThemeProvider>
        {!hideNav && (
          <div className="mb-[10vh]">
            <Nav>
              {anchor("Home", "Home")}
              {anchor("Make a Quiz", "MakeQuiz")}
              {anchor("Join a Quiz", "JoinQuiz")}
              {anchor("Login", "Login", true)}
            </Nav>
          </div>
        )}
        <Routes>
          <Route path="/" element={<Navigate to="/Home" />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/MakeQuiz" element={<MakeQuiz />} />
          <Route path="/QuizPlatform" element={<QuizPlatform />} />
          <Route path="/Result" element={<Result />} />
        </Routes>
      </ThemeProvider>
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
