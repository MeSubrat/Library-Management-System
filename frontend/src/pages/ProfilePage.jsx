import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get('/api/users/profile', config);
            setProfile(data);
        } catch (err) {
            setError('Failed to load profile.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const handleReturn = async (bookId) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.post(`/api/books/${bookId}/return`, {}, config);
            fetchProfile(); // Refresh profile to show updated list
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to return book');
        }
    };

    if (loading) return <div className="text-center text-white py-8">Loading Profile...</div>;
    if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl text-white">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-pink to-brand-cyan mb-2">
                    My Profile
                </h1>
                <p className="text-xl text-gray-300">Name: {profile.name}</p>
                <p className="text-xl text-gray-300">Email: {profile.email}</p>
                <p className="text-xl text-gray-300">Role: <span className="capitalize">{profile.role}</span></p>
            </motion.div>

            <h2 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-2">Borrowed Books</h2>

            {profile.borrowedBooks && profile.borrowedBooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profile.borrowedBooks.map((book) => (
                        <div key={book._id} className="bg-dark-card rounded-lg p-4 border border-gray-700 flex flex-col justify-between">
                            <Link to={`/book/${book._id}`}>
                                <img src={book.coverImage} alt={book.title} className="w-full h-48 object-cover rounded-md mb-4" />
                                <h3 className="text-lg font-bold text-white mb-1 hover:text-brand-cyan transition-colors">{book.title}</h3>
                                <p className="text-sm text-gray-400 mb-4">{book.author}</p>
                            </Link>
                            <button
                                onClick={() => handleReturn(book._id)}
                                className="w-full py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-md hover:opacity-90 transition-opacity"
                            >
                                Return Book
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-dark-card p-6 rounded-lg text-center border border-gray-700">
                    <p className="text-lg text-gray-400 mb-4">You haven't borrowed any books yet.</p>
                    <Link to="/dashboard" className="text-brand-cyan hover:underline font-semibold">
                        Explore the Library
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
