const SkeletonCard = () => {
  return (
    <div className="glass-card rounded-3xl p-6 animate-pulse">
      <div className="h-5 w-24 bg-white/10 rounded mb-5"></div>

      <div className="h-10 w-32 bg-white/10 rounded"></div>
    </div>
  );
};

export default SkeletonCard;