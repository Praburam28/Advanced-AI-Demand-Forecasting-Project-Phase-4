import { useEffect, useState } from "react";
import { BarChart3, GitCompare, TrendingUp } from "lucide-react";
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

const Forecast = () => {
  const [datasets, setDatasets] = useState([]);
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({
    dataset_id: "",
    model_name: "linear_regression",
    forecast_period: 30,
  });
  const [message, setMessage] = useState("");

  const fetchDatasets = async () => {
    const res = await API.get("/datasets/my-datasets");
    setDatasets(res.data);
  };

  const fetchHistory = async () => {
    const res = await API.get("/forecasts/history");
    setHistory(res.data);
  };

  const generateForecast = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await API.post("/forecasts/generate", {
        ...form,
        dataset_id: Number(form.dataset_id),
        forecast_period: Number(form.forecast_period),
      });

      setMessage("Forecast generated successfully.");
      fetchHistory();
    } catch (error) {
      setMessage(error.response?.data?.detail || "Forecast failed");
    }
  };

  const compareModels = async () => {
    if (!form.dataset_id) {
      setMessage("Please select dataset first.");
      return;
    }

    try {
      await API.post(`/forecasts/compare/${form.dataset_id}`);
      setMessage("Model comparison completed.");
      fetchHistory();
    } catch (error) {
      setMessage(error.response?.data?.detail || "Comparison failed");
    }
  };

  useEffect(() => {
    fetchDatasets();
    fetchHistory();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-cyan-500 p-8 shadow-2xl shadow-cyan-500/20">
        <h1 className="text-3xl font-extrabold text-white">AI Forecasting</h1>
        <p className="text-cyan-50 mt-2">
          Generate demand forecasts, compare ML models, and view accuracy metrics.
        </p>
      </div>

      <motion.form
        onSubmit={generateForecast}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-6 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <select
          className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-slate-100 outline-none"
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
          className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-slate-100 outline-none"
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
          className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-slate-100 outline-none"
          value={form.forecast_period}
          onChange={(e) =>
            setForm({ ...form, forecast_period: e.target.value })
          }
          placeholder="Forecast Period"
        />

        <button className="rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition">
          Generate
        </button>

        <button
          type="button"
          onClick={compareModels}
          className="flex items-center justify-center gap-2 bg-white/10 border border-white/10 text-cyan-200 rounded-2xl font-semibold py-3 md:col-span-4 hover:bg-white/20"
        >
          <GitCompare size={18} />
          Compare All Models
        </button>
      </motion.form>

      {message && (
        <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 p-4 rounded-2xl">
          {message}
        </div>
      )}

      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <BarChart3 className="text-cyan-300" />
          <h2 className="text-xl font-bold theme-text-primary">
            Forecast History
          </h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/10 text-left text-slate-300">
                <th className="p-4">ID</th>
                <th className="p-4">Dataset</th>
                <th className="p-4">Model</th>
                <th className="p-4">Prediction</th>
                <th className="p-4">Confidence</th>
                <th className="p-4">MAE</th>
                <th className="p-4">RMSE</th>
                <th className="p-4">Trend</th>
              </tr>
            </thead>

            <tbody>
              {history.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="p-4">{item.id}</td>
                  <td className="p-4">{item.dataset_id}</td>
                  <td className="p-4">{item.model_name}</td>
                  <td className="p-4 font-bold text-cyan-300">
                    {item.predicted_demand}
                  </td>
                  <td className="p-4">{item.confidence_score}%</td>
                  <td className="p-4">{item.mae}</td>
                  <td className="p-4">{item.rmse}</td>
                  <td className="p-4 flex items-center gap-2">
                    <TrendingUp size={16} className="text-emerald-300" />
                    {item.trend}
                  </td>
                </tr>
              ))}

              {history.length === 0 && (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">
                    No forecasts generated yet.
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

export default Forecast;