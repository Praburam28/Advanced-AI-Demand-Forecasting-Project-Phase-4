import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const NotificationDropdown = () => {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications/");
      setNotifications(res.data);
    } catch (error) {
      console.error("Notification fetch error", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const savedUser = JSON.parse(
      localStorage.getItem("user")
    );

    const userId = savedUser?.user_id;

    if (!userId) return;

    const socket = new WebSocket(
      `ws://127.0.0.1:8000/ws/notifications/${userId}`
    );

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setNotifications((prev) => [
        data,
        ...prev,
      ]);
    };

    socket.onerror = () => {
      console.log("WebSocket connection error");
    };

    return () => {
      socket.close();
    };
  }, [user]);

  const unreadCount = notifications.filter(
    (item) => !item.is_read
  ).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative bg-white/10 border border-white/10 p-3 rounded-2xl hover:bg-white/20 transition"
      >
        <Bell size={20} className="text-cyan-300" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-slate-950/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-white/10 font-bold text-white">
            Notifications
          </div>

          {notifications.slice(0, 8).map((item, index) => (
            <div
              key={item.id || index}
              className="p-4 border-b border-white/10 text-sm hover:bg-white/5"
            >
              <h4 className="font-semibold text-white">
                {item.title}
              </h4>

              <p className="text-slate-400 mt-1">
                {item.message}
              </p>

              <p className="text-xs text-cyan-300 mt-2">
                {item.notification_type}
              </p>
            </div>
          ))}

          {notifications.length === 0 && (
            <p className="p-4 text-sm text-slate-400">
              No notifications found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;