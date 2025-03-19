/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: '480px',
      },
      aspectRatio: {
        '1/5': '4 / 5', // Define custom aspect ratio
        '3/1': '3 / 1', // Define custom aspect ratio
        '12/7': '12 / 7', // Define custom aspect ratio
      },
      animation: {
        'spin-slow': 'spin 0.8s linear infinite',
      },
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      keyframes: {
        alertShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '50%': { transform: 'translateX(5px)' },
          '75%': { transform: 'translateX(-5px)' },
        },
        alertBgRed: {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(255, 0, 0, 0.7)' },
        },
      },
      animation: {
        spin: 'spin 2s linear infinite', // Slow down the spinning speed
        pulse: 'pulse 1s ease-in-out infinite', // Adjust pulse duration
        alert: 'alertShake 0.5s ease, alertBgRed 0.5s ease',
      },
    },
  },
  plugins: [],
}

