import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  LockKeyhole,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

import { motion } from "framer-motion";

import API from "../api/axios";

const ForgotPassword = () => {
  const [form, setForm] = useState({
    email: "",
    new_password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const res = await API.post(
        "/auth/reset-password",
        form
      );

      setMessage(
        res.data.message ||
          "Password updated successfully"
      );

      setForm({
        email: "",
        new_password: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Password reset failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl -top-20 -left-20" />

      <div className="absolute w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl bottom-0 right-0" />

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.5,
        }}
        className="relative w-full max-w-md glass-card rounded-3xl p-8"
      >
        <div className="flex justify-center mb-5">
          <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-xl shadow-cyan-500/30">
            <Sparkles
              className="text-white"
              size={30}
            />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-center text-white">
          Reset Password
        </h1>

        <p className="text-center text-slate-400 mt-2">
          Update your account password securely
        </p>

        {message && (
          <div className="mt-5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-2xl">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-5 bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-2xl">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-7 space-y-4"
        >
          <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl px-4 py-3">
            <Mail
              size={18}
              className="text-cyan-300"
            />

            <input
              type="email"
              placeholder="Email address"
              className="bg-transparent outline-none w-full text-white placeholder:text-slate-500"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl px-4 py-3">
            <LockKeyhole
              size={18}
              className="text-cyan-300"
            />

            <input
              type="password"
              placeholder="New password"
              className="bg-transparent outline-none w-full text-white placeholder:text-slate-500"
              value={form.new_password}
              onChange={(e) =>
                setForm({
                  ...form,
                  new_password:
                    e.target.value,
                })
              }
              required
            />
          </div>

          <button className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition">
            Update Password
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;