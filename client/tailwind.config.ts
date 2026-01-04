import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#A50034',
        'primary-dark': '#8B002C',
        'primary-light': '#FCE7EA',
      },
    },
  },
  plugins: [],
}
export default config
