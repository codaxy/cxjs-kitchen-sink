const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { merge } = require("webpack-merge");
const common = require("./webpack.config");
const path = require("path");
p = p => path.join(__dirname, "../", p || "");
const tailwindcss = require('tailwindcss')


module.exports = merge(common, {
   mode: 'production',
   target: ['web', 'es5'],

   output: {
      path: p("dist"),
      publicPath: "/",
      filename: "[name].ltc.[contenthash].js",
      chunkFilename: "[name].ltc.[contenthash].js",
      hashDigestLength: 6
   },

   module: {
      rules: [
         {
            test: /\.scss$/,
            use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
         },
         {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, "css-loader",
            {
               loader: 'postcss-loader', // postcss loader needed for tailwindcss
               options: {
                  postcssOptions: {
                     ident: 'postcss',
                     plugins: [tailwindcss],
                  },
               },
            },]
         }
      ]
   },

   plugins: [
      new webpack.DefinePlugin({
         "process.env.NODE_ENV": JSON.stringify("production")
      }),
      new MiniCssExtractPlugin({
         filename: "[name].ltc.[contenthash].css",
         chunkFilename: "[name].ltc.[contenthash].css"
      })
   ]
});
