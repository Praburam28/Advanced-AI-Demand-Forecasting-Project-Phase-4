import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen app-bg flex items-center justify-center px-4">
      <div className="glass-card rounded-3xl p-10 max-w-lg text-center">
        <div className="mx-auto h-16 w-16 rounded-3xl bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center mb-5">
          <AlertTriangle className="text-white" size={32} />
        </div>

        <h1 className="text-4xl font-extrabold theme-text-primary">
          404
        </h1>

        <p className="theme-text-muted mt-3">
          The page you are looking for does not exist.
        </p>

        <Link
          to="/dashboard"
          className="inline-block mt-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;