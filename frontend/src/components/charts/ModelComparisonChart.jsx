import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts";

const ModelComparisonChart = ({ data }) => {
  return (
    <div className="glass-card rounded-3xl p-6">
      <h2 className="text-xl font-bold text-white mb-5">
        Model Comparison
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <RadarChart data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="model_name" stroke="#cbd5e1" />
          <PolarRadiusAxis stroke="#64748b" />

          <Radar
            dataKey="average_confidence"
            stroke="#818cf8"
            fill="#818cf8"
            fillOpacity={0.45}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "12px",
              color: "#fff",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ModelComparisonChart;