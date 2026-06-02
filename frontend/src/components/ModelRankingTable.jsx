const ModelRankingTable = ({ models = [] }) => {
  return (
    <div className="glass-card rounded-3xl p-6">
      <h2 className="text-xl font-bold theme-text-primary mb-5">
        Model Ranking
      </h2>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/10 text-left text-slate-300">
              <th className="p-4">Rank</th>
              <th className="p-4">Model</th>
              <th className="p-4">RMSE</th>
              <th className="p-4">Confidence</th>
            </tr>
          </thead>

          <tbody>
            {models.map((model, index) => (
              <tr
                key={index}
                className="border-t border-white/10 hover:bg-white/5"
              >
                <td className="p-4 font-bold text-cyan-400">
                  #{index + 1}
                </td>
                <td className="p-4">{model.model_name}</td>
                <td className="p-4">{model.average_rmse}</td>
                <td className="p-4 text-emerald-400 font-semibold">
                  {model.average_confidence}%
                </td>
              </tr>
            ))}

            {models.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-slate-400">
                  No model ranking available yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModelRankingTable;