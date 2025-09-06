import "./App.css";
import { Nav, anchor } from "./Components/Nav.jsx";
import { Home } from "./Home.jsx";
import { Dashboard } from "./Dashboard.jsx";
import { MakeQuiz } from "./MakeQuiz.jsx";
import { MakeQuizver0 } from "./Components/MakeQuizver0.jsx";
import { QuizPlatform } from "./QuizPlatform.jsx";
import { Result } from "./Result.jsx";
import { ThemeProvider } from "./Components/ThemeContext";
import { QuizProvider } from "./Components/QuizContext";
import AuthRoutes from './auth/routes';

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
    location.pathname.toLowerCase() === "/auth/login" ||
    location.pathname.toLowerCase() === "/auth/register" ||
    location.pathname.toLowerCase() === "/auth/forgot-password" ||
    location.pathname.toLowerCase() === "/auth/verifyotp"

  return (
    <>
      <ThemeProvider>
        {!hideNav && (
          <div className="mb-[10vh]">
            <Nav>
              {anchor("Home", "Home")}
              {anchor("Make a Quiz", "MakeQuiz")}
              {anchor("Join a Quiz", "JoinQuiz")}
              {anchor("Login", "auth/Login", true)}
            </Nav>
          </div>
        )}
        {hideNav && (
          <div className="mb-[10vh]">
            <Nav />
          </div>
        )}
        <Routes>
          <Route path="/" element={<Navigate to="/Home" />} />
          <Route path="/Home" element={<Home />} />
          {/* <Route path="/auth" element={<Navigate to="/auth/login" />} /> */}
          {/* <Route path="/auth/*" element={<AuthModule />} /> */}
          <Route path="/auth/*" element={<AuthRoutes />} />
          {/* <Route path="/Login" element={<Authenticate />} /> */}
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route
            path="/MakeQuiz"
            element={
              <QuizProvider>
                <MakeQuiz />
              </QuizProvider>
            }
          />
          <Route
            path="/QuizPlatform"
            element={
              <QuizProvider>
                <QuizPlatform />
              </QuizProvider>
            }
          />
          <Route
            path="/Result"
            element={
              <QuizProvider>
                <Result />
              </QuizProvider>
            }
          />
          <Route path="/MakeQuizver0" element={<MakeQuizver0 />} />
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
