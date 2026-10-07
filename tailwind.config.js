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
          line: 'rgb(var(--haunt-line) / <alpha-value>)',
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
        },
      },
      fontFamily: {
        display: ['BricolageGrotesque_700Bold'],
        'display-extra': ['BricolageGrotesque_800ExtraBold'],
        sans: ['Inter_400Regular'],
        'sans-medium': ['Inter_500Medium'],
        'sans-semibold': ['Inter_600SemiBold'],
        mono: ['JetBrainsMono_500Medium'],
        'mono-bold': ['JetBrainsMono_700Bold'],
      },
      fontSize: {
        'display-xl': ['40px', { lineHeight: '48px' }],
        'display-lg': ['32px', { lineHeight: '40px' }],
        title: ['22px', { lineHeight: '28px' }],
        body: ['16px', { lineHeight: '24px' }],
        caption: ['13px', { lineHeight: '18px' }],
      },
      boxShadow: {
        card: '0px 4px 16px rgba(28, 22, 18, 0.06)',
      },
    },
  },
  plugins: [
    function hauntShadow({ addUtilities }) {
      addUtilities({
        '.shadow-card': {
          shadowColor: '#1C1612',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.06,
          shadowRadius: 16,
          elevation: 4,
        },
      });
    },
  ],
};
