/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf6f1',
          100: '#f5ece2',
          200: '#e5bb89',
          300: '#dba875',
          400: '#d19661',
          500: '#c7834d',
          600: '#b87239',
          700: '#a96125',
          800: '#8d4f1d',
          900: '#713d15'
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827'
        }
      },
      backgroundColor: {
        dark: {
          DEFAULT: '#121212',
          paper: '#1E1E1E',
          hover: '#2D2D2D'
        }
      },
      textColor: {
        dark: {
          primary: '#E4E4E7',
          secondary: '#A1A1AA',
          disabled: '#71717A'
        }
      },
      borderColor: {
        dark: {
          DEFAULT: '#2D2D2D',
          hover: '#404040'
        }
      },
      ringOffsetColor: {
        dark: '#121212'
      }
    }
  },
  plugins: []
};