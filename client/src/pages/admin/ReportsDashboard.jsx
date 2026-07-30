import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiDownload, FiFileText, FiBarChart2 } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Card } from '../../components/common/Card';
import Button from '../../components/common/Button';
import { adminAPI, reportAPI, feeAPI, academicAPI } from '../../services/api';

export default function ReportsDashboard() {
  const [reportType, setReportType] = useState('attendance');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  const generateReport = async () => {
    setLoading(true);
    setReportData(null);
    try {
      let data = [];
      if (reportType === 'attendance') {
        const res = await reportAPI.getAttendanceReport(); // assuming this returns some data
        data = res.data;
      } else if (reportType === 'fees') {
        const res = await feeAPI.getAll();
        data = res.data.map(f => ({
          Student: f.student?.name,
          Email: f.student?.email,
          Semester: f.semester,
          Description: f.description,
          Total: f.totalAmount,
          Paid: f.paidAmount,
          Status: f.status
        }));
      } else if (reportType === 'results') {
        const res = await academicAPI.getResults();
        data = res.data.data.map(r => ({
          Student: r.student?.name,
          Exam: r.exam ? r.exam.title : `Semester ${r.semester}`,
          SGPA: r.sgpa,
          CGPA: r.cgpa,
          Status: r.status
        }));
      } else if (reportType === 'students') {
        const res = await adminAPI.getUsers({ role: 'student' });
        data = res.data.data.map(s => ({
          Name: s.name,
          Email: s.email,
          Branch: s.branch,
          Semester: s.semester
        }));
      }
      
      setReportData(data);
      if (data.length === 0) {
        toast.error('No data found for this report');
      } else {
        toast.success('Report generated successfully');
      }
    } catch (error) {
      toast.error('Failed to generate report');
      // Fallback for demo if API fails
      setReportData([
        { ID: 1, Name: 'Demo Student', Metric1: '95%', Metric2: 'Pass' },
        { ID: 2, Name: 'Test Student', Metric1: '88%', Metric2: 'Pass' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (!reportData || reportData.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${reportType}_report.xlsx`);
  };

  const exportToCSV = () => {
    if (!reportData || reportData.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(reportData);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${reportType}_report.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = async () => {
    if (!reportData || reportData.length === 0) return;
    const element = document.getElementById('report-table-container');
    if (!element) return;

    toast.loading('Generating PDF...', { id: 'pdf' });
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.setFontSize(18);
      pdf.text(`StudentOS - ${reportType.toUpperCase()} Report`, 15, 15);
      
      pdf.addImage(imgData, 'JPEG', 0, 25, pdfWidth, pdfHeight);
      pdf.save(`${reportType}_report.pdf`);
      toast.success('PDF downloaded', { id: 'pdf' });
    } catch (err) {
      toast.error('Failed to create PDF', { id: 'pdf' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Reports Dashboard</h1>
          <p className="text-[var(--text-secondary)]">Generate and export professional reports</p>
        </div>
        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
          <FiBarChart2 size={24} />
        </div>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-8">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Select Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="attendance">Attendance Analytics</option>
                <option value="fees">Fee Collection &amp; Dues</option>
                <option value="results">Examination Results</option>
                <option value="students">Student Demographics</option>
              </select>
            </div>
          <div>
            <Button 
              variant="primary" 
              className="w-full" 
              onClick={generateReport}
              loading={loading}
              icon={<FiFileText />}
            >
              Generate Report
            </Button>
          </div>
        </div>

        {reportData && reportData.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-[var(--bg-secondary)] p-4 rounded-lg">
              <span className="font-medium text-[var(--text-primary)]">Report generated: {reportData.length} records</span>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" icon={<FiDownload />} onClick={exportToCSV}>CSV</Button>
                <Button size="sm" variant="outline" icon={<FiDownload />} onClick={exportToExcel}>Excel</Button>
                <Button size="sm" variant="primary" icon={<FiDownload />} onClick={exportToPDF}>PDF</Button>
              </div>
            </div>

            <div id="report-table-container" className="overflow-x-auto border border-[var(--border-color)] rounded-lg p-2 bg-white dark:bg-gray-800">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-color)]">
                    {Object.keys(reportData[0]).map((key) => (
                      <th key={key} className="py-2 px-4 text-[var(--text-secondary)] font-bold">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((row, index) => (
                    <tr key={index} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)]">
                      {Object.values(row).map((val, i) => (
                        <td key={i} className="py-2 px-4 text-[var(--text-primary)]">{String(val)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
