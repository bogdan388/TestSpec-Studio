/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#A855F7',
        secondary: '#7C3AED',
        neon: {
          purple: '#C084FC',
          pink: '#F0ABFC',
          blue: '#60A5FA',
          green: '#34D399',
        },
        dark: {
          900: '#0F0F1E',
          800: '#1A1A2E',
          700: '#252541',
        }
      },
      boxShadow: {
        'neon': '0 0 5px theme("colors.purple.400"), 0 0 20px theme("colors.purple.700")',
        'neon-lg': '0 0 10px theme("colors.purple.400"), 0 0 40px theme("colors.purple.600"), 0 0 80px theme("colors.purple.800")',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 5px #A855F7, 0 0 10px #A855F7, 0 0 15px #A855F7' },
          'to': { boxShadow: '0 0 10px #A855F7, 0 0 20px #A855F7, 0 0 30px #A855F7' },
        },
      },
    },
  },
  plugins: [],
}
