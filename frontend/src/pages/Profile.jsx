import { useEffect, useState } from "react";
import { UserCircle, Save, Mail } from "lucide-react";
import { motion } from "framer-motion";
import API from "../api/axios";

const Profile = () => {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    API.get("/users/me").then((res) => {
      setForm(res.data);
    });
  }, []);

  const updateProfile = async (e) => {
    e.preventDefault();

    await API.put("/users/me", form);

    setMessage("Profile updated successfully.");
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-cyan-500 p-8 shadow-2xl shadow-cyan-500/20">
        <h1 className="text-3xl font-extrabold text-white">
          My Profile
        </h1>
        <p className="text-cyan-50 mt-2">
          Manage your account details and personal information.
        </p>
      </div>

      <motion.form
        onSubmit={updateProfile}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-6 space-y-5"
      >
        <div className="flex items-center gap-3">
          <UserCircle className="text-cyan-300" />
          <h2 className="text-xl font-bold text-white">
            Account Information
          </h2>
        </div>

        {message && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-2xl">
            {message}
          </div>
        )}

        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Full Name
          </label>
          <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl px-4 py-3">
            <UserCircle size={18} className="text-cyan-300" />
            <input
              className="bg-transparent outline-none w-full text-white placeholder:text-slate-500"
              value={form.full_name || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  full_name: e.target.value,
                })
              }
              placeholder="Full Name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Email Address
          </label>
          <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl px-4 py-3">
            <Mail size={18} className="text-cyan-300" />
            <input
              className="bg-transparent outline-none w-full text-white placeholder:text-slate-500"
              value={form.email || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              placeholder="Email"
            />
          </div>
        </div>

        <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition">
          <Save size={18} />
          Update Profile
        </button>
      </motion.form>
    </div>
  );
};

export default Profile;