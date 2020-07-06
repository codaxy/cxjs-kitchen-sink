module.exports = {
   rootDir: '<rootDir>/../../app',
   transform: {
      '^.+\\.js$': '<rootDir>/../config/jest.transformer.js',
   },
   transformIgnorePatterns: [
      // Change MODULE_NAME_HERE to your module that isn't being compiled
      '<rootDir>/../node_modules/(cx).+\\.js$',
   ],
   moduleNameMapper: {
      '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
         '<rootDir>/../config/jest.image.mock.js',
      '\\.(css|scss)$': '<rootDir>/../config/jest.image.mock.js',
   },
   verbose: true,
   globals: {
      API_BASE_URL: '/api/',
   },
};
