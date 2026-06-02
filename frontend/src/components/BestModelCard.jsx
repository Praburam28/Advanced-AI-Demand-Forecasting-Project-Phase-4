import { Trophy } from "lucide-react";

const BestModelCard = ({ model }) => {
  if (!model) {
    return (
      <div className="glass-card rounded-3xl p-6">
        <h2 className="text-xl font-bold theme-text-primary">
          Best Performing Model
        </h2>
        <p className="theme-text-muted mt-3">
          Run model comparison to view the best model.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
          <Trophy className="text-white" />
        </div>

        <div>
          <h2 className="text-xl font-bold theme-text-primary">
            Best Performing Model
          </h2>
          <p className="theme-text-muted text-sm">
            Based on lowest RMSE and highest confidence
          </p>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-cyan-400">
        {model.model_name}
      </h3>

      <div className="grid grid-cols-2 gap-4 mt-5">
        <div className="bg-white/5 rounded-2xl p-4">
          <p className="theme-text-muted text-sm">Avg RMSE</p>
          <h4 className="text-xl font-bold theme-text-primary">
            {model.average_rmse}
          </h4>
        </div>

        <div className="bg-white/5 rounded-2xl p-4">
          <p className="theme-text-muted text-sm">Confidence</p>
          <h4 className="text-xl font-bold text-emerald-400">
            {model.average_confidence}%
          </h4>
        </div>
      </div>
    </div>
  );
};

export default BestModelCard;