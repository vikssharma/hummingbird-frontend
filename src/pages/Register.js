import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';


const Register = () => {
  const host_uri = 'http://34.229.222.57:5000';
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);	
	
  const { login } = useAuth();
  //const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email.');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    try {
      const response = await axios.post(host_uri+'/api/register', formData);
      const { token } = response.data;
      login(token);
	  toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (err) {
	  const msg = err.response?.data?.message || 'Registration failed';	
	  toast.error(msg);
      setError(msg);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 shadow-lg border rounded-md">
      <h1 className="text-3xl font-bold mb-4">Welcome to Hummingbird</h1>
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input
          type="name"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="p-3 border rounded"
        />
		<input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="p-3 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password (min 6 characters)"
          value={formData.password}
          onChange={handleChange}
          required
          className="p-3 border rounded"
        />

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          Register
        </button>
      </form>
      <p className="text-sm text-center mt-4">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 underline">
          Login here
        </a>
      </p>
    </div>
  );
};

export default Register;
