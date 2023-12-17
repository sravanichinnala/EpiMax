import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeNavigation from "./components/HomeNavigation";
import LoginSignup from "./components/LoginSignup/LoginSignup";
import Tasks from "./components/Tasks/Tasks";
import AuthTokenContextState from "./context/AuthTokenContextState";
function App() {
  return (
    <div className="App">
      <AuthTokenContextState>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeNavigation />} />
            <Route path="login-signup" element={<LoginSignup />} />
            <Route path="/tasks" element={<Tasks />} />
          </Routes>
        </BrowserRouter>
      </AuthTokenContextState>
    </div>
  );
}

export default App;
