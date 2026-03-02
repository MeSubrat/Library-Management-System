
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiBook, FiLogOut, FiLogIn } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-dark-card bg-opacity-80 backdrop-blur-lg border-b border-gray-800">
      <nav className="container mx-auto flex items-center justify-between p-4 text-white">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
          <FiBook className="text-brand-cyan" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-pink to-brand-cyan">BiblioVibe</span>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {location.pathname !== '/' && (
                <Link to="/dashboard" className="hidden sm:block hover:text-brand-cyan transition-colors">
                  Dashboard
                </Link>
              )}
              {user.role === 'admin' && (
                <Link to="/manage-users" className="hidden sm:block hover:text-brand-pink transition-colors">
                  Manage Users
                </Link>
              )}
              <Link to="/profile" className="hidden sm:block hover:text-brand-cyan transition-colors">
                Profile
              </Link>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-full hover:bg-red-700"
              >
                <FiLogOut />
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 text-sm font-medium hover:text-brand-cyan transition-colors">
                <FiLogIn />
                Login
              </Link>
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-sm font-medium text-white transition-all duration-300 bg-gradient-to-r from-brand-pink to-brand-purple rounded-full"
                >
                  Sign Up
                </motion.button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;