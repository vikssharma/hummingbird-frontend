import React, { useEffect, useState, useRef  } from 'react';
import { useAuth } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import useDarkMode from '../hooks/useDarkMode'; 

const Navbar = () => {
  const { logout } = useAuth();
  const [username, setUsername] = useState('');
  const { token } = useAuth(); 
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();  
  const [darkMode, setDarkMode] = useDarkMode();
  
  useEffect(() => {
    
    if (token) {
      try {
        const payload = token ? JSON.parse(atob(token.split('.')[1])) : {};
        setUsername(payload.name || 'Unknown');
      } catch (error) {
        console.error('Invalid token', error);
        setUsername('');
      }
    }
  }, []);
  
  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  

  return (
    <nav className="bg-[indigo] text-white px-6 py-2">
	  {/* Top Row: Logo + Logout */}
      <div className="flex justify-between items-center">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-2">
          <img src="/logo.jpeg" alt="Hummingbird Logo" className="w-12 h-12" />
          <span className="text-xl font-bold tracking-wide">HummingBird</span>
        </div>
		
		<div className="flex items-center gap-4" ref={dropdownRef}>
			{/*
		<button
          onClick={() => setDarkMode(!darkMode)}
          className="text-sm hover:opacity-80 transition"
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
			</button>*/}
		<button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 focus:outline-none"
        >
		<img
          src="/avatar.png"
          alt="User"
          className="w-8 h-8 rounded-full"
        />
		<svg
            className={`w-4 h-4 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        
		<span className="hidden sm:inline text-sm">Hi, {username}</span>
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50">
            <ul className="py-2">
              <li
                className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
                onClick={logout}
              >
                Logout
              </li>
            </ul>
          </div>
        )}
		  
		  </div>
      </div>
      
    </nav>
  );
};

export default Navbar;