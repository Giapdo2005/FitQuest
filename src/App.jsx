import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Auth from './components/Auth.jsx';
import Navbar from './components/Navbar.jsx';
import SignUp from './components/Signup.jsx';
import Login from './components/Login.jsx';
import Workout from "./components/Workout.jsx";


function App() {
  const location = useLocation();

  return (
    <div>
      {location.pathname !== '/auth' && location.pathname !== '/signup' && location.pathname !== '/login' && <Navbar />}
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/workout" element={<Workout/>}/>
      </Routes>
    </div>
  )
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}


export default AppWrapper;
