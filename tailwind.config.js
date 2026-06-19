/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        tomato: {
          50: "#FEF2F1",
          100: "#FDE0DC",
          200: "#F9B7AF",
          300: "#F38E82",
          400: "#EE6555",
          500: "#E74C3C",
          600: "#CB3E2F",
          700: "#A83326",
          800: "#85281E",
          900: "#621D16",
        },
        mint: {
          50: "#ECF9F4",
          100: "#CFF0E3",
          200: "#9EE1C7",
          300: "#6DD2AB",
          400: "#3EC38F",
          500: "#3EB489",
          600: "#32916E",
          700: "#276E54",
          800: "#1B4A39",
          900: "#10271F",
        },
      },
      fontFamily: {
        mono: ['"SF Mono"', '"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        pulseRing: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
      },
      animation: {
        'pulse-ring': 'pulseRing 2s ease-in-out infinite',
        shake: 'shake 0.4s ease-in-out',
      },
    },
  },
  plugins: [],
};
