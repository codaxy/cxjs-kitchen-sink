let getBabelConfig = require('./babel.config');

module.exports = require('babel-jest').createTransformer(
   getBabelConfig({
      modules: 'auto',
   })
);
