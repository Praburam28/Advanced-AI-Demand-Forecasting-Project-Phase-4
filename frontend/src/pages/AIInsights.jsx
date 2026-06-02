import { useEffect, useState } from "react";
import {
  Brain,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  PackageCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import API from "../api/axios";

const AIInsights = () => {
  const [datasets, setDatasets] = useState([]);
  const [insights, setInsights] = useState([]);
  const [datasetId, setDatasetId] = useState("");
  const [message, setMessage] = useState("");

  const fetchDatasets = async () => {
    const res = await API.get("/datasets/my-datasets");
    setDatasets(res.data);
  };

  const fetchInsights = async () => {
    const res = await API.get("/ai-insights/history");
    setInsights(res.data);
  };

  const generateInsight = async () => {
    if (!datasetId) {
      setMessage("Please select a dataset.");
      return;
    }

    try {
      await API.post("/ai-insights/generate", {
        dataset_id: Number(datasetId),
      });

      setMessage("AI insights generated successfully.");
      fetchInsights();
    } catch (error) {
      setMessage(error.response?.data?.detail || "AI insight generation failed");
    }
  };

  useEffect(() => {
    fetchDatasets();
    fetchInsights();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-cyan-500 p-8 shadow-2xl shadow-cyan-500/20">
        <h1 className="text-3xl font-extrabold text-white">Advanced AI Insights</h1>
        <p className="text-cyan-50 mt-2">
          Product recommendations, demand spike risks, stock alerts, and inventory suggestions.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-6 flex flex-col md:flex-row gap-4">
        <select
          className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-slate-100 outline-none flex-1"
          value={datasetId}
          onChange={(e) => setDatasetId(e.target.value)}
        >
          <option className="text-slate-900" value="">Select Dataset</option>
          {datasets.map((item) => (
            <option className="text-slate-900" key={item.id} value={item.id}>
              {item.original_file_name}
            </option>
          ))}
        </select>

        <button
          onClick={generateInsight}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition"
        >
          <Sparkles size={18} />
          Generate AI Insights
        </button>
      </div>

      {message && (
        <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 p-4 rounded-2xl">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {insights.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
                <Brain className="text-white" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">
                  AI Insight #{item.id}
                </h2>
                <p className="text-sm text-slate-400">
                  Dataset ID: {item.dataset_id}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-slate-400">Product Recommendation</p>
                <p className="text-slate-100 mt-1">{item.product_recommendation}</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-slate-400">Buying Behavior</p>
                <p className="text-slate-100 mt-1">{item.buying_behavior}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4">
                  <AlertTriangle className="text-orange-300 mb-2" />
                  <p className="text-orange-200 font-semibold">
                    {item.demand_spike_risk}
                  </p>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
                  <PackageCheck className="text-red-300 mb-2" />
                  <p className="text-red-200 font-semibold">
                    {item.low_stock_risk}
                  </p>
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4">
                <TrendingUp className="text-emerald-300 mb-2" />
                <p className="text-slate-100">{item.inventory_suggestion}</p>
              </div>

              <p className="text-cyan-300 font-semibold">
                Confidence: {item.confidence_score}%
              </p>
            </div>
          </motion.div>
        ))}

        {insights.length === 0 && (
          <div className="glass-card rounded-3xl p-8 text-slate-400">
            No AI insights generated yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsights;