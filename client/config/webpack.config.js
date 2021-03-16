const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const getBabelConfig = require("./babel.config");
const p = p => path.join(__dirname, "../", p) || "";
const { merge } = require('webpack-merge');


module.exports = {
   resolve: {
      alias: {
         app: p("app")
      }
   },
   module: {
      rules: [
         {
            test: /\.js$/,
            include: /[\\\/](app|cx|cx-react|cx-theme-\w*)[\\\/]/,
            use: {
               loader: "babel-loader",
               options: merge(getBabelConfig({ modules: false }), { cacheDirectory: true, cacheIdentifier: "v1" })
            }
         },
         {
            test: /\.(png|jpg)/,
            use: "file-loader"
         }
      ]
   },
   entry: {
      vendor: ["cx-react", p("app/polyfill.js")],
      app: [p("app/index.js")]
   },
   plugins: [new HtmlWebpackPlugin({ template: p("app/index.html") })],
   optimization: { runtimeChunk: 'single' },
   cache: {
      type: 'filesystem',
      buildDependencies: {
         config: [
            __filename,
            p('config/webpack.config.js'),
            p('config/webpack.dev.js'),
            p('config/webpack.prod.js'),
            p('config/babel-config.js')
         ]
      }
   }
};