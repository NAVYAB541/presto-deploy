import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ErrorPopup from '../component/ErrorPopup';

function Register({ handleSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
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
      name: '',
      password: '',
      confirmPassword: '',
    };

    if (!email) {
      errors.email = 'Email is required';
      valid = false;
    }

    if (!name) {
      errors.name = 'Name is required';
      valid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      valid = false;
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      valid = false;
    }

    setFieldErrors(errors);
    return valid;
  };

  const register = () => {
    if (!validateFields()) {
      return;
    }

    // Password mismatch check
    if (password !== confirmPassword) {
      displayError('Passwords do not match. Please try again.');
      return;
    }

    axios.post('http://localhost:5005/admin/auth/register', {
      email: email,
      password: password,
      name: name,
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
      register();
    }

    if (e.key === 'ArrowDown') {
      // Focus next input
      if (e.target.id === 'name') {
        document.getElementById('email').focus();
      } else if (e.target.id === 'email') {
        document.getElementById('password').focus();
      } else if (e.target.id === 'password') {
        document.getElementById('confirmPassword').focus();
      }
    }

    if (e.key === 'ArrowUp') {
      // Focus previous input
      if (e.target.id === 'confirmPassword') {
        document.getElementById('password').focus();
      } else if (e.target.id === 'password') {
        document.getElementById('email').focus();
      } else if (e.target.id === 'email') {
        document.getElementById('name').focus();
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-8 px-6 sm:px-12">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-6">REGISTER</h2>

        {/* Register Form */}
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 text-sm font-semibold">Name:</label>
            <input
              id="name"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {fieldErrors.name && <p className="text-red-600 text-sm">{fieldErrors.name}</p>}
          </div>

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

          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-semibold">Confirm Password:</label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {fieldErrors.confirmPassword && <p className="text-red-600 text-sm">{fieldErrors.confirmPassword}</p>}
          </div>

          {/* Register Button */}
          <button
            onClick={register}
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Register
          </button>
        </div>

        {/* Login Link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">
              Login here.
            </Link>
          </p>

          {/* Return to Landing Page Link */}
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

export default Register;
