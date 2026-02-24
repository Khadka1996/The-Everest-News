'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for app directory
import { FaGoogle, FaTwitter, FaFacebook, FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';

const LoginPage = ({ onLogin, onClose }) => {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    // Add your login logic here
    const isLoginSuccessful = username === process.env.NEXT_PUBLIC_USERNAME && password === process.env.NEXT_PUBLIC_PASSWORD;

    if (isLoginSuccessful) {
      onLogin({ username, password, rememberMe });
      window.location.href = 'https://admin.theeverestnews.com';
    }
     else {
      // Handle unsuccessful login
      console.log('Login failed');
      // Set an error state or display an error message to the user
      // setErrorState(true);
    }
  };

  const handleSocialLogin = (provider) => {
    // Add your social media login logic here based on the provider (e.g., Google, Twitter, Facebook)
    console.log(`Logging in with ${provider}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="relative bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="absolute top-4 right-4">
          <a href="/" ><FaTimes className="text-2xl" /></a>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              className="mt-1 p-2 w-full border rounded"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 w-full border rounded"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              className="mr-2"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="rememberMe" className="text-gray-700">Remember me</label>
          </div>
          <div className="mb-4 text-right">
            <a href="/forgot-password" className="text-blue-500">Forgot password?</a>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
        </form>
        <p className="mt-4 text-center">
          Not have an account yet?{' '}
          <a href="/signup" className="text-blue-500">Signup Now</a>
        </p>
        <p className="mt-4 text-center">Or use Social Media</p>
        <div className="flex justify-center space-x-4 mt-4">
          <FaGoogle className="text-2xl cursor-pointer" onClick={() => handleSocialLogin('Google')} />
          <FaTwitter className="text-2xl cursor-pointer" onClick={() => handleSocialLogin('Twitter')} />
          <FaFacebook className="text-2xl cursor-pointer" onClick={() => handleSocialLogin('Facebook')} />
        </div>
      </div>
    </div>
  );
};

LoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LoginPage;