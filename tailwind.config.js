/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: '#0a0a0f',
        panel:   '#12121a',
        card:    '#1a1a26',
        border:  '#2a2a3d',
        accent:  '#6366f1',
        'accent-hover': '#4f46e5',
        amber:   '#D4A017',
        muted:   '#6b7280',
        subtle:  '#374151',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
      animation: {
        'fade-up':  'fadeSlideUp 0.4s ease forwards',
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeSlideUp: {
          '0%':   { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        skeleton: {
          '0%, 100%': { opacity: '0.4' },
          '50%':      { opacity: '1'   },
        },
      },
    },
  },
  plugins: [],
}
