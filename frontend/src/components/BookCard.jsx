import { motion } from 'framer-motion';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const BookCard = ({ book, isAdmin, onEdit, onDelete }) => {

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      className="bg-dark-card rounded-lg overflow-hidden shadow-lg border border-gray-700 flex flex-col justify-between transition-transform transform hover:-translate-y-2 group"
      variants={cardVariants}
    >
      <Link to={`/book/${book._id}`} className="block">
        <img className="w-full h-64 object-cover" src={book.coverImage} alt={book.title} />
        <div className="p-4">
          <h3 className="text-lg font-bold text-white truncate group-hover:text-brand-cyan transition-colors">{book.title}</h3>
          <p className="text-sm text-gray-400 mb-2">{book.author}</p>
          <div className="flex justify-between items-center">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${book.isAvailable ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {book.isAvailable ? 'Available' : 'Borrowed'}
            </span>
            <span className="text-xs text-gray-500">{book.genre}</span>
          </div>
        </div>
      </Link>

      {isAdmin && (
        <div className="p-2 bg-dark-primary flex justify-end gap-2">
          <button onClick={onEdit} className="p-2 rounded-full hover:bg-gray-600 transition-colors">
            <FiEdit className="text-yellow-400" />
          </button>
          <button onClick={onDelete} className="p-2 rounded-full hover:bg-gray-600 transition-colors">
            <FiTrash2 className="text-red-500" />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default BookCard;