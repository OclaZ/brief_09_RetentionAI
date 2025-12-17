import { cn } from "@/lib/utils"; // Assure-toi d'avoir une fonction cn ou utilise clsx directement

export function Card({ children, className, variant = "dark" }: { children: React.ReactNode, className?: string, variant?: "dark" | "green" | "purple" | "light" }) {
  const variants = {
    dark: "bg-card text-white border border-gray-800",
    green: "bg-brand-green text-gray-900",
    purple: "bg-brand-purple text-gray-900",
    light: "bg-white text-gray-900"
  };

  return (
    <div className={cn("rounded-3xl p-6 shadow-xl transition-all hover:scale-[1.01]", variants[variant], className)}>
      {children}
    </div>
  );
}