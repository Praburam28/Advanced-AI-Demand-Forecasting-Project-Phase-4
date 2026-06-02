import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Mail, LockKeyhole } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl -top-20 -left-20" />
      <div className="absolute w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl bottom-0 right-0" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md glass-card rounded-3xl p-8"
      >
        <div className="flex justify-center mb-5">
          <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-xl shadow-cyan-500/30">
            <Sparkles className="text-white" size={30} />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-center text-white">
          Welcome Back
        </h1>

        <p className="text-center text-slate-400 mt-2">
          Login to your AI forecasting workspace
        </p>

        {error && (
          <div className="mt-5 bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-2xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl px-4 py-3">
            <Mail size={18} className="text-cyan-300" />
            <input
              type="email"
              placeholder="Email address"
              className="bg-transparent outline-none w-full text-white placeholder:text-slate-500"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />
          </div>

          <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl px-4 py-3">
            <LockKeyhole size={18} className="text-cyan-300" />
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent outline-none w-full text-white placeholder:text-slate-500"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />
          </div>

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-cyan-300 hover:text-cyan-200"
            >
              Forgot Password?
            </Link>
          </div>

          <button className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition">
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-cyan-300 font-semibold hover:text-cyan-200"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;