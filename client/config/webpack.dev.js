const webpack = require('webpack'),
   merge = require('webpack-merge'),
   common = require('./webpack.config');

module.exports = merge(common, {
   mode: 'development',

   module: {
      rules: [
         {
            test: /\.scss$/,
            loaders: ['style-loader', 'css-loader', 'sass-loader'],
         },
         {
            test: /\.css$/,
            loaders: [
               'style-loader',
               {
                  loader: 'postcss-loader',
                  options: {
                     ident: 'postcss',
                     plugins: [require('tailwindcss')],
                  },
               },
            ],
         },
      ],
   },

   plugins: [new webpack.HotModuleReplacementPlugin()],

   output: {
      publicPath: 'http://localhost:8765/',
   },

   devtool: 'eval',

   devServer: {
      hot: true,
      port: 8765,
      noInfo: false,
      inline: true,
      historyApiFallback: true,
      proxy: {
         '/api': 'http://localhost:3000',
      },
   },
});
