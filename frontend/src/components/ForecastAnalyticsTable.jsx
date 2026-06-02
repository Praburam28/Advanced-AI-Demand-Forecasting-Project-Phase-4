const ForecastAnalyticsTable = ({ data = [] }) => {
  return (
    <div className="glass-card rounded-3xl p-6">
      <h2 className="text-xl font-bold theme-text-primary mb-5">
        Advanced Forecast Analytics
      </h2>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/10 text-left text-slate-300">
              <th className="p-4">Model</th>
              <th className="p-4">Confidence</th>
              <th className="p-4">MAE</th>
              <th className="p-4">RMSE</th>
              <th className="p-4">MAPE</th>
              <th className="p-4">R²</th>
              <th className="p-4">Trend</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-t border-white/10 hover:bg-white/5">
                <td className="p-4 font-semibold text-cyan-400">{item.model_name}</td>
                <td className="p-4 text-emerald-400 font-bold">{item.confidence_score}%</td>
                <td className="p-4">{item.mae}</td>
                <td className="p-4">{item.rmse}</td>
                <td className="p-4">{item.mape}%</td>
                <td className="p-4">{item.r2_score}</td>
                <td className="p-4">{item.trend}</td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td colSpan="7" className="p-6 text-center text-slate-400">
                  No analytics available yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ForecastAnalyticsTable;