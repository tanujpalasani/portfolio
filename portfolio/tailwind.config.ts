import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'float-slow': 'float-slow 20s ease-in-out infinite',
        'float-medium': 'float-medium 16s ease-in-out infinite',
        'float-fast': 'float-fast 12s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'slide-up': 'slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fade-in 0.25s ease-out',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(30px, -20px, 0)' },
        },
        'float-medium': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(-25px, 15px, 0)' },
        },
        'float-fast': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(20px, -25px, 0)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.85', filter: 'brightness(1.2)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        'glass': 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 20px 60px rgba(0, 0, 0, 0.5)',
        'glass-lg': 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 25px 80px rgba(0, 0, 0, 0.7)',
        'dock': '0 18px 45px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.22)',
        'window-active': 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 25px 80px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'window-inactive': 'inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 16px 48px rgba(0, 0, 0, 0.58)',
        'icon-glow-cyan': '0 0 25px rgba(34, 211, 238, 0.4), 0 10px 30px rgba(0, 0, 0, 0.3)',
        'icon-glow-blue': '0 0 25px rgba(59, 130, 246, 0.4), 0 10px 30px rgba(0, 0, 0, 0.3)',
        'icon-glow-purple': '0 0 25px rgba(168, 85, 247, 0.4), 0 10px 30px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 14px 32px rgba(34, 211, 238, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.16)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)',
      },
    },
  },
  plugins: [],
};

export default config;
