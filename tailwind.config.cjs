/** @type {import('tailwindcss').Config} */

// Tailwind v4 spacing: every N maps to N * 0.25rem (CLONE_SPEC intro). Generate 0..200 in .5 steps
// so v4 class names from the saved HTML (pt-34, -mt-73, h-17, h-12.5, size-4.5, size-22 ...) work as-is.
const spacing = {}
for (let i = 0; i <= 400; i++) {
  const n = i / 2
  spacing[String(n)] = `${n * 0.25}rem`
}
spacing.px = '1px'

// v4 accepts any integer opacity modifier (bg-ink-950/6, bg-white/62 ...). v3 needs them in the scale.
const opacity = {}
for (let i = 0; i <= 100; i++) opacity[String(i)] = String(i / 100)

const spans = {}
const cols = {}
for (let i = 1; i <= 24; i++) {
  spans[`span-${i}`] = `span ${i} / span ${i}`
  cols[String(i)] = `repeat(${i}, minmax(0, 1fr))`
}

module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    // CLONE_SPEC 0.7 (360 = the `min-[360px]` step; kept as `xs` too)
    screens: {
      xs: '360px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    // CLONE_SPEC 0.3 (v4 radius scale; differs from v3 defaults)
    borderRadius: {
      none: '0',
      sm: '0.25rem',
      DEFAULT: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      '4xl': '2rem',
      full: '9999px',
    },
    // CLONE_SPEC 0.6 (v4 type scale)
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
    },
    extend: {
      spacing,
      opacity,
      gridColumn: spans,
      gridTemplateColumns: cols,
      // CLONE_SPEC 0.1 (hex = sRGB conversion of the oklch tokens)
      colors: {
        white: '#ffffff',
        ink: {
          50: '#f8fafc',
          100: '#f1f5f9',
          150: '#eaedf0',
          200: '#e2e8f0',
          300: '#cad5e2',
          400: '#90a1b9',
          500: '#62748e',
          600: '#45556c',
          700: '#314158',
          800: '#1d293d',
          900: '#0f172b',
          950: '#020618',
        },
        primary: {
          50: '#f0f9ff',
          100: '#dff2fe',
          200: '#b8e6fe',
          300: '#74d4ff',
          400: '#00bcff',
          500: '#00a6f4',
          600: '#0084d1',
          700: '#0069a8',
          800: '#00598a',
          900: '#024a70',
          950: '#052f4a',
        },
        'accent-a': {
          50: '#ecfdf5', 100: '#d0fae5', 200: '#a4f4cf', 300: '#5ee9b5', 400: '#00d492',
          500: '#00bc7d', 600: '#009966', 700: '#007a55', 800: '#006045', 950: '#002c22',
        },
        'accent-b': {
          50: '#fffbeb', 100: '#fef3c6', 200: '#fee685', 300: '#ffd230', 400: '#ffb900',
          500: '#fe9a00', 600: '#e17100', 700: '#bb4d00', 800: '#973c00', 900: '#7b3306', 950: '#461901',
        },
        'accent-c': {
          50: '#fef2f2', 200: '#ffc9c9', 300: '#ffa2a2', 400: '#ff6467', 500: '#fb2c36',
          600: '#e7000b', 700: '#c10007', 800: '#9f0712', 900: '#82181a',
        },
        'accent-d': {
          50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6ff', 300: '#c4b4ff', 400: '#a684ff',
          500: '#8e51ff', 600: '#7f22fe', 800: '#5d0ec0', 900: '#4d179a', 950: '#2f0d68',
        },
        'violet-soft': '#f2edfe',
        'azure-soft': '#d4f8fe',
        'azure-bold': '#196f7c',
        'teal-soft': '#c5fef0',
        'lime-soft': '#ebf9b8',
        'lime-bold': '#616e19',
      },
      // CLONE_SPEC 0.5
      fontFamily: {
        sans: ['Inter', '"Inter Fallback: sans-serif"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Sentient', '"Sentient Fallback: Georgia"', '"Sentient Fallback: Times New Roman"', 'ui-serif', 'Georgia', 'serif'],
        mono: ['"Fira Code"', '"Fira Code Fallback: monospace"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      lineHeight: {
        display: '1.015',
      },
      // CLONE_SPEC 0.2
      boxShadow: {
        edge: '0 0 0 1px var(--cast-10), 0 1px 2px -1px var(--cast-08)',
        'edge-hover': '0 0 0 1px var(--cast-20), 0 2px 4px -1px var(--cast-08), 0 4px 8px -2px var(--cast-06)',
        lift: 'var(--shadow-lift)',
        over: 'var(--shadow-over)',
        sm: '0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px -1px rgba(0,0,0,.1)',
        xs: '0 1px 2px 0 rgba(0,0,0,.05)',
      },
      // CLONE_SPEC 0.4
      transitionTimingFunction: {
        smooth: 'cubic-bezier(.22, 1, .36, 1)',
        out: 'cubic-bezier(0, 0, .2, 1)',
        'in-out': 'cubic-bezier(.4, 0, .2, 1)',
        spring: 'cubic-bezier(.16, 1, .3, 1)',
        travel: 'cubic-bezier(.5, .02, .2, 1)',
      },
      zIndex: {
        2: '2', 3: '3', 25: '25', 30: '30', 35: '35', 60: '60', 65: '65', 70: '70',
        100: '100', 120: '120', 130: '130',
      },
      maxWidth: {
        '7xl': '80rem',
      },
    },
  },
  plugins: [],
}
