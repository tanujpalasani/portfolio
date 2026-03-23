import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        dock: "0 18px 45px rgba(0, 0, 0, 0.45)",
        iconGlow: "0 0 30px rgba(255, 255, 255, 0.2)",
      },
      backgroundImage: {
        "desktop-noise":
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06) 0 2px, transparent 2px)",
      },
    },
  },
  plugins: [],
};

export default config;
