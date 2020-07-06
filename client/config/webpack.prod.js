const webpack = require('webpack'),
   MiniCssExtractPlugin = require('mini-css-extract-plugin'),
   CopyWebpackPlugin = require('copy-webpack-plugin'),
   merge = require('webpack-merge'),
   common = require('./webpack.config'),
   path = require('path'),
   p = (p) => path.join(__dirname, '../', p || '');

module.exports = merge(common, {
   mode: 'production',

   output: {
      path: p('dist'),
      publicPath: '/',
      filename: '[name].ltc.[contenthash].js',
      chunkFilename: '[name].ltc.[contenthash].js',
      hashDigestLength: 6,
   },

   module: {
      rules: [
         {
            test: /\.scss$/,
            loaders: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
         },
         {
            test: /\.css$/,
            loaders: [
               MiniCssExtractPlugin.loader,
               'css-loader',
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

   plugins: [
      new webpack.DefinePlugin({
         'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      new MiniCssExtractPlugin({
         filename: '[name].ltc.[contenthash].css',
         chunkFilename: '[name].ltc.[contenthash].css',
      }),
      // new CopyWebpackPlugin({
      //    patterns: [
      //       {
      //          from: p('./assets'),
      //          to: p('./dist/assets'),
      //       },
      //    ],
      // }),
   ],
});
