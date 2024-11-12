import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white py-8 px-6 sm:px-12">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold leading-tight">Welcome to Presto!</h1>
        <p className="mt-2 text-xl opacity-80">Create. Present. Impress.</p>
      </div>
      <div className="max-w-md w-full space-y-6">
        <p className="text-center text-lg opacity-70">Sign up or login to get started now</p>
        <div className="flex justify-center space-x-6">
          <Link
            to="/login"
            className="w-full sm:w-auto inline-block px-6 py-3 bg-white text-black font-semibold rounded-lg text-lg text-center hover:bg-gray-200 transition duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="w-full sm:w-auto inline-block px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg text-lg text-center hover:bg-white hover:text-black transition duration-300"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
