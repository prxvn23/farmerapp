import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardSelector() {
  const navigate = useNavigate();
  const [role, setRole] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (!storedRole) {
      alert("You are not logged in!");
      navigate('/');
    } else {
      setRole(storedRole);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-200 flex items-center justify-center">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center w-96">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Select Your Dashboard</h2>

        {role === 'farmer' && (
          <button
            onClick={() => navigate('/farmer')}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded w-full mb-4 transition duration-200"
          >
            👨‍🌾 Farmer Dashboard
          </button>
        )}

        {role === 'user' && (
          <button
            onClick={() => navigate('/user')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded w-full transition duration-200"
          >
            🛒 User Dashboard
          </button>
        )}
      </div>
    </div>
  );
}

export default DashboardSelector;
