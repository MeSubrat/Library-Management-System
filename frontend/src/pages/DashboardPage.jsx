import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div className="text-center p-8">Loading user data...</div>;
  }

  return user.role === 'admin' ? <AdminDashboard /> : <StudentDashboard />;
};

export default DashboardPage;