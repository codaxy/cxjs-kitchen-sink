const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.config');
const tailwindcss = require('tailwindcss')

module.exports = merge(common, {
   mode: 'development',

   module: {
      rules: [
         {
            test: /\.scss$/,
            use: ["style-loader", "css-loader", "sass-loader"]
         },
         {
            test: /\.css$/,
            use: ["style-loader", "css-loader",
               {
                  loader: 'postcss-loader', // postcss loader needed for tailwindcss
                  options: {
                     postcssOptions: {
                        ident: 'postcss',
                        plugins: [tailwindcss],
                     },
                  },
               },],
         }
      ]
   },

   plugins: [],

   output: {
      publicPath: '/',
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
