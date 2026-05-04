import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

/**
 * Configuración de Tailwind CSS para Stockly
 * Colores y tipografías adaptados del prototipo Ukiyo Garage (light mode)
 */
const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ---- Colores mapeados a CSS variables ---- */
      colors: {
        background: "rgb(var(--bg-base) / <alpha-value>)",
        foreground: "rgb(var(--text-primary) / <alpha-value>)",
        card: {
          DEFAULT: "rgb(var(--bg-card) / <alpha-value>)",
          foreground: "rgb(var(--text-primary) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "rgb(var(--bg-card) / <alpha-value>)",
          foreground: "rgb(var(--text-primary) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "rgb(var(--blue-main) / <alpha-value>)",
          foreground: "rgb(255 255 255 / <alpha-value>)",
          dim: "rgb(var(--blue-dim) / <alpha-value>)",
          mid: "rgb(var(--blue-mid) / <alpha-value>)",
          bright: "rgb(var(--blue-bright) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--bg-elevated) / <alpha-value>)",
          foreground: "rgb(var(--text-primary) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--bg-elevated) / <alpha-value>)",
          foreground: "rgb(var(--text-secondary) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--blue-dim) / <alpha-value>)",
          foreground: "rgb(var(--blue-bright) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "rgb(var(--red-main) / <alpha-value>)",
          foreground: "rgb(255 255 255 / <alpha-value>)",
          dim: "rgb(var(--red-dim) / <alpha-value>)",
          bright: "rgb(var(--red-bright) / <alpha-value>)",
        },
        success: {
          DEFAULT: "rgb(var(--green-main) / <alpha-value>)",
          dim: "rgb(var(--green-dim) / <alpha-value>)",
          bright: "rgb(var(--green-bright) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "rgb(var(--amber-main) / <alpha-value>)",
          dim: "rgb(var(--amber-dim) / <alpha-value>)",
          bright: "rgb(var(--amber-bright) / <alpha-value>)",
        },
        purple: {
          DEFAULT: "rgb(var(--purple-main) / <alpha-value>)",
          dim: "rgb(var(--purple-dim) / <alpha-value>)",
          bright: "rgb(var(--purple-bright) / <alpha-value>)",
        },
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--border) / <alpha-value>)",
        ring: "rgb(var(--blue-main) / <alpha-value>)",
        elevated: "rgb(var(--bg-elevated) / <alpha-value>)",
      },

      /* ---- Tipografías ---- */
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },

      /* ---- Border radius ---- */
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius)",
        sm: "calc(var(--radius) - 2px)",
      },

      /* ---- Box shadows ---- */
      boxShadow: {
        card: "var(--shadow)",
        "card-md": "var(--shadow-md)",
        "card-lg": "var(--shadow-lg)",
      },

      /* ---- Animaciones ---- */
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.3s ease",
        "slide-in": "slide-in 0.25s ease",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },

      /* ---- Transiciones ---- */
      transitionTimingFunction: {
        stockly: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        fast: "180ms",
      },
    },
  },
  plugins: [tailwindAnimate],
};

export default config;
