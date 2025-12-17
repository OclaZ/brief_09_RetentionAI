import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // On ajoute ces lignes pour couvrir le dossier src/ si tu l'utilises
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    
    // On garde aussi les chemins racines au cas où
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f1115",
        card: "#181b21",
        "brand-green": "#a3e6a5",
        "brand-purple": "#bfa6ff",
        "brand-light": "#f3f4f6",
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      fontFamily: {
        // On force la police par défaut ici pour être sûr
        sans: ['var(--font-inter)', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
export default config;