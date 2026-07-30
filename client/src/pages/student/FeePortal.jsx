import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiDollarSign, FiDownload, FiCreditCard, FiClock } from 'react-icons/fi';
import { feeAPI } from '../../services/api';
import Button from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { formatCurrency, formatDate } from '../../utils/helpers';
import jsPDF from 'jspdf';

export default function FeePortal() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const res = await feeAPI.getAll();
      setFees(res.data);
    } catch (error) {
      toast.error('Failed to load fee records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handlePayment = async (id, amount) => {
    // Simulate a payment gateway process
    setProcessing(true);
    toast.loading('Processing payment...', { id: 'payment' });
    
    setTimeout(async () => {
      try {
        await feeAPI.pay(id, { amount, method: 'Online' });
        toast.success('Payment successful!', { id: 'payment' });
        fetchFees();
      } catch (error) {
        toast.error('Payment failed', { id: 'payment' });
      } finally {
        setProcessing(false);
      }
    }, 2000);
  };

  const generateReceipt = (fee) => {
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185);
    doc.text('StudentOS Fee Receipt', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Student: ${fee.student?.name}`, 20, 40);
    doc.text(`Semester: ${fee.semester}`, 20, 50);
    doc.text(`Description: ${fee.description}`, 20, 60);
    
    doc.line(20, 65, 190, 65);
    
    doc.text(`Total Amount: ${formatCurrency(fee.totalAmount)}`, 20, 75);
    doc.text(`Amount Paid: ${formatCurrency(fee.paidAmount)}`, 20, 85);
    doc.text(`Remaining Balance: ${formatCurrency(fee.totalAmount - fee.paidAmount)}`, 20, 95);
    
    doc.text(`Status: ${fee.status.toUpperCase()}`, 20, 110);
    
    if (fee.payments && fee.payments.length > 0) {
      doc.text('Payment History:', 20, 130);
      let y = 140;
      fee.payments.forEach(p => {
        doc.setFontSize(10);
        doc.text(`${formatDate(p.date)} - ${formatCurrency(p.amount)} [${p.method}] Ref: ${p.receiptNumber}`, 20, y);
        y += 10;
      });
    }
    
    doc.save(`Receipt_${fee.student?.name}_Sem${fee.semester}.pdf`);
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Fees</h1>
        <p className="text-[var(--text-secondary)]">View and pay your semester fees</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fees.length === 0 ? (
          <div className="col-span-full text-center py-12 text-[var(--text-secondary)] bg-[var(--bg-secondary)] rounded-xl">
            No fee records found.
          </div>
        ) : (
          fees.map(fee => (
            <Card key={fee._id} className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">{fee.description}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Semester {fee.semester}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  fee.status === 'Paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                  fee.status === 'Partial' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {fee.status}
                </span>
              </div>

              <div className="space-y-3 flex-grow mb-6">
                <div className="flex justify-between border-b border-[var(--border-color)] pb-2">
                  <span className="text-[var(--text-secondary)]">Total Amount</span>
                  <span className="font-semibold">{formatCurrency(fee.totalAmount)}</span>
                </div>
                <div className="flex justify-between border-b border-[var(--border-color)] pb-2">
                  <span className="text-[var(--text-secondary)]">Amount Paid</span>
                  <span className="font-semibold text-green-500">{formatCurrency(fee.paidAmount)}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-[var(--text-secondary)]">Remaining Balance</span>
                  <span className="font-bold text-lg">{formatCurrency(fee.totalAmount - fee.paidAmount)}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-[var(--text-secondary)] mt-4">
                  <FiClock />
                  <span>Due by: {formatDate(fee.dueDate)}</span>
                </div>
              </div>

              <div className="flex flex-col space-y-2 mt-auto">
                {fee.status !== 'Paid' && (
                  <Button 
                    variant="primary" 
                    icon={<FiCreditCard />} 
                    className="w-full justify-center"
                    loading={processing}
                    onClick={() => handlePayment(fee._id, fee.totalAmount - fee.paidAmount)}
                  >
                    Pay {formatCurrency(fee.totalAmount - fee.paidAmount)}
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  icon={<FiDownload />} 
                  className="w-full justify-center"
                  onClick={() => generateReceipt(fee)}
                >
                  Download Receipt
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
