import { useEffect, useState } from "react";
import { Bot, CalendarClock, Trash2, ToggleLeft } from "lucide-react";
import { motion } from "framer-motion";
import API from "../api/axios";

const modelOptions = [
  ["linear_regression", "Linear Regression"],
  ["random_forest", "Random Forest"],
  ["decision_tree", "Decision Tree"],
  ["gradient_boosting", "Gradient Boosting"],
  ["extra_trees", "Extra Trees"],
  ["ridge_regression", "Ridge Regression"],
  ["lasso_regression", "Lasso Regression"],
  ["svr", "Support Vector Regression"],
];

const Automation = () => {
  const [datasets, setDatasets] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    dataset_id: "",
    schedule_name: "",
    model_name: "linear_regression",
    forecast_period: 30,
    interval_minutes: 60,
  });

  const fetchDatasets = async () => {
    const res = await API.get("/datasets/my-datasets");
    setDatasets(res.data);
  };

  const fetchSchedules = async () => {
    const res = await API.get("/automation/schedules");
    setSchedules(res.data);
  };

  const createSchedule = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await API.post("/automation/schedules", {
        ...form,
        dataset_id: Number(form.dataset_id),
        forecast_period: Number(form.forecast_period),
        interval_minutes: Number(form.interval_minutes),
      });

      setMessage("Automation schedule created successfully.");
      fetchSchedules();
    } catch (error) {
      setMessage(error.response?.data?.detail || "Schedule creation failed");
    }
  };

  const toggleSchedule = async (item) => {
    await API.put(`/automation/schedules/${item.id}`, {
      is_active: !item.is_active,
    });

    fetchSchedules();
  };

  const deleteSchedule = async (id) => {
    await API.delete(`/automation/schedules/${id}`);
    fetchSchedules();
  };

  useEffect(() => {
    fetchDatasets();
    fetchSchedules();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-cyan-500 p-8 shadow-2xl shadow-cyan-500/20">
        <h1 className="text-3xl font-extrabold text-white">
          Smart Automation
        </h1>
        <p className="text-cyan-50 mt-2">
          Schedule recurring AI forecasts with configurable intervals and models.
        </p>
      </div>

      <motion.form
        onSubmit={createSchedule}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <input
          className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none"
          placeholder="Schedule Name"
          value={form.schedule_name}
          onChange={(e) =>
            setForm({ ...form, schedule_name: e.target.value })
          }
          required
        />

        <select
          className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none"
          value={form.dataset_id}
          onChange={(e) => setForm({ ...form, dataset_id: e.target.value })}
          required
        >
          <option className="text-slate-900" value="">
            Select Dataset
          </option>

          {datasets.map((item) => (
            <option className="text-slate-900" key={item.id} value={item.id}>
              {item.original_file_name}
            </option>
          ))}
        </select>

        <select
          className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none"
          value={form.model_name}
          onChange={(e) => setForm({ ...form, model_name: e.target.value })}
        >
          {modelOptions.map(([value, label]) => (
            <option className="text-slate-900" key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <input
          type="number"
          className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none"
          value={form.forecast_period}
          onChange={(e) =>
            setForm({ ...form, forecast_period: e.target.value })
          }
          placeholder="Forecast Period"
        />

        <input
          type="number"
          className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none"
          value={form.interval_minutes}
          onChange={(e) =>
            setForm({ ...form, interval_minutes: e.target.value })
          }
          placeholder="Interval Minutes"
        />

        <button className="rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition">
          Create Schedule
        </button>
      </motion.form>

      {message && (
        <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 p-4 rounded-2xl">
          {message}
        </div>
      )}

      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <Bot className="text-cyan-300" />
          <h2 className="text-xl font-bold theme-text-primary">
            Automation Schedules
          </h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/10 text-left text-slate-300">
                <th className="p-4">Name</th>
                <th className="p-4">Dataset</th>
                <th className="p-4">Model</th>
                <th className="p-4">Forecast Period</th>
                <th className="p-4">Interval</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {schedules.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="p-4 flex items-center gap-2">
                    <CalendarClock size={16} className="text-cyan-300" />
                    {item.schedule_name}
                  </td>
                  <td className="p-4">{item.dataset_id}</td>
                  <td className="p-4">{item.model_name}</td>
                  <td className="p-4">{item.forecast_period}</td>
                  <td className="p-4">{item.interval_minutes} min</td>
                  <td className="p-4">
                    <span
                      className={
                        item.is_active ? "text-emerald-300" : "text-red-300"
                      }
                    >
                      {item.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => toggleSchedule(item)}
                      className="p-2 rounded-xl bg-white/10 hover:bg-cyan-500/20 text-cyan-300"
                    >
                      <ToggleLeft size={18} />
                    </button>

                    <button
                      onClick={() => deleteSchedule(item.id)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}

              {schedules.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    No automation schedules found.
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

export default Automation;