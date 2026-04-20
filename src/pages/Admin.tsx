import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import UserManagement from '../components/Admin/UserManagement';
import StatsCard from '../components/Dashboard/StatsCard';
import { Users, Database, Activity, TrendingUp } from 'lucide-react';
import { getUserCount, getDailyActiveCount, getAllUsers } from '../lib/firestore';

const Admin: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [dailyActive, setDailyActive] = useState<number | null>(null);
  const [totalStorage, setTotalStorage] = useState<string>('0 MB');

  useEffect(() => {
    getUserCount().then(setTotalUsers).catch(() => setTotalUsers(0));
    getDailyActiveCount().then(setDailyActive).catch(() => setDailyActive(0));
    getAllUsers().then((users) => {
      const bytes = users.reduce((sum, u) => sum + (u.storageUsed || 0), 0);
      const mb = (bytes / (1024 * 1024)).toFixed(2);
      setTotalStorage(`${mb} MB`);
    }).catch(() => setTotalStorage('0 MB'));
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-1">
            Manage users, monitor system performance, and oversee platform usage.
          </p>
        </div>

        {/* Admin Stats — real data from Firestore */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            value={totalUsers ?? '...'}
            change="Registered accounts"
            changeType="increase"
            icon={Users}
            iconColor="bg-blue-600"
          />
          <StatsCard
            title="Total Storage"
            value={totalStorage}
            change="Across all users"
            changeType="neutral"
            icon={Database}
            iconColor="bg-green-600"
          />
          <StatsCard
            title="Active Today"
            value={dailyActive ?? '...'}
            change="Users active today"
            changeType="increase"
            icon={Activity}
            iconColor="bg-orange-600"
          />
          <StatsCard
            title="System Status"
            value="Online"
            change="Firebase connected"
            changeType="increase"
            icon={TrendingUp}
            iconColor="bg-purple-600"
          />
        </div>

        {/* User Management — real users from Firestore */}
        <UserManagement />
      </div>
    </Layout>
  );
};

export default Admin;