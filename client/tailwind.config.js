module.exports = {
   purge: {
      enabled: true,
      content: ['./app/**/*.html', './app/**/*.js'],
      // These options are passed through directly to PurgeCSS
      options: {
         whitelist: [],
      },
   },
   theme: {
      extend: {
         spacing: {
            '72': '18rem',
            '80': '20rem',
            '90': '22.5rem',
            '100': '25rem',
         },
      },
   },
   plugins: [],
   variants: {
      padding: ['responsive', 'first', 'last', 'hover'],
      borderRadius: ['responsive', 'first', 'last'],
   },
};
