/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f5ee',
          100: '#c5e8d9',
          200: '#9ed7be',
          300: '#71c5a2',
          400: '#49b88c',
          500: '#0A5F38', // Main primary color (Brazilian green)
          600: '#095732',
          700: '#074a2b',
          800: '#053e23',
          900: '#03271a',
        },
        secondary: {
          50: '#fffce6',
          100: '#fff7c2',
          200: '#fff199',
          300: '#ffea66',
          400: '#ffe433',
          500: '#FFDF00', // Brazilian yellow
          600: '#cbb200',
          700: '#988600',
          800: '#665a00',
          900: '#332d00',
        },
        accent: {
          50: '#e6eeff',
          100: '#b2c9ff',
          200: '#7fa3ff',
          300: '#4c7dff',
          400: '#1958ff',
          500: '#002776', // Brazilian blue
          600: '#00205e',
          700: '#001947',
          800: '#00132f',
          900: '#000918',
        },
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      },
    },
  },
  plugins: [],
};