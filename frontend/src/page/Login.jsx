import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ErrorPopup from '../component/ErrorPopup';

function Login({ handleSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: '',
  });

  const displayError = (message) => {
    setError(message);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setError('');
  };

  const validateFields = () => {
    let valid = true;
    const errors = {
      email: '',
      password: '',
    };

    if (!email) {
      errors.email = 'Email is required';
      valid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      valid = false;
    }

    setFieldErrors(errors);
    return valid;
  };

  const login = () => {
    if (!validateFields()) {
      return;
    }

    axios.post('http://localhost:5005/admin/auth/login', {
      email: email,
      password: password,
    })
      .then((response) => {
        handleSuccess(response.data.token);
      })
      .catch((error) => {
        displayError(error.response.data.error);
      });
  }

  // Handle Enter key press for form submission
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      login();
    }

    if (e.key === 'ArrowDown') {
      // Focus next input
      if (e.target.id === 'email') {
        document.getElementById('password').focus();
      }
    }

    if (e.key === 'ArrowUp') {
      // Focus previous input
      if (e.target.id === 'password') {
        document.getElementById('email').focus();
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-8 px-6 sm:px-12">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-6">LOGIN</h2>

        {/* Login Form */}
        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold">Email:</label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {fieldErrors.email && <p className="text-red-600 text-sm">{fieldErrors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-semibold">Password:</label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {fieldErrors.password && <p className="text-red-600 text-sm">{fieldErrors.password}</p>}
          </div>

          {/* Login Button */}
          <button
            onClick={login}
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </div>

        {/* Register Link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:text-[#1a5bb9]">
              Register here.
            </Link>
          </p>

          {/* New Link to Return to the Landing Page */}
          <p className="mt-2 text-sm text-gray-600">
            <Link to="/" className="text-blue-600 font-semibold hover:text-blue-700">
              Return to the Landing page
            </Link>
          </p>
        </div>
      </div>
      {showPopup && <ErrorPopup message={error} onClose={closePopup} />}
    </div>
  );
};

export default Login;
