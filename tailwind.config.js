// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#3b9535',
            dark: '#1f591c',
            foreground: '#ffffff',
          },
          secondary: {
            DEFAULT: '#521c00',
            foreground: '#ffffff',
          },
          success: '#54b558',
          info: '#2f80ed',
          attention: '#e2b93b',
          destructive: '#eb5757',
          background: 'var(--background)',
          foreground: 'var(--foreground)',
          card: {
            DEFAULT: 'var(--card)',
            foreground: 'var(--card-foreground)',
          },
          popover: {
            DEFAULT: 'var(--popover)',
            foreground: 'var(--popover-foreground)',
          },
          muted: {
            DEFAULT: 'var(--muted)',
            foreground: 'var(--muted-foreground)',
          },
          accent: {
            DEFAULT: 'var(--accent)',
            foreground: 'var(--accent-foreground)',
          },
          border: 'var(--border)',
          input: 'var(--input)',
          ring: 'var(--ring)',
        },
        fontFamily: {
          sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
          mono: ['var(--font-geist-mono)', 'monospace'],
        },
        borderRadius: {
          lg: 'var(--radius)',
          md: 'calc(var(--radius) - 2px)',
          sm: 'calc(var(--radius) - 4px)',
        },
        animation: {
          'fade-in-up': 'fadeInUp 0.6s ease-out',
          'bounce-slow': 'bounce 2s infinite',
        },
        keyframes: {
          fadeInUp: {
            '0%': {
              opacity: '0',
              transform: 'translate3d(0, 30px, 0)',
            },
            '100%': {
              opacity: '1',
              transform: 'translate3d(0, 0, 0)',
            },
          },
        },
        maxWidth: {
          'screen-max': '1440px',
        },
      },
    },
    plugins: [],
  }