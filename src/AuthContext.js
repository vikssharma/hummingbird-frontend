import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
	  const storedToken = localStorage.getItem('token');
	  if (storedToken && isTokenValid(storedToken)) {
		const decoded = jwtDecode(storedToken);
		setToken(storedToken);
		setUserRole(decoded.role);
	  } else {
		localStorage.removeItem('token');
		setToken(null);
		setUserRole(null);
	  }
	  setLoading(false);
	}, []);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };
  
  const isTokenValid = (token) => {
	  try {
		const decoded = jwtDecode(token);
		const currentTime = Date.now() / 1000; // seconds
		return decoded.exp > currentTime;
	  } catch (e) {
		return false;
	  }
	};

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout, userRole  }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
