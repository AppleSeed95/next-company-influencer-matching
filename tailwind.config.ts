import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontSize:{
        title:'22px',
        header:'20px',
        small:'12px',
        sp:'11px',
        spsmall:'10px',
        sptitle:'15px'
      },
      screens: {
        sp: {
          max: "768px",
        },
        lg: {
          min: "769px",
        },
      },
    },
  },
  plugins: [],
}
export default config
