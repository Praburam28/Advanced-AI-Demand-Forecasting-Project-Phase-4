import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  Brain,
  BarChart3,
  Bot,
  Plug,
  Bell,
  FileText,
  Users,
  ShieldCheck,
  BellRing,
  Sparkles,
  LineChart
} from "lucide-react";

const menu = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Datasets", path: "/datasets", icon: Upload },
  { name: "Forecast", path: "/forecast", icon: BarChart3 },
  { name: "AI Insights", path: "/ai-insights", icon: Brain },
  { name: "Automation", path: "/automation", icon: Bot },
  { name: "Integrations", path: "/integrations", icon: Plug },
  { name: "Notifications", path: "/notifications", icon: Bell },
  { name: "Alert Settings", path: "/alerts", icon: BellRing },
  { name: "Reports", path: "/reports", icon: FileText },
  { name: "Users", path: "/users", icon: Users },
  { name: "Audit Logs", path: "/audit", icon: ShieldCheck },
  { name: "Analytics", path: "/analytics", icon: LineChart,},
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-72 min-h-screen hidden lg:flex flex-col bg-slate-950/80 backdrop-blur-xl border-r border-white/10">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Sparkles className="text-white" size={24} />
          </div>

          <div>
            <h1 className="text-xl font-extrabold text-white">
              AI Forecast
            </h1>
            <p className="text-xs text-slate-400">
              Phase 4 SaaS Platform
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                active
                  ? "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                  : "text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon
                size={19}
                className={active ? "text-white" : "group-hover:text-cyan-300"}
              />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-5 border-t border-white/10">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-600/30 to-cyan-500/20 p-4 border border-white/10">
          <p className="text-sm font-semibold text-white">
            Enterprise AI Ready
          </p>
          <p className="text-xs text-slate-300 mt-1">
            Forecasting, automation, reports and integrations.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;