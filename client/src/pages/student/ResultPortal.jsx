import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiDownload, FiAward } from 'react-icons/fi';
import { academicAPI } from '../../services/api';
import Button from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { formatCurrency, formatDate } from '../../utils/helpers';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ResultPortal() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await academicAPI.getResults();
        setResults(res.data.data);
      } catch (error) {
        toast.error('Failed to load results');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const generateMarksheet = async (resultId) => {
    const element = document.getElementById(`marksheet-${resultId}`);
    if (!element) return;
    
    // Create temporary clone to modify for printing
    const clone = element.cloneNode(true);
    clone.style.width = '800px';
    clone.style.padding = '40px';
    clone.style.background = '#ffffff';
    clone.style.color = '#000000';
    clone.classList.remove('hidden');
    clone.style.position = 'absolute';
    clone.style.top = '-9999px';
    document.body.appendChild(clone);
    
    try {
      const canvas = await html2canvas(clone, { scale: 2 });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Marksheet_${resultId}.pdf`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate PDF');
    } finally {
      document.body.removeChild(clone);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Results</h1>
        <p className="text-[var(--text-secondary)]">View and download your official marksheets</p>
      </div>

      <div className="space-y-8">
        {results.length === 0 ? (
          <div className="text-center py-12 text-[var(--text-secondary)] bg-[var(--bg-secondary)] rounded-xl">
            No results published yet.
          </div>
        ) : (
          results.map((result) => (
            <Card key={result._id} className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">
                    {result.exam ? result.exam.title : `Semester ${result.semester} Examination`}
                  </h3>
                  <p className="text-[var(--text-secondary)]">
                    {result.exam && result.exam.type} | Published on {formatDate(result.createdAt)}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    result.status === 'Pass'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {result.status}
                  </span>
                  <Button size="sm" variant="outline" icon={<FiDownload />} onClick={() => generateMarksheet(result._id)}>
                    Download PDF
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto mb-6 border rounded-lg border-[var(--border-color)]">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                      <th className="py-3 px-4 border-b border-[var(--border-color)]">Subject Code</th>
                      <th className="py-3 px-4 border-b border-[var(--border-color)]">Subject Name</th>
                      <th className="py-3 px-4 border-b border-[var(--border-color)]">Internal</th>
                      <th className="py-3 px-4 border-b border-[var(--border-color)]">External</th>
                      <th className="py-3 px-4 border-b border-[var(--border-color)]">Total Marks</th>
                      <th className="py-3 px-4 border-b border-[var(--border-color)] font-bold">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.subjects && result.subjects.map((sub, i) => (
                      <tr key={i} className="border-b border-[var(--border-color)]">
                        <td className="py-3 px-4 font-medium">{sub.subject?.code}</td>
                        <td className="py-3 px-4">{sub.subject?.name}</td>
                        <td className="py-3 px-4">{sub.internalMarks}</td>
                        <td className="py-3 px-4">{sub.externalMarks}</td>
                        <td className="py-3 px-4 font-medium">{sub.totalMarks}</td>
                        <td className="py-3 px-4 font-bold text-lg">{sub.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center bg-[var(--bg-secondary)] p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FiAward className="text-2xl text-yellow-500" />
                  <span className="font-bold text-[var(--text-primary)]">SGPA: {result.sgpa}</span>
                </div>
                <div className="text-[var(--text-secondary)]">
                  CGPA: <span className="font-bold text-[var(--text-primary)]">{result.cgpa}</span>
                </div>
              </div>

              {/* Hidden template for PDF generation */}
              <div id={`marksheet-${result._id}`} className="hidden">
                <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>
                  <h1 style={{ fontSize: '24px', margin: '0 0 5px 0' }}>StudentOS Institute of Technology</h1>
                  <h2 style={{ fontSize: '18px', margin: '0' }}>Official Marksheet</h2>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div>
                    <p><strong>Name:</strong> {result.student?.name}</p>
                    <p><strong>Roll No:</strong> {result.student?.rollNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p><strong>Semester:</strong> {result.semester}</p>
                    <p><strong>Branch:</strong> {result.student?.branch}</p>
                  </div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f0f0f0' }}>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>Code</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>Subject</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>Int</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>Ext</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.subjects && result.subjects.map((sub, i) => (
                      <tr key={i}>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{sub.subject?.code}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{sub.subject?.name}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{sub.internalMarks}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{sub.externalMarks}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>{sub.totalMarks}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>{sub.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #ccc', paddingTop: '10px' }}>
                  <p><strong>SGPA:</strong> {result.sgpa}</p>
                  <p><strong>CGPA:</strong> {result.cgpa}</p>
                  <p><strong>Result:</strong> {result.status}</p>
                </div>
                <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between' }}>
                  <p>Date: {formatDate(result.createdAt)}</p>
                  <p style={{ borderTop: '1px solid #000', paddingTop: '5px' }}>Controller of Examinations</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
