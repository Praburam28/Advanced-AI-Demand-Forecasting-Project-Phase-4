import { useEffect, useState } from "react";
import { FileText, Download, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import API from "../api/axios";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [reportName, setReportName] = useState("Dashboard Summary Report");
  const [message, setMessage] = useState("");

  const fetchReports = async () => {
    const res = await API.get("/reports/");
    setReports(res.data);
  };

  const generateReport = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await API.post("/reports/generate", {
        report_name: reportName,
        report_type: "dashboard_summary",
      });

      setMessage("Report generated successfully.");
      fetchReports();
    } catch (error) {
      setMessage(error.response?.data?.detail || "Report generation failed");
    }
  };

  const downloadReport = async (id, name) => {
    const res = await API.get(`/reports/${id}/download`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", `${name}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-cyan-500 p-8 shadow-2xl shadow-cyan-500/20">
        <h1 className="text-3xl font-extrabold text-white">
          Reports & Export
        </h1>
        <p className="text-cyan-50 mt-2">
          Generate downloadable PDF summaries for analytics and forecasting.
        </p>
      </div>

      <motion.form
        onSubmit={generateReport}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-6 flex flex-col md:flex-row gap-4"
      >
        <input
          className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none flex-1"
          value={reportName}
          onChange={(e) => setReportName(e.target.value)}
          placeholder="Report Name"
          required
        />

        <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition">
          <Sparkles size={18} />
          Generate Report
        </button>
      </motion.form>

      {message && (
        <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 p-4 rounded-2xl">
          {message}
        </div>
      )}

      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <FileText className="text-cyan-300" />
          <h2 className="text-xl font-bold text-white">
            Report History
          </h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/10 text-left text-slate-300">
                <th className="p-4">ID</th>
                <th className="p-4">Report Name</th>
                <th className="p-4">Type</th>
                <th className="p-4">Status</th>
                <th className="p-4">Download</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="p-4">{item.id}</td>
                  <td className="p-4">{item.report_name}</td>
                  <td className="p-4">{item.report_type}</td>
                  <td className="p-4">
                    <span className="text-emerald-300">{item.status}</span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() =>
                        downloadReport(item.id, item.report_name)
                      }
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-cyan-500/20 text-cyan-300"
                    >
                      <Download size={15} />
                      PDF
                    </button>
                  </td>
                </tr>
              ))}

              {reports.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    No reports generated yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;