import { useEffect, useState } from "react";
import { Bell, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import API from "../api/axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const res = await API.get("/notifications/");
    setNotifications(res.data);
  };

  const markAsRead = async (id) => {
    await API.put(`/notifications/${id}/read`);
    fetchNotifications();
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-cyan-500 p-8 shadow-2xl shadow-cyan-500/20">
        <h1 className="text-3xl font-extrabold text-white">Notifications</h1>
        <p className="text-cyan-50 mt-2">
          Forecast alerts, report alerts, system notifications, and threshold warnings.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <Bell className="text-cyan-300" />
          <h2 className="text-xl font-bold text-white">Notification Center</h2>
        </div>

        <div className="space-y-4">
          {notifications.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border p-5 ${
                item.is_read
                  ? "bg-white/5 border-white/10"
                  : "bg-cyan-500/10 border-cyan-500/30"
              }`}
            >
              <div className="flex justify-between gap-4">
                <div>
                  <h3 className="font-bold text-white">{item.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {item.message}
                  </p>
                  <p className="text-xs text-cyan-300 mt-2">
                    {item.notification_type}
                  </p>
                </div>

                {!item.is_read && (
                  <button
                    onClick={() => markAsRead(item.id)}
                    className="h-fit flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-cyan-500/20 text-cyan-300"
                  >
                    <CheckCircle2 size={16} />
                    Read
                  </button>
                )}
              </div>
            </motion.div>
          ))}

          {notifications.length === 0 && (
            <p className="text-slate-400">No notifications found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;