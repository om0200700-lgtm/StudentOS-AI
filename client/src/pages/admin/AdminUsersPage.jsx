import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineSearch, HiOutlineShieldCheck, HiOutlineBan, HiOutlineCheckCircle } from 'react-icons/hi';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminAPI.getUsers();
      setUsers(res.data.data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, newRole);
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      toast.success('Role updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await adminAPI.updateUserStatus(userId, newStatus);
      setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
      toast.success(`User ${newStatus} successfully`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">User Management</h1>
          <p className="text-[var(--text-secondary)]">Manage system access and roles.</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-[var(--text-primary)]"
          />
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] text-[var(--text-secondary)] text-sm">
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Provider</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[var(--text-secondary)]">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[var(--text-secondary)]">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {user.profilePhoto ? (
                          <img src={user.profilePhoto} alt={user.name} className="w-10 h-10 rounded-full" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-[var(--text-primary)]">{user.name}</p>
                          <p className="text-xs text-[var(--text-secondary)]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-lg font-medium ${
                        user.provider === 'google' 
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {user.provider}
                      </span>
                    </td>
                    <td className="p-4">
                      <select 
                        value={user.role} 
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                      >
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-lg font-medium ${
                        user.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {user.status === 'active' ? (
                        <button 
                          onClick={() => handleStatusChange(user._id, 'disabled')}
                          className="flex items-center gap-1 text-amber-600 hover:text-amber-700 text-sm font-medium transition-colors"
                        >
                          <HiOutlineBan className="w-4 h-4" /> Disable
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleStatusChange(user._id, 'active')}
                          className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
                        >
                          <HiOutlineCheckCircle className="w-4 h-4" /> Enable
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
