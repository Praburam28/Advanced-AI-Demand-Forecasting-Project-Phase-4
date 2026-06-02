import { useEffect, useState } from "react";

import {
  Database,
  BarChart3,
  Brain,
  FileText,
  TrendingUp,
} from "lucide-react";

import API from "../api/axios";

import StatCard from "../components/StatCard";

import KPIChart from "../components/charts/KPIChart";
import ModelComparisonChart from "../components/charts/ModelComparisonChart";
import ConfidenceTrendChart from "../components/charts/ConfidenceTrendChart";

import WidgetToggle from "../components/WidgetToggle";
import BestModelCard from "../components/BestModelCard";
import ModelRankingTable from "../components/ModelRankingTable";
import ForecastAnalyticsTable from "../components/ForecastAnalyticsTable";
import DashboardExportButtons from "../components/DashboardExportButtons";
import Loader from "../components/Loader";
import SkeletonCard from "../components/SkeletonCard";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const [widgets, setWidgets] = useState(() => {
    const saved = localStorage.getItem("dashboard_widgets");

    return saved
      ? JSON.parse(saved)
      : {
          kpi_cards: true,
          best_model: true,
          model_ranking: true,
          kpi_chart: true,
          model_comparison: true,
          confidence_trend: true,
          forecast_analytics: true,
          recommendations: true,
        };
  });

  const fetchSummary = async () => {
    try {
      setLoading(true);

      const res = await API.get("/dashboard/summary");

      setSummary(res.data);
    } catch (error) {
      console.error("Dashboard error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const kpis = summary?.kpis;

  const kpiChartData = [
    {
      name: "Datasets",
      value: kpis?.total_datasets || 0,
    },
    {
      name: "Forecasts",
      value: kpis?.total_forecasts || 0,
    },
    {
      name: "Reports",
      value: kpis?.total_reports || 0,
    },
    {
      name: "Insights",
      value: kpis?.total_ai_insights || 0,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <Loader />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-8 shadow-2xl shadow-cyan-500/20">
        <h1 className="text-3xl font-extrabold text-white">
          AI Demand Forecasting Dashboard
        </h1>

        <p className="text-cyan-50 mt-3 text-sm md:text-base">
          KPI overview, model ranking, confidence analytics, forecast insights
          and enterprise business recommendations.
        </p>

        <div className="mt-6">
          <DashboardExportButtons />
        </div>
      </div>

      <WidgetToggle widgets={widgets} setWidgets={setWidgets} />

      {widgets.kpi_cards && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
          <StatCard
            title="Datasets"
            value={kpis?.total_datasets || 0}
            icon={Database}
          />

          <StatCard
            title="Forecasts"
            value={kpis?.total_forecasts || 0}
            icon={BarChart3}
          />

          <StatCard
            title="AI Insights"
            value={kpis?.total_ai_insights || 0}
            icon={Brain}
          />

          <StatCard
            title="Reports"
            value={kpis?.total_reports || 0}
            icon={FileText}
          />

          <StatCard
            title="Avg Confidence"
            value={`${kpis?.average_confidence_score || 0}%`}
            icon={TrendingUp}
          />
        </div>
      )}

      {(widgets.best_model || widgets.model_ranking) && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {widgets.best_model && <BestModelCard model={summary?.best_model} />}

          {widgets.model_ranking && (
            <ModelRankingTable models={summary?.model_ranking || []} />
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {widgets.kpi_chart && <KPIChart data={kpiChartData} />}

        {widgets.model_comparison && (
          <ModelComparisonChart data={summary?.model_comparison || []} />
        )}
      </div>

      {widgets.confidence_trend && (
        <ConfidenceTrendChart data={summary?.accuracy_trends || []} />
      )}

      {widgets.forecast_analytics && (
        <ForecastAnalyticsTable data={summary?.accuracy_trends || []} />
      )}

      {widgets.recommendations && (
        <div className="glass-card rounded-3xl p-6">
          <h2 className="text-xl font-bold theme-text-primary mb-5">
            Business Recommendations
          </h2>

          <div className="space-y-3">
            {summary?.business_recommendations?.map((item, index) => (
              <div
                key={index}
                className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 p-4 rounded-2xl shadow-md"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;