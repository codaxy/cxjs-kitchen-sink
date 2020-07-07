# Automatic deployment to Heroku and Netlify

The Kitchen Sink application consists out of two parts - client and server. The application is meant to be easily split up and used as a template for new projects and therefore these two parts are deployed separately.

## Heroku

The server part of the application is automatically deployed to [Heroku](https://www.heroku.com/).

Heroku offers a great Node.js hosting environment with Postgres database and many other available add-ons. Heroku offers GitHub integration and in most cases the deployment is very straightforward.

However, Heroku deployment proved to be somewhat complicated since Kitchen Sink is split into two independent parts. Heroku requires that `package.json` is located in the root of the repository in order to integrate with GitHub. This is not the case here since the API part is located in the `server` sub-folder.

Fortunately, this can be resolved by using a GitHub Action (thanks to [AkhileshNS](https://github.com/AkhileshNS/heroku-deploy)) .

Check out how the action is executed (`.github/workflows/heroky.yml`).

```yml
name: Deploy

on:
  push:
    branches:
      - master

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: akhileshns/heroku-deploy@v3.0.5
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: ${{secrets.HEROKU_APP_NAME}}
          heroku_email: ${{secrets.HEROKU_EMAIL}}
          appdir: 'server'
```

This action will deploy all changes of the `master` branch. The build will run on the latest version of Ubuntu using the script from the [`heroku-deploy`](https://github.com/AkhileshNS/heroku-deploy) action. The nice feature of the action is that by setting the `appdir` configuration parameter it enables that only a part of the repository is deployed. Just what we needed.

The secret parts of the action should be configured in the Secrets section of your GitHub repository (located in the Settings tab).
The last part is setting the database connection string in Heroku Config Vars (again, located in the Settings tab).

## Netlify

Netlify is an amazing platform for hosting static websites, such as are CxJS applications. Deployment to Netlify is extremely straightforward for GitHub repositories. Since Netlify allows setting the base directory, it's enough to set up the build command and publish directory and your site will be published.

```
Base directory: client
Build command: yarn build:netlify
Publish directory: client/dist
```

However, this is not the end of the story. Check out `netlify.redirects` in the `client/app/config`.

```
/api/*  https://cxjs-kitchen-sink.herokuapp.com/api/:splat  200
/*      /index.html   200
```

The first line sets up an API rewrite rule. Since the API part is hosted on Heroku, we need to set up Netlify to proxy all `/api/*` requests to Heroku.

The second line sets up url rewrite for Single Page Applications (SPA). Since routing is performed on the client side, this will configure the webserver to serve the application for any URL it encounters. Otherwise, you'll get 404 - Not Found if you try to refresh the application outside the naked domain path.

Next, let's configure Long-Term Caching (LTC). To do that we set up `netlify.redirects`.

```
/*.ltc.*  Cache-Control: public, max-age=2630000
```

All files containing the word `.ltc.` in their name will be automatically cached for one month by the browser which drastically improves startup time for subsequent visits.

To set everything up, we need additional webpack configuration for production and Netlify builds:

JavaScript caching:

```js
output: {
    path: p('dist'),
    publicPath: '/',
    filename: '[name].ltc.[contenthash].js',
    chunkFilename: '[name].ltc.[contenthash].js',
    hashDigestLength: 6,
},
```

For CSS caching, see the plugins section:

```js
new MiniCssExtractPlugin({
    filename: '[name].ltc.[contenthash].css',
    chunkFilename: '[name].ltc.[contenthash].css',
}),
```

Lastly, additional configuration to copying Netlify related files from `config` to the `dist` folder:

```js
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
```

Netlify allows custom domains and automatically provisions HTTPS. The builds run on each commit and new version is typically deployed within a few seconds. Pure magic.
