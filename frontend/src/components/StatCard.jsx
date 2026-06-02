import { motion } from "framer-motion";

const StatCard = ({ title, value, icon: Icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-3xl glass-card p-6"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10" />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <h3 className="text-3xl font-extrabold mt-2 text-white">
            {value}
          </h3>
        </div>

        {Icon && (
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Icon size={26} className="text-white" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;