import defaultTheme from 'tailwindcss/defaultTheme';
import typography from '@tailwindcss/typography';

const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: v('paper'),
        ink: v('ink'),
        muted: v('muted'),
        rule: v('rule'),
        accent: v('accent'),
        wash: v('wash'),
      },
      fontFamily: {
        sans: ['"Schibsted Grotesk"', ...defaultTheme.fontFamily.sans],
        serif: ['"Instrument Serif"', ...defaultTheme.fontFamily.serif],
        mono: ['"IBM Plex Mono"', ...defaultTheme.fontFamily.mono],
      },
      fontSize: {
        display: ['clamp(2.75rem, 1.6rem + 5.2vw, 6.25rem)', { lineHeight: '0.98', letterSpacing: '-0.025em' }],
        title: ['clamp(2rem, 1.4rem + 2.6vw, 3.5rem)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
      },
      maxWidth: {
        page: '78rem',
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'rgb(var(--ink) / 0.86)',
            '--tw-prose-headings': 'rgb(var(--ink))',
            '--tw-prose-lead': 'rgb(var(--muted))',
            '--tw-prose-links': 'rgb(var(--ink))',
            '--tw-prose-bold': 'rgb(var(--ink))',
            '--tw-prose-counters': 'rgb(var(--muted))',
            '--tw-prose-bullets': 'rgb(var(--accent))',
            '--tw-prose-hr': 'rgb(var(--rule))',
            '--tw-prose-quotes': 'rgb(var(--ink))',
            '--tw-prose-quote-borders': 'rgb(var(--accent))',
            '--tw-prose-captions': 'rgb(var(--muted))',
            '--tw-prose-code': 'rgb(var(--ink))',
            '--tw-prose-th-borders': 'rgb(var(--rule))',
            '--tw-prose-td-borders': 'rgb(var(--rule))',
            a: {
              textDecorationColor: 'rgb(var(--accent))',
              textUnderlineOffset: '3px',
              textDecorationThickness: '1px',
              fontWeight: '500',
              '&:hover': { color: 'rgb(var(--accent))' },
            },
            h2: { fontFamily: '"Instrument Serif", serif', fontWeight: '400', fontSize: '2em', letterSpacing: '-0.01em' },
            h3: { fontWeight: '600' },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            code: {
              fontWeight: '500',
              backgroundColor: 'rgb(var(--wash))',
              padding: '0.15em 0.35em',
              borderRadius: '3px',
            },
            'pre code': { backgroundColor: 'transparent', padding: '0' },
            pre: { borderRadius: '6px' },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
