import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Confirm from './pages/Confirm';
import Agents from './pages/Agents';
import CreateAgent from './pages/CreateAgent';
import AppLayout from './components/AppLayout';

/*const AppLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return (
    <>
      {isAuthenticated && <Navbar />}
      {children}
    </>
  );
};*/

const App = () => {
  return (
  <AuthProvider>
    <Router>
	<ToastContainer position="top-right" autoClose={2000} />
	  <div className="min-h-screen bg-gray-50">
	    <Routes>
		  <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
		  <Route path="/confirm/:token" element={<Confirm />} />
          <Route path="/agents" element={<ProtectedRoute><AppLayout><Agents /></AppLayout></ProtectedRoute>} />
          <Route path="/createagent" element={<ProtectedRoute><AppLayout><CreateAgent /></AppLayout></ProtectedRoute>} />
		  <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />          
		  <Route path="/settings" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} /> 
		  <Route path="/profile" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} /> 		  
        </Routes>
      </div>
    </Router>
	</AuthProvider>
  );
};

export default App;
