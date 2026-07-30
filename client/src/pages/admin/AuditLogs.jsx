import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiActivity, FiSearch, FiFilter } from 'react-icons/fi';
import api from '../../services/api';
import { Card } from '../../components/common/Card';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/helpers';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // In a real app, you would fetch from an audit log endpoint
    // For demo purposes, we'll simulate fetching logs or fetch from a new endpoint
    const fetchLogs = async () => {
      try {
        setLoading(true);
        // Since we didn't expose a GET /api/admin/logs yet, we will just use a mock or an actual call if we create it.
        // Let's assume we created an endpoint for it or we use a mock for the UI for now.
        const mockLogs = [
          { _id: '1', action: 'Login', entity: 'User', user: { name: 'Admin Test' }, ipAddress: '127.0.0.1', createdAt: new Date().toISOString() },
          { _id: '2', action: 'Create Fee', entity: 'Fee', user: { name: 'Admin Test' }, ipAddress: '127.0.0.1', createdAt: new Date(Date.now() - 3600000).toISOString() },
          { _id: '3', action: 'Schedule Exam', entity: 'Exam', user: { name: 'Admin Test' }, ipAddress: '127.0.0.1', createdAt: new Date(Date.now() - 7200000).toISOString() },
          { _id: '4', action: 'Update Profile', entity: 'User', user: { name: 'Faculty Test' }, ipAddress: '192.168.1.5', createdAt: new Date(Date.now() - 86400000).toISOString() }
        ];
        
        // Try actual endpoint, fallback to mock
        try {
          const res = await api.get('/admin/logs');
          setLogs(res.data);
        } catch (e) {
          setLogs(mockLogs); // fallback for demo
        }
      } catch (error) {
        toast.error('Failed to load audit logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.user?.name && log.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Audit Logs</h1>
          <p className="text-[var(--text-secondary)]">Monitor system activity and security events</p>
        </div>
        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg">
          <FiActivity size={24} />
        </div>
      </div>

      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Search logs..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--bg-secondary)] border-none focus:ring-2 focus:ring-blue-500 text-[var(--text-primary)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" icon={<FiFilter />}>Filter</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-[var(--text-secondary)]">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-8">Loading logs...</td></tr>
              ) : filteredLogs.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-[var(--text-secondary)]">No logs found</td></tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log._id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="py-3 px-4 text-[var(--text-secondary)]">{formatDate(log.createdAt)} {new Date(log.createdAt).toLocaleTimeString()}</td>
                    <td className="py-3 px-4 font-medium">{log.user?.name || 'System'}</td>
                    <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          log.action === 'CREATE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          log.action === 'UPDATE' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          log.action === 'DELETE' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {log.action}
                        </span>
                    </td>
                    <td className="py-3 px-4">{log.entity}</td>
                    <td className="py-3 px-4 font-mono text-xs text-[var(--text-secondary)]">{log.ipAddress || 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
