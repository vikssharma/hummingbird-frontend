import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const NavItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-blue-100 dark:hover:bg-gray-700 ${
          isActive ? 'bg-blue-500 text-white dark:bg-blue-600' : 'text-gray-700 dark:text-gray-300'
        }`
      }
    >
      <span>{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
};

export default function Sidebar() {
  return (
    <aside className="hidden md:block w-64 bg-gray-50 h-screen px-6 py-6 shadow">
      <nav className="flex flex-col gap-4 bg-gray-50 overflow-auto">
		<NavItem to="/dashboard" icon="📊" label="Dashboard" />
		<NavItem to="/agents" icon="🧠" label="Agents" />
		<NavItem to="/createagent" icon="➕" label="Create Agent" />
		<NavItem to="/settings" icon="⚙️" label="Settings" />
		<NavItem to="/profile" icon="⚙️" label="Profile" />
      </nav>
    </aside>
  );
}
