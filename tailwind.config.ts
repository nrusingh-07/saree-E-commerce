import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#48A9A6',
        secondary: '#8CEAE7',
        cardBg: '#F9F9F9',
      },
      screens: {
        max1450: { max: '1450px' },
        max1250: { max: '1250px' },
        max1000: { max: '1000px' },
        max850: { max: '850px' },
        max700: { max: '700px' },
        max500: { max: '500px' },
        max300: { max: '300px' },
        min1450: { min: '1450px' },
        min1250: { min: '1250px' },
        min1000: { min: '1000px' },
        min850: { min: '850px' },
        min700: { min: '700px' },
        min500: { min: '500px' },
      },
      aspectRatio: {
        '3/5': '3 / 5',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
