import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import History from './pages/History';
import Recommendations from './pages/Recomendations';
import WeeklyFoodPlanManual from './pages/WeeklyFoodPlanManual';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/history" element={<History />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/weekly-plan" element={<WeeklyFoodPlanManual />} />
      </Routes>
    </Router>
  );
}

export default App;
