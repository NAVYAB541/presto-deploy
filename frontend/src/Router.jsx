import React, { useState } from 'react';
import { useLocation, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Register from './page/Register';
import Login from './page/Login';
import Dashboard from './page/Dashboard';
import Logout from './component/Logout';
import LandingPage from './page/LandingPage';

function Router() {

  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (localStorage.getItem('token') != null) {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  const handleNewToken = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    navigate('/dashboard')
  }

  React.useEffect(() => {
    if (token && ['/login', '/register'].includes(location.pathname)) {
      navigate('/dashboard');
    } if (!token && !(['/login', '/register'].includes(location.pathname))) {
      navigate('/');
    }
  }, [token, location.pathname]);

  return (
    <>
      <div>
        {token && (
          <>
            <Link to="/dashboard">Dashboard</Link>
          </>
        )}
      </div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register handleSuccess={handleNewToken} />} />
        <Route path="/login" element={<Login handleSuccess={handleNewToken} />} />
      </Routes>
      {token && (
        <>
          <hr />
          <Logout token={token} setToken={setToken} />
        </>
      )}
    </>
  )
}

export default Router
