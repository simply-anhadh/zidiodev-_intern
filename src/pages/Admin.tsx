import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import UserManagement from '../components/Admin/UserManagement';
import StatsCard from '../components/Dashboard/StatsCard';
import { Users, Database, Activity, TrendingUp } from 'lucide-react';

const Admin: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-1">
            Manage users, monitor system performance, and oversee platform usage.
          </p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            value="1,234"
            change="+12% from last month"
            changeType="increase"
            icon={Users}
            iconColor="bg-blue-600"
          />
          <StatsCard
            title="Total Storage"
            value="45.2 GB"
            change="85% capacity used"
            changeType="neutral"
            icon={Database}
            iconColor="bg-green-600"
          />
          <StatsCard
            title="Daily Active Users"
            value="892"
            change="+8% from yesterday"
            changeType="increase"
            icon={Activity}
            iconColor="bg-orange-600"
          />
          <StatsCard
            title="System Performance"
            value="98.5%"
            change="Excellent uptime"
            changeType="increase"
            icon={TrendingUp}
            iconColor="bg-purple-600"
          />
        </div>

        {/* System Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">New user registration</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">File upload completed</p>
                    <p className="text-xs text-gray-500">5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Chart generation spike</p>
                    <p className="text-xs text-gray-500">12 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Server Status</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">CPU Usage</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full w-2/3"></div>
                    </div>
                    <span className="text-xs text-gray-500">67%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Memory</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full w-1/2"></div>
                    </div>
                    <span className="text-xs text-gray-500">52%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Disk Space</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full w-4/5"></div>
                    </div>
                    <span className="text-xs text-gray-500">85%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                  Backup Database
                </button>
                <button className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                  Clear Cache
                </button>
                <button className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                  Export Logs
                </button>
                <button className="w-full text-left px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors">
                  Emergency Shutdown
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* User Management */}
        <UserManagement />
      </div>
    </Layout>
  );
};

export default Admin;