import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FiDollarSign, FiPlus, FiSearch, FiCheck, FiClock, FiDownload } from 'react-icons/fi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import { feeAPI, adminAPI } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/helpers';

export default function FeeManagement() {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    student: '',
    semester: 1,
    totalAmount: '',
    dueDate: '',
    description: 'Semester Fee'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [feesRes, studentsRes, statsRes] = await Promise.all([
        feeAPI.getAll(),
        adminAPI.getUsers({ role: 'student' }),
        feeAPI.getStats()
      ]);
      setFees(feesRes.data);
      setStudents(studentsRes.data.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to load fee data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await feeAPI.create(formData);
      toast.success('Fee record created successfully');
      setIsModalOpen(false);
      setFormData({ student: '', semester: 1, totalAmount: '', dueDate: '', description: 'Semester Fee' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create fee record');
    }
  };

  const markAsPaid = async (id, remainingAmount) => {
    try {
      await feeAPI.pay(id, { amount: remainingAmount, method: 'Cash' });
      toast.success('Fee marked as paid');
      fetchData();
    } catch (error) {
      toast.error('Failed to update fee status');
    }
  };

  const filteredFees = fees.filter(fee => 
    fee.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fee.student?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Fee Management</h1>
          <p className="text-[var(--text-secondary)]">Manage student fees and track payments</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={<FiPlus />}>Add Fee Record</Button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg"><FiDollarSign size={24} /></div>
            <div><p className="text-sm text-[var(--text-secondary)]">Total Expected</p><h3 className="text-xl font-bold">{formatCurrency(stats.totalFees)}</h3></div>
          </Card>
          <Card className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg"><FiCheck size={24} /></div>
            <div><p className="text-sm text-[var(--text-secondary)]">Total Collected</p><h3 className="text-xl font-bold">{formatCurrency(stats.totalCollected)}</h3></div>
          </Card>
          <Card className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg"><FiClock size={24} /></div>
            <div><p className="text-sm text-[var(--text-secondary)]">Pending Amount</p><h3 className="text-xl font-bold">{formatCurrency(stats.totalPending)}</h3></div>
          </Card>
        </div>
      )}

      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Search student..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--bg-secondary)] border-none focus:ring-2 focus:ring-blue-500 text-[var(--text-primary)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-[var(--text-secondary)]">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Semester</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Paid</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="text-center py-8">Loading...</td></tr>
              ) : filteredFees.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-8 text-[var(--text-secondary)]">No fee records found</td></tr>
              ) : (
                filteredFees.map((fee) => (
                  <tr key={fee._id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-[var(--text-primary)]">{fee.student?.name}</div>
                      <div className="text-xs text-[var(--text-secondary)]">{fee.student?.email}</div>
                    </td>
                    <td className="py-3 px-4">{fee.semester}</td>
                    <td className="py-3 px-4">{fee.description}</td>
                    <td className="py-3 px-4 font-medium">{formatCurrency(fee.totalAmount)}</td>
                    <td className="py-3 px-4 text-green-500 font-medium">{formatCurrency(fee.paidAmount)}</td>
                    <td className="py-3 px-4">{formatDate(fee.dueDate)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        fee.status === 'Paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                        fee.status === 'Partial' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {fee.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {fee.status !== 'Paid' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => markAsPaid(fee._id, fee.totalAmount - fee.paidAmount)}
                        >
                          Mark Paid
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Fee Record">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Student</label>
            <select
              required
              value={formData.student}
              onChange={(e) => setFormData({...formData, student: e.target.value})}
              className="w-full bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Student</option>
              {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.email})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Semester"
              type="number"
              required
              min="1"
              max="8"
              value={formData.semester}
              onChange={(e) => setFormData({...formData, semester: e.target.value})}
            />
            <Input
              label="Total Amount"
              type="number"
              required
              min="0"
              value={formData.totalAmount}
              onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
            />
          </div>
          <Input
            label="Due Date"
            type="date"
            required
            value={formData.dueDate}
            onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
          />
          <Input
            label="Description"
            required
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Record</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
