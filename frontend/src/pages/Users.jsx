import { useEffect, useState } from "react";
import { Users as UsersIcon, ShieldCheck, ToggleLeft } from "lucide-react";
import { motion } from "framer-motion";
import API from "../api/axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users/");
      setUsers(res.data);
    } catch {
      setMessage("Admin access required.");
    }
  };

  const toggleStatus = async (user) => {
    await API.put(`/users/${user.id}/status`, {
      account_status: user.is_active ? "blocked" : "active",
      is_active: !user.is_active,
    });

    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-cyan-500 p-8 shadow-2xl shadow-cyan-500/20">
        <h1 className="text-3xl font-extrabold text-white">
          User Management
        </h1>
        <p className="text-cyan-50 mt-2">
          Manage users, roles, account status and platform access.
        </p>
      </div>

      {message && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-2xl">
          {message}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <UsersIcon className="text-cyan-300" />
          <h2 className="text-xl font-bold text-white">
            Platform Users
          </h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/10 text-left text-slate-300">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="p-4">{user.full_name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full">
                      <ShieldCheck size={14} />
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={
                        user.is_active
                          ? "text-emerald-300"
                          : "text-red-300"
                      }
                    >
                      {user.account_status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleStatus(user)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-cyan-500/20 text-cyan-300"
                    >
                      <ToggleLeft size={16} />
                      {user.is_active ? "Block" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    No users found or admin access required.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Users;