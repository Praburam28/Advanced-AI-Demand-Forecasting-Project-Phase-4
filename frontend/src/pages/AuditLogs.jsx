import { useEffect, useState } from "react";
import { ShieldCheck, Activity } from "lucide-react";
import { motion } from "framer-motion";
import API from "../api/axios";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    const res = await API.get("/audit/logs");
    setLogs(res.data);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-cyan-500 p-8 shadow-2xl shadow-cyan-500/20">
        <h1 className="text-3xl font-extrabold text-white">
          Audit Logs
        </h1>
        <p className="text-cyan-50 mt-2">
          Track admin actions, user activities and system operations.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <ShieldCheck className="text-cyan-300" />
          <h2 className="text-xl font-bold text-white">
            Admin Activity Logs
          </h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/10 text-left text-slate-300">
                <th className="p-4">User ID</th>
                <th className="p-4">Action</th>
                <th className="p-4">Module</th>
                <th className="p-4">Description</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="p-4">{log.user_id}</td>
                  <td className="p-4 flex items-center gap-2">
                    <Activity size={15} className="text-cyan-300" />
                    {log.action}
                  </td>
                  <td className="p-4">{log.module}</td>
                  <td className="p-4 text-slate-300">
                    {log.description}
                  </td>
                </tr>
              ))}

              {logs.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-400">
                    No audit logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AuditLogs;