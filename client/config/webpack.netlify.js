const CopyWebpackPlugin = require('copy-webpack-plugin'),
   merge = require('webpack-merge'),
   prod = require('./webpack.prod'),
   path = require('path');

module.exports = merge(prod, {
   plugins: [
      new CopyWebpackPlugin({
         patterns: [
            {
               from: path.resolve(__dirname, './netlify.redirects'),
               to: '_redirects',
               toType: 'file',
            },
            {
               from: path.resolve(__dirname, './netlify.headers'),
               to: '_headers',
               toType: 'file',
            },
         ],
      }),
   ],
});
