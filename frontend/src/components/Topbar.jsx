import {
  LogOut,
  UserCircle,
  Search,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate, Link } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";

const Topbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl theme-topbar border-b px-4 md:px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-cyan-400" />

            <h2 className="text-lg md:text-xl font-bold theme-text-primary">
              Advanced AI Demand Forecasting
            </h2>
          </div>

          <p className="text-xs md:text-sm theme-text-muted">
            Intelligent automation, analytics and enterprise integrations
          </p>
        </div>

        <div className="hidden xl:flex items-center gap-2 theme-input border rounded-2xl px-4 py-2 w-80">
          <Search size={18} className="text-slate-400" />

          <input
            className="bg-transparent outline-none text-sm w-full theme-text-primary placeholder:text-slate-500"
            placeholder="Search modules, reports, datasets..."
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="bg-white/10 border border-white/10 p-3 rounded-2xl hover:bg-white/20 transition"
          >
            {theme === "dark" ? (
              <Sun size={20} className="text-yellow-300" />
            ) : (
              <Moon size={20} className="text-indigo-600" />
            )}
          </button>

          <NotificationDropdown />

          <Link
            to="/profile"
            className="hidden sm:flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-2xl theme-text-primary hover:bg-white/20"
          >
            <UserCircle size={22} />
            <span className="text-sm">{user?.full_name || "User"}</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-2 rounded-2xl hover:bg-red-500/20"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;