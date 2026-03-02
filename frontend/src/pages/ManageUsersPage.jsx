import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const ManageUsersPage = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get('/api/users', config);
            setUsers(data);
        } catch (err) {
            setError('Failed to load users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchUsers();
        }
    }, [user]);

    const handleRoleChange = async (userId, newRole) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.put(`/api/users/${userId}/role`, { role: newRole }, config);
            fetchUsers(); // Refresh list to reflect changes
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update user role');
        }
    };

    if (!user || user.role !== 'admin') {
        return <div className="text-center text-red-500 py-8 text-2xl">Access Denied: Admins Only</div>;
    }

    if (loading) return <div className="text-center text-white py-8">Loading Users...</div>;
    if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl text-white">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-pink to-brand-cyan mb-4">
                    Manage Users
                </h1>
                <p className="text-lg text-gray-400">View all users and update their system roles.</p>
            </motion.div>

            <div className="bg-dark-card rounded-xl shadow-lg border border-gray-700 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-800 border-b border-gray-700 text-gray-300">
                            <th className="p-4 font-semibold text-lg">Name</th>
                            <th className="p-4 font-semibold text-lg">Email</th>
                            <th className="p-4 font-semibold text-lg">Current Role</th>
                            <th className="p-4 font-semibold text-lg">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id} className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                                <td className="p-4 font-medium">{u.name}</td>
                                <td className="p-4 text-gray-400">{u.email}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold capitalize ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <select
                                        value={u.role}
                                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                        className="bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-brand-cyan cursor-pointer transition-shadow"
                                        disabled={u._id === user._id} // Prevent an admin from changing their own role in the UI for safety
                                    >
                                        <option value="student">Student</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsersPage;
