export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center p-8 w-full h-40">
      <div className="relative w-10 h-10">
        <svg
          className="animate-spin w-full h-full text-primary-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center animate-pulse">
            <svg
              className="animate-spin w-8 h-8 text-primary-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          {/* Subtle Glow */}
          <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full -z-10 animate-pulse" />
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-lg font-bold text-secondary-900 tracking-tight">
            bakikhata
          </span>
          <span className="text-xs font-medium text-secondary-400 uppercase tracking-widest">
            লোডিং...
          </span>
        </div>
      </div>
    </div>
  );
};
