/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: { extend: { colors: { ink: '#0B0E14', paper: '#F4F1E8', brass: '#C9A24B', redline: '#A8342A', panel: '#12161F', line: '#232837', muted: '#8A93A6' }, fontFamily: { sans: ['var(--font-poppins)', 'sans-serif'] } } },
  plugins: [],
};
