import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import History from './pages/History';
import Recommendations from './pages/Recomendations';
import WeeklyFoodPlanManual from './pages/WeeklyFoodPlanManual';
import Measurements from './pages/Measurements';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Informacion from './pages/Informacion';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  // this component is inside Router so we can use hooks
  const location = useLocation();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Public / authenticated routes */}
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={[1,2,3,4]}><Dashboard /></ProtectedRoute>} />
        <Route path="/measurements" element={<ProtectedRoute allowedRoles={[1,2,3,4]}><Measurements /></ProtectedRoute>} />
        <Route path="/weekly-plan" element={<ProtectedRoute allowedRoles={[1,2]}><WeeklyFoodPlanManual /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute allowedRoles={[1,2,4]}><History /></ProtectedRoute>} />
        <Route path="/recommendations" element={<ProtectedRoute allowedRoles={[1,2]}><Recommendations /></ProtectedRoute>} />

        {/* Admin only */}
        <Route path="/register" element={<ProtectedRoute allowedRoles={[1]}><Register /></ProtectedRoute>} />

        {/* Informational */}
        <Route path="/informacion" element={<Informacion />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      {/* Footer: hide on /login */}
      {location.pathname !== '/login' && <Footer />}
    </>
  );
}


export default App;
