import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiArrowLeft } from 'react-icons/fi';

const BookDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const fetchBook = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/books/${id}`);
            setBook(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch book details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBook();
    }, [id]);

    const handleBorrow = async () => {
        try {
            setActionLoading(true);
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await axios.post(`/api/books/${id}/borrow`, {}, config);
            fetchBook(); // refresh book data
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to borrow book');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReturn = async () => {
        try {
            setActionLoading(true);
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await axios.post(`/api/books/${id}/return`, {}, config);
            fetchBook(); // refresh book data
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to return book');
        } finally {
            setActionLoading(false);
        }
    };
    if (loading && !book) {
        return <div className="container mx-auto px-4 py-8 text-center text-white">Loading book details...</div>;
    }

    if (error || !book) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-red-500 mb-4">{error || 'Book not found'}</p>
                <button onClick={() => navigate(-1)} className="text-brand-cyan hover:underline">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl text-white">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 mb-6 text-gray-400 hover:text-white transition-colors"
            >
                <FiArrowLeft /> Back
            </motion.button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dark-card rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-8 border border-gray-700 shadow-xl"
            >
                <div className="md:w-1/3 flex-shrink-0">
                    <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full rounded-lg shadow-lg object-cover"
                    />
                </div>
                <div className="md:w-2/3 flex flex-col justify-start">
                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-pink to-brand-cyan mb-2">
                        {book.title}
                    </h1>
                    <p className="text-xl text-gray-300 mb-4">by {book.author}</p>

                    <div className="flex flex-wrap gap-4 mb-6">
                        <span className="px-3 py-1 bg-gray-800 border border-gray-600 rounded-full text-sm font-medium">
                            Year: {book.year}
                        </span>
                        <span className="px-3 py-1 bg-gray-800 border border-gray-600 rounded-full text-sm font-medium">
                            Genre: {book.genre}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${book.isAvailable ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                            {book.isAvailable ? 'Currently Available' : 'Borrowed / Unavailable'}
                        </span>
                    </div>

                    <div className="mb-6 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <h2 className="text-lg font-semibold mb-2 text-white">Description</h2>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {book.description || 'No description available for this book.'}
                        </p>
                    </div>

                    {user && user.role === 'student' && (
                        <div className="mt-auto pt-4 border-t border-gray-700">
                            {book.isAvailable ? (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleBorrow}
                                    disabled={actionLoading}
                                    className="w-full py-3 bg-gradient-to-r from-brand-cyan to-blue-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                >
                                    {actionLoading ? 'Processing...' : 'Borrow Book'}
                                </motion.button>
                            ) : book.borrowedBy === user._id ? (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleReturn}
                                    disabled={actionLoading}
                                    className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                >
                                    {actionLoading ? 'Processing...' : 'Return Book'}
                                </motion.button>
                            ) : (
                                <button
                                    disabled
                                    className="w-full py-3 bg-gray-700 text-gray-400 font-bold rounded-lg cursor-not-allowed"
                                >
                                    Currently Borrowed by Someone Else
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default BookDetailsPage;
