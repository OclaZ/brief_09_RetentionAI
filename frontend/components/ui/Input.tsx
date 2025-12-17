export function Input({ label, ...props }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</label>
      <input 
        className="bg-[#2a2d36] border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-green transition-all placeholder:text-gray-600"
        {...props}
      />
    </div>
  );
}