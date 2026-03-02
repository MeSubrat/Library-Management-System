import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import { motion } from 'framer-motion';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/books');
      setBooks(data);
    } catch (err) {
      setError('Failed to fetch books.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-pink to-brand-cyan">{user?.name}!</span>
          </h1>
          <p className="text-lg text-gray-400">Explore our collection and find your next adventure.</p>
        </div>
      </motion.div>

      {loading && <p className="text-center">Loading books...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {books.length > 0 ? (
            books.map(book => (
              <BookCard
                key={book._id}
                book={book}
                isAdmin={false}
              />
            ))
          ) : (
            <p className="col-span-full text-center">No books available at the moment. Check back soon!</p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default StudentDashboard;