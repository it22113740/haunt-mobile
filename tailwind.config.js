/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        hunt: {
          paper: 'rgb(var(--hunt-paper) / <alpha-value>)',
          ink: 'rgb(var(--hunt-ink) / <alpha-value>)',
          mute: 'rgb(var(--hunt-mute) / <alpha-value>)',
          faint: 'rgb(var(--hunt-faint) / <alpha-value>)',
          line: 'rgb(var(--hunt-line) / <alpha-value>)',
          lineStrong: 'rgb(var(--hunt-line-strong) / <alpha-value>)',
          card: 'rgb(var(--hunt-card) / <alpha-value>)',
          accent: 'rgb(var(--hunt-accent) / <alpha-value>)',
          accentDeep: 'rgb(var(--hunt-accent-deep) / <alpha-value>)',
          gold: 'rgb(var(--hunt-gold) / <alpha-value>)',
          blush: 'rgb(var(--hunt-blush) / <alpha-value>)',
          danger: 'rgb(var(--hunt-danger) / <alpha-value>)',
          dangerSoft: 'rgb(var(--hunt-danger-soft) / <alpha-value>)',
          good: 'rgb(var(--hunt-good) / <alpha-value>)',
          goodSoft: 'rgb(var(--hunt-good-soft) / <alpha-value>)',
          onAccent: 'rgb(var(--hunt-on-accent) / <alpha-value>)',
          placeholder: 'rgb(var(--hunt-placeholder) / <alpha-value>)',
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
