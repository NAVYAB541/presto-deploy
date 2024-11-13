import React, { useState } from 'react';
import { useLocation, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import Register from './page/Register';
import Login from './page/Login';
import Dashboard from './page/dashboard/Dashboard';
import Logout from './component/Logout';
import LandingPage from './page/LandingPage';
import EditPresentation from './page/dashboard/page/EditPresentation';

function Router() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (localStorage.getItem('token') !== token) {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  const handleNewToken = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    navigate('/dashboard')
  }

  React.useEffect(() => {
    if (token && ['/login', '/register', '/'].includes(location.pathname)) {
      navigate('/dashboard');
    } else if (!token && !(['/login', '/register'].includes(location.pathname))) {
      navigate('/');
    }
  }, [token, location.pathname]);

  return (
    <>
      {token && (
        <nav className="bg-black text-white flex justify-between items-center px-6 py-4">
          <div>
            <Link
              to="/dashboard"
              className={`text-lg font-semibold hover:text-blue-600 transition-all duration-200 ${location.pathname === '/dashboard' ? 'underline underline-offset-4' : ''}`}
              style={{
                textUnderlineOffset: '6px', // Spacing between underline and text
              }}
            >
              <span className="hover:scale-105 transform transition-transform duration-200">Dashboard</span>
            </Link>
          </div>
          <div className="flex items-center">
            <Logout token={token} setToken={setToken} />
          </div>
        </nav>
      )}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard token={token} />} />
        <Route path="/register" element={<Register handleSuccess={handleNewToken} />} />
        <Route path="/login" element={<Login handleSuccess={handleNewToken} />} />
        <Route path="/presentation/:id" element={<EditPresentation />} />

        {/* Catch-all route for invalid paths */}
        <Route
          path="*"
          element={token ? <Navigate to="/dashboard" /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  )
}

export default Router
