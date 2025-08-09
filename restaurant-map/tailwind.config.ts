import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
          glass: 'var(--bg-glass)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        accent: {
          primary: 'var(--accent-primary)',
          secondary: 'var(--accent-secondary)',
          tertiary: 'var(--accent-tertiary)',
        },
        border: {
          primary: 'var(--border-primary)',
          secondary: 'var(--border-secondary)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'title': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'title-lg': ['28px', { lineHeight: '36px', fontWeight: '700' }],
        'data': ['32px', { lineHeight: '40px', fontWeight: '500' }],
        'data-lg': ['40px', { lineHeight: '48px', fontWeight: '500' }],
        'body': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label': ['14px', { lineHeight: '20px', fontWeight: '500' }],
      },
      boxShadow: {
        primary: 'var(--shadow-primary)',
        secondary: 'var(--shadow-secondary)',
        glow: {
          primary: 'var(--glow-primary)',
          secondary: 'var(--glow-secondary)',
        },
      },
    },
  },
  plugins: [],
};

export default config;
