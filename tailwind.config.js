/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#FF5A00', // Health Mitra Orange
          600: '#E64D00',
          700: '#C23C00',
          800: '#9A3000',
          900: '#7C2700',
          DEFAULT: '#FF5A00',
        },
        navy: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A', // Dark Navy/Charcoal
          950: '#0A0F1D',
          DEFAULT: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px -2px rgba(15, 23, 42, 0.05), 0 4px 16px -4px rgba(15, 23, 42, 0.08)',
        'card-hover': '0 8px 24px -4px rgba(15, 23, 42, 0.12), 0 4px 8px -2px rgba(15, 23, 42, 0.04)',
        'orange-glow': '0 8px 20px -4px rgba(255, 90, 0, 0.25)',
      }
    },
  },
  plugins: [],
}
