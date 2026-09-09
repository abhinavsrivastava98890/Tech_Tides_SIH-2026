import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/Home/HomePage';
import Dashboard from './pages/Dashboard';
import LiveMonitoring from './pages/LiveMonitoring';
import Sites from './pages/Sites';
import WaterQuality from './pages/WaterQuality';
import Modules from './pages/Modules';
import Alerts from './pages/Alerts';
import Maintenance from './pages/Maintenance';
import Analytics from './pages/Analytics';
import Admin from './pages/Admin';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const isAuth = sessionStorage.getItem('supervisor_auth') === 'true';
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Home Page */}
        <Route path="/" element={<HomePage />} />
        
        {/* Protected Supervisor Dashboard */}
        <Route path="/supervisor" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/supervisor/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="live" element={<LiveMonitoring />} />
          <Route path="sites" element={<Sites />} />
          <Route path="quality" element={<WaterQuality />} />
          <Route path="modules" element={<Modules />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="admin" element={<Admin />} />
        </Route>
        
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
