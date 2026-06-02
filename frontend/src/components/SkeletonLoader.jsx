const SkeletonLoader = ({ rows = 4 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="h-12 bg-slate-200 rounded-xl animate-pulse"
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;