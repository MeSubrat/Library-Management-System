import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import BookModal from '../components/BookModal';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

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

  const handleOpenModal = (book = null) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const handleSaveBook = () => {
    handleCloseModal();
    fetchBooks(); // Refetch books to show the latest data
  };
  
  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.delete(`/api/books/${bookId}`, config);
            setBooks(books.filter(b => b._id !== bookId));
        } catch (err) {
            setError('Failed to delete book.');
        }
    }
  };

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
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-400">Manage the book collection for BiblioVibe.</p>
        </div>
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 bg-gradient-to-r from-brand-pink to-brand-purple rounded-full"
        >
            <FiPlus/> Add New Book
        </motion.button>
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
                isAdmin={true}
                onEdit={() => handleOpenModal(book)}
                onDelete={() => handleDeleteBook(book._id)}
              />
            ))
          ) : (
            <p>No books available. Add one to get started!</p>
          )}
        </motion.div>
      )}

      {isModalOpen && (
        <BookModal 
            book={selectedBook} 
            onClose={handleCloseModal} 
            onSave={handleSaveBook}
        />
      )}
    </div>
  );
};

export default AdminDashboard;