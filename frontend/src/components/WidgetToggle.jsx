import { SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

const widgetLabels = {
  kpi_cards: "KPI Cards",
  best_model: "Best Model",
  model_ranking: "Model Ranking",
  kpi_chart: "KPI Chart",
  model_comparison: "Model Comparison",
  confidence_trend: "Confidence Trend",
  forecast_analytics: "Forecast Analytics",
  recommendations: "Recommendations",
};

const WidgetToggle = ({ widgets, setWidgets }) => {
  const toggleWidget = (key) => {
    const updated = {
      ...widgets,
      [key]: !widgets[key],
    };

    setWidgets(updated);
    localStorage.setItem("dashboard_widgets", JSON.stringify(updated));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-3xl p-6"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <SlidersHorizontal size={21} className="text-white" />
        </div>

        <div>
          <h2 className="text-xl font-bold theme-text-primary">
            Customize Dashboard Widgets
          </h2>
          <p className="text-sm theme-text-muted">
            Show or hide dashboard analytics sections
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {Object.keys(widgetLabels).map((key) => (
          <label
            key={key}
            className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition ${
              widgets[key]
                ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                : "bg-white/5 border-white/10 theme-text-muted"
            }`}
          >
            <input
              type="checkbox"
              checked={!!widgets[key]}
              onChange={() => toggleWidget(key)}
              className="accent-cyan-400"
            />

            <span className="text-sm font-medium">
              {widgetLabels[key]}
            </span>
          </label>
        ))}
      </div>
    </motion.div>
  );
};

export default WidgetToggle;