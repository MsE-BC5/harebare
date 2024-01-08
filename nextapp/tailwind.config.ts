import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors:{
        brown: {
          50: '#f5efe6', 
          100: '#e6d5c5',
          200: '#d1b8a2',
          300: '#b9987e',
          400: '#9f7759',
          500: '#855d3b', // 通常のbrownカラー
          600: '#6a482e',
          700: '#523620',
          800: '#392513',
          900: '#211506',
        },
      },
      
      backgroundColor: {
        'overlay': 'rgba(255, 255, 255, 0.5)', // 50%の透明度
      },
      fontFamily:{
        body: [
          'Arial',
        ],
        fancy: ["Dancing Script"],
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