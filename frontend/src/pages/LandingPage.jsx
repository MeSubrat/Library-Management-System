import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBookOpen, FiArrowRight, FiGrid } from 'react-icons/fi';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-80px)] flex items-center justify-center text-white p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-dark-primary to-black opacity-80"></div>
       <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute w-96 h-96 bg-brand-purple rounded-full -top-20 -left-20 filter blur-3xl animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-brand-cyan rounded-full -bottom-20 -right-20 filter blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center"
      >
        <motion.div 
          className="inline-block p-4 mb-6 bg-white bg-opacity-10 rounded-full backdrop-blur-sm"
          animate={{ rotate: [0, 5, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <FiBookOpen className="text-5xl text-brand-cyan" />
        </motion.div>

        { user ? (
            <>
                <h1 className="text-5xl md:text-7xl font-bold mb-4">
                    Hello, <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-pink to-brand-cyan">{user.name}</span>!
                </h1>
                <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-300">
                    Ready to find your next adventure? Explore the collection now.
                </p>
                <Link to="/dashboard">
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(0, 255, 255, 0.5)" }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-8 py-4 mx-auto font-semibold text-white transition-all duration-300 bg-gradient-to-r from-brand-pink to-brand-purple rounded-full"
                    >
                        Go to Dashboard <FiGrid />
                    </motion.button>
                </Link>
            </>
        ) : (
            <>
                <h1 className="text-5xl md:text-7xl font-bold mb-4">
                    Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-pink to-brand-cyan">BiblioVibe</span>
                </h1>
                <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-300">
                    Your modern library experience. Discover, borrow, and vibe with your next favorite book.
                </p>
                <Link to="/signup">
                <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(0, 255, 255, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-8 py-4 mx-auto font-semibold text-white transition-all duration-300 bg-gradient-to-r from-brand-pink to-brand-purple rounded-full"
                >
                    Get Started <FiArrowRight />
                </motion.button>
                </Link>
            </>
        )}
      </motion.div>
    </div>
  );
};

export default LandingPage;