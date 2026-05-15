/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        eg: {
          coral: '#f04e4e',
          'coral-hover': '#ff5f5f',
          azul: '#18354a',
          'azul-dark': '#1c3a50',
          gris: '#6e7b8d',
          borde: '#e5e7eb',
          'bg-soft': '#fbfdff',
          'bg-card': '#f8fafc',
          'text-main': '#1f2f44',
          'text-muted': '#4b596c',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['"SF Mono"', 'Monaco', '"Cascadia Code"', '"Roboto Mono"', 'monospace'],
      },
      boxShadow: {
        eg: '0 10px 24px rgba(0,0,0,.06)',
        'eg-coral': '0 10px 22px rgba(240,78,78,.25)',
        'eg-lg': '0 14px 30px rgba(0,0,0,0.1)',
      },
      maxWidth: {
        'eg-content': '1100px',
        'eg-wide': '1200px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
