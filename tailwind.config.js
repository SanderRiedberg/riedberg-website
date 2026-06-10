export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        mist:     '#ECF1F4',
        horizon:  '#C9D8DE',
        seaglass: '#6FA29A',
        granite:  '#4A555E',
        ink:      '#1F262B',
        sun:      '#E0A458',
        foam:     '#FDFEFE',
        abyss:    '#07131A',
        deep:     '#0C2230',
        current:  '#14394C',
        biolume:  '#5FD3BC',
        moon:     '#BFD6DD',
      },
      fontFamily: {
        serif: ['"Fraunces Variable"', 'Georgia', 'serif'],
        mono: ['ui-monospace', '"SF Mono"', 'SFMono-Regular', 'Menlo', '"Cascadia Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
