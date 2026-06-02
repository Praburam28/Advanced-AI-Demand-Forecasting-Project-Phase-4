import { useEffect, useState } from "react";
import { BellRing, Save } from "lucide-react";
import { motion } from "framer-motion";
import API from "../api/axios";

const AlertSettings = () => {
  const [form, setForm] = useState({
    demand_spike_threshold: 150,
    low_stock_threshold: 50,
    confidence_threshold: 60,
    email_alerts_enabled: true,
    in_app_alerts_enabled: true,
  });

  const [message, setMessage] = useState("");

  const fetchSettings = async () => {
    const res = await API.get("/alerts/settings");
    setForm(res.data);
  };

  const updateSettings = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await API.put("/alerts/settings", form);
      setMessage("Alert settings updated successfully.");
    } catch (error) {
      setMessage(error.response?.data?.detail || "Update failed.");
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-cyan-500 p-8 shadow-2xl shadow-cyan-500/20">
        <h1 className="text-3xl font-extrabold text-white">Alert Settings</h1>
        <p className="text-cyan-50 mt-2">
          Configure threshold-based alerts for demand spikes, low stock and forecast confidence.
        </p>
      </div>

      <motion.form
        onSubmit={updateSettings}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-6 space-y-5"
      >
        <div className="flex items-center gap-3">
          <BellRing className="text-cyan-300" />
          <h2 className="text-xl font-bold text-white">Threshold Configuration</h2>
        </div>

        {[
          ["Demand Spike Threshold", "demand_spike_threshold"],
          ["Low Stock Threshold", "low_stock_threshold"],
          ["Confidence Threshold (%)", "confidence_threshold"],
        ].map(([label, key]) => (
          <div key={key}>
            <label className="block text-sm text-slate-400 mb-2">{label}</label>
            <input
              type="number"
              className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none"
              value={form[key]}
              onChange={(e) =>
                setForm({
                  ...form,
                  [key]: Number(e.target.value),
                })
              }
            />
          </div>
        ))}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl">
            <input
              type="checkbox"
              checked={form.email_alerts_enabled}
              onChange={(e) =>
                setForm({
                  ...form,
                  email_alerts_enabled: e.target.checked,
                })
              }
            />
            <span>Email Alerts</span>
          </label>

          <label className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl">
            <input
              type="checkbox"
              checked={form.in_app_alerts_enabled}
              onChange={(e) =>
                setForm({
                  ...form,
                  in_app_alerts_enabled: e.target.checked,
                })
              }
            />
            <span>In-App Alerts</span>
          </label>
        </div>

        {message && (
          <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 p-4 rounded-2xl">
            {message}
          </div>
        )}

        <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition">
          <Save size={18} />
          Save Alert Settings
        </button>
      </motion.form>
    </div>
  );
};

export default AlertSettings;