const Loader = () => {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-5 rounded-full bg-cyan-400 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;