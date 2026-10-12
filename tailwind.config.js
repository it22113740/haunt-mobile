/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        haunt: {
          paper: 'rgb(var(--haunt-paper) / <alpha-value>)',
          ink: 'rgb(var(--haunt-ink) / <alpha-value>)',
          mute: 'rgb(var(--haunt-mute) / <alpha-value>)',
          faint: 'rgb(var(--haunt-faint) / <alpha-value>)',
          line: 'rgb(var(--haunt-line) / <alpha-value>)',
          lineStrong: 'rgb(var(--haunt-line-strong) / <alpha-value>)',
          card: 'rgb(var(--haunt-card) / <alpha-value>)',
          accent: 'rgb(var(--haunt-accent) / <alpha-value>)',
          accentDeep: 'rgb(var(--haunt-accent-deep) / <alpha-value>)',
          gold: 'rgb(var(--haunt-gold) / <alpha-value>)',
          blush: 'rgb(var(--haunt-blush) / <alpha-value>)',
          danger: 'rgb(var(--haunt-danger) / <alpha-value>)',
          dangerSoft: 'rgb(var(--haunt-danger-soft) / <alpha-value>)',
          good: 'rgb(var(--haunt-good) / <alpha-value>)',
          goodSoft: 'rgb(var(--haunt-good-soft) / <alpha-value>)',
          onAccent: 'rgb(var(--haunt-on-accent) / <alpha-value>)',
          placeholder: 'rgb(var(--haunt-placeholder) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['BricolageGrotesque_700Bold'],
        'display-extra': ['BricolageGrotesque_800ExtraBold'],
        sans: ['BricolageGrotesque_400Regular'],
        'sans-medium': ['BricolageGrotesque_500Medium'],
        'sans-semibold': ['BricolageGrotesque_600SemiBold'],
        mono: ['IBMPlexMono_400Regular'],
        'mono-medium': ['IBMPlexMono_500Medium'],
        'mono-bold': ['IBMPlexMono_600SemiBold'],
        hand: ['Caveat_600SemiBold'],
      },
      fontSize: {
        'display-xl': ['40px', { lineHeight: '44px' }],
        'display-lg': ['32px', { lineHeight: '34px' }],
        title: ['22px', { lineHeight: '26px' }],
        body: ['16px', { lineHeight: '22px' }],
        caption: ['13px', { lineHeight: '18px' }],
      },
    },
  },
  plugins: [],
};
