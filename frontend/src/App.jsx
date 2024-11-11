import React, { useState } from 'react';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import { BrowserRouter, Navigate, Routes, Route, Link } from 'react-router-dom';
import Register from './page/Register';
import Login from './page/Login';
import Logout from './component/Logout'

const Dashboard = function () {
  return <>dashboard</>;
}

function App() {

  const [token, setToken] = useState(null);

  React.useEffect(() => {
    if (localStorage.getItem('token') != null) {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <div>
          {token ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
            </>
          ) : (
            <>
              <Link to="/register">Register</Link>
              &nbsp;|&nbsp;
              <Link to="/login">Login</Link>
            </>
          )}
        </div>
        <Routes>
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register setTokenFn={setToken} />} />
          <Route path="/login" element={<Login setTokenFn={setToken} />} />
        </Routes>
        {token && (
          <>
            <hr />
            <Logout token={token} setToken={setToken} />
          </>
        )}
      </BrowserRouter >
    </>
  )
}

export default App
