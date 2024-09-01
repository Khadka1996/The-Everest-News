'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for app directory
import { FaGoogle, FaTwitter, FaFacebook, FaArrowLeft } from 'react-icons/fa';
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing
import PropTypes from 'prop-types';

const SignupPage = ({ onRegister, onClose }) => {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    // Hash the password before sending it to the server
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Add your registration logic here
    onRegister({ username, email, password: hashedPassword, displayName, phone });
  };

  const handleSocialRegister = (provider) => {
    // Add your social media registration logic here based on the provider (e.g., Google, Twitter, Facebook)
    console.log(`Registering with ${provider}`);
  };

  const handleGoToLogin = () => {
    // Redirect to the "/login" route when the FaArrowLeft icon is clicked
    router.push('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="relative bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="absolute top-4 left-4 cursor-pointer" onClick={handleGoToLogin}>
          <FaArrowLeft className="text-2xl" />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              className="mt-1 p-2 w-full border rounded"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 p-2 w-full border rounded"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 p-2 w-full border rounded"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="displayName" className="block text-gray-700">Display Name</label>
            <input
              type="text"
              id="displayName"
              className="mt-1 p-2 w-full border rounded"
              placeholder="Enter your display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700">Phone / Mobile</label>
            <input
              type="tel"
              id="phone"
              className="mt-1 p-2 w-full border rounded"
              placeholder="Enter your phone/mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Sign Up</button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <a href="/login">
            <a className="text-blue-500">Login</a>
          </a>
        </p>
        <p className="mt-4 text-center">Or sign up using Social Media</p>
        <div className="flex justify-center space-x-4 mt-4">
          <FaGoogle className="text-2xl cursor-pointer" onClick={() => handleSocialRegister('Google')} />
          <FaTwitter className="text-2xl cursor-pointer" onClick={() => handleSocialRegister('Twitter')} />
          <FaFacebook className="text-2xl cursor-pointer" onClick={() => handleSocialRegister('Facebook')} />
        </div>
      </div>
    </div>
  );
};

SignupPage.propTypes = {
  onRegister: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SignupPage;