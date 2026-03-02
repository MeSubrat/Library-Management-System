import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { FiX } from 'react-icons/fi';

const BookModal = ({ book, onClose, onSave }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    year: '',
    description: '',
    coverImage: '',
    isAvailable: true,
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        genre: book.genre || '',
        year: book.year || '',
        description: book.description || '',
        coverImage: book.coverImage || '',
        isAvailable: book.isAvailable !== undefined ? book.isAvailable : true,
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      if (book) {
        // Update existing book
        await axios.put(`/api/books/${book._id}`, formData, config);
      } else {
        // Create new book
        await axios.post('/api/books', formData, config);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save book.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: -50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100 } },
    exit: { opacity: 0, y: 50, scale: 0.9 },
  };


  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        <motion.div
          className="bg-dark-card w-full max-w-lg rounded-xl shadow-lg border border-gray-700 max-h-[90vh] overflow-y-auto"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          <div className="p-6">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">{book ? 'Edit Book' : 'Add New Book'}</h2>
                 <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-600 transition-colors">
                    <FiX className="text-white"/>
                 </button>
             </div>
            {error && <p className="p-3 mb-4 text-center text-white bg-red-500 rounded-md">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Form fields */}
                <InputField name="title" label="Title" value={formData.title} onChange={handleChange} required />
                <InputField name="author" label="Author" value={formData.author} onChange={handleChange} required />
                <InputField name="genre" label="Genre" value={formData.genre} onChange={handleChange} required />
                <InputField name="year" label="Year" type="number" value={formData.year} onChange={handleChange} required />
                <InputField name="coverImage" label="Cover Image URL" value={formData.coverImage} onChange={handleChange} />
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                    <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                    />
                </div>
                {book && (
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isAvailable"
                            name="isAvailable"
                            checked={formData.isAvailable}
                            onChange={handleChange}
                            className="h-4 w-4 text-brand-purple bg-gray-700 border-gray-600 rounded focus:ring-brand-purple"
                        />
                        <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-300">Available for borrowing</label>
                    </div>
                )}
                <div className="flex justify-end pt-4">
                     <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 font-semibold text-white transition-all duration-300 bg-gradient-to-r from-brand-pink to-brand-purple rounded-md disabled:opacity-50"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Book'}
                    </motion.button>
                </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const InputField = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-300">{label}</label>
        <input
            {...props}
            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
        />
    </div>
);

export default BookModal;