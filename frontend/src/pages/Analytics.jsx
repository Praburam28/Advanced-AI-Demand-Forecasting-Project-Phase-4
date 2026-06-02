import { useEffect, useState } from "react";

import {
  Search,
  Filter,
  TrendingUp,
} from "lucide-react";

import API from "../api/axios";

const Analytics = () => {
  const [analytics, setAnalytics] = useState([]);

  const [search, setSearch] = useState("");

  const fetchAnalytics = async () => {
    try {
      const res = await API.get(
        "/dashboard/drilldown"
      );

      setAnalytics(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const filtered = analytics.filter((item) =>
    item.model_name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-cyan-600 to-indigo-600 p-8 shadow-2xl shadow-cyan-500/20">
        <h1 className="text-3xl font-extrabold text-white">
          Forecast Drill-down Analytics
        </h1>

        <p className="text-cyan-50 mt-2">
          Advanced forecast metrics, confidence trends and model analytics.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center">
            <Filter className="text-white" />
          </div>

          <div>
            <h2 className="text-xl font-bold theme-text-primary">
              Analytics Filters
            </h2>

            <p className="theme-text-muted text-sm">
              Search forecast analytics by model
            </p>
          </div>
        </div>

        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-3.5 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by model name..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none theme-text-primary"
          />
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <TrendingUp className="text-cyan-400" />

          <h2 className="text-xl font-bold theme-text-primary">
            Forecast Analytics
          </h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/10 text-left text-slate-300">
                <th className="p-4">Model</th>
                <th className="p-4">Demand</th>
                <th className="p-4">Confidence</th>
                <th className="p-4">MAE</th>
                <th className="p-4">RMSE</th>
                <th className="p-4">MAPE</th>
                <th className="p-4">R²</th>
                <th className="p-4">Trend</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item, index) => (
                <tr
                  key={index}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="p-4 font-semibold text-cyan-400">
                    {item.model_name}
                  </td>

                  <td className="p-4">
                    {item.predicted_demand}
                  </td>

                  <td className="p-4 text-emerald-400 font-bold">
                    {item.confidence_score}%
                  </td>

                  <td className="p-4">
                    {item.mae}
                  </td>

                  <td className="p-4">
                    {item.rmse}
                  </td>

                  <td className="p-4">
                    {item.mape}%
                  </td>

                  <td className="p-4">
                    {item.r2_score}
                  </td>

                  <td className="p-4">
                    {item.trend}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="p-8 text-center text-slate-400"
                  >
                    No analytics found.
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

export default Analytics;