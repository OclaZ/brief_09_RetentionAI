export function Button({ children, onClick, isLoading, variant="primary" }: any) {
    const style = variant === "primary" 
        ? "bg-brand-green text-gray-900 hover:bg-[#8fdcb0]" 
        : "bg-gray-700 text-white hover:bg-gray-600";

  return (
    <button 
      onClick={onClick}
      disabled={isLoading}
      className={`${style} w-full font-bold rounded-xl py-4 transition-all active:scale-95 flex justify-center items-center gap-2`}
    >
      {isLoading ? <span className="animate-spin">◌</span> : children}
    </button>
  );
}