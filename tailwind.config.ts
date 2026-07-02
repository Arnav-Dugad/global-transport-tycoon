import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          950: '#0a0e17',
          900: '#0f1420',
          800: '#161d2e',
          700: '#1f2940',
          600: '#2a3654',
        },
        accent: {
          DEFAULT: '#38e8c6',
          soft: '#5ff0d4',
          dim: '#1fb89a',
        },
        gold: '#ffcf5c',
        danger: '#ff5c7a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.45)',
        glow: '0 0 24px rgba(56,232,198,0.35)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
} satisfies Config;
