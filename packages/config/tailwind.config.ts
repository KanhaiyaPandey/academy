import type { Config } from "tailwindcss";

const config: Omit<Config, "content"> = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e6f4ff",
          100: "#bae0ff",
          200: "#91caff",
          300: "#69b1ff",
          400: "#4096ff",
          500: "#1677ff",
          600: "#0958d9",
          700: "#003eb3",
          800: "#002c8c",
          900: "#001d66",
        },
        academy: {
          blue: "#1677ff",
          lightBlue: "#e6f4ff",
          darkBlue: "#0958d9",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        display: ["'Sora'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
        "card-hover": "0 8px 24px rgba(22,119,255,0.15), 0 0 0 1px rgba(22,119,255,0.1)",
      },
    },
  },
};

export default config;
