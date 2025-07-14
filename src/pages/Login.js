import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
	  e.preventDefault();
	  setError('');

	  try {
		const response = await axios.post('http://localhost:5000/api/login', {
		  "email":email,
		  "password":password
		});

		const { token } = response.data;
		login(token);
		navigate('/dashboard');
	  } catch (err) {
		setError(err.response?.data?.message || 'Login failed');
	  }
	};


  return (
    <div style={styles.container}>
	<h1 className="text-3xl font-bold mb-4">Welcome to Hummingbird</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div style={styles.error}>{error}</div>}
        <button style={styles.button} type="submit">Login</button>
      </form>
	  <p>
	    Don't have an account? <a href="/register">Register here</a>
	  </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '100px auto',
    padding: '20px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontSize: '14px',
  },
};

export default Login;
