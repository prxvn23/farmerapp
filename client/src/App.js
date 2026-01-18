import React from 'react';
import './index.css';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import FarmerDashboard from './components/FarmerDashboard';
import UserDashboard from "./components/UserDashboard"; // Fixed quote style
import DashboardSelector from './components/DashboardSelector';

function DashboardSelectorWrapper() {
  const location = useLocation();
  const role = location.state?.role || 'user';
  return <DashboardSelector role={role} />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardSelector />} />
        <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/user" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
