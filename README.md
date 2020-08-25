# sails-react-bootstrap-webpack

This is an opinionated base [Sails v1](https://sailsjs.com) application, using Webpack to handle Bootstrap (SASS) and React builds. It is designed such that, one can build multiple React frontends (an admin panel, and a customer site maybe), that use the same API backend. This allows developers to easily share React components across different frontends / applications. Also, because the backend and frontend are in the same repo (and the frontend is compiled before it is handed to the end user), they can share NPM libraries, like [Moment.js](https://momentjs.com)

Need help? Want to hire me to build your next app or prototype? You can contact me any time via Gitter: [![Join the chat at https://gitter.im/sails-react-bootstrap-webpack/community](https://badges.gitter.im/sails-react-bootstrap-webpack/community.svg)](https://gitter.im/sails-react-bootstrap-webpack/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# Branch Warning
The `master` branch is experimental, and the [release branch](https://github.com/neonexus/sails-react-bootstrap-webpack/tree/release) (or the [`releases section`](https://github.com/neonexus/sails-react-bootstrap-webpack/releases)) is where one should base their use of this template.

`master` is **volatile**, likely to change at any time, for any reason; this includes `git push --force` updates.

**FINAL WARNING: DO NOT RELY ON THE MASTER BRANCH!**

## Main Features

+ Automatic (incoming) request logging, via Sails models / hooks.
+ Setup for Webpack auto-reload dev server.
+ Setup so Sails will serve Webpack-built bundles as separate apps (so, a marketing site, and an admin site can live side-by-side).
+ Includes [react-bootstrap](https://www.npmjs.com/package/react-bootstrap) to make using Bootstrap styles / features with React easier.
+ Schema validation and enforcement for `PRODUCTION`. This repo is setup for `MySQL`. If you plan to use a different datastore, you will likely want to disable the schema validation and enforcement feature inside [`config/bootstrap.js`](config/bootstrap.js). See [schema validation and enforcement](#schema-validation-and-enforcement) for more info.

## How to Use
This repo is not installable via `npm`. Instead, Github provides a handy "Use this template" (green) button at the top of this page. That will create a special fork of this repo (so there is a single, init commit, instead of the commit history from this repo).

### Configuration
In the `config` folder, there is `local.js.sample` file, which is meant to be copied to `local.js`. This file is ignored by Git, and intended for use in local development, not remote servers.

#### Want to configure the "X-Powered-By" header?
Sails, by default, has middleware (akin to [Express.js Middleware](https://expressjs.com/en/guide/using-middleware.html), Sails is built on Express.js after all...). Inside of [`config/http.js`](config/http.js) we disable the default middleware, and create our own `X-Powered-By` header, using Express.js Middleware.

### Scripts built into [`package.json`](package.json):

| Command       | Description
|---------------|-------------------
|npm run start  | Will run both `npm run lift` and `npm run open:client` in parallel.
|npm&nbsp;run&nbsp;open:client | Will run the [Webpack Dev Server](https://webpack.js.org/configuration/dev-server/) and open a browser tab / window.
|npm run lift   | The same thing as `sails lift` or `node app.js`; will "[lift our Sails](https://sailsjs.com/documentation/reference/command-line-interface/sails-lift)" instance.
|npm run debug  | Alias for `node --inspect app.js`.
|npm run build  | Will run `npm run clean`, then will build production-ready files with Webpack in the `.tmp/public` folder.
|npm run build:dev | Same thing as `npm run build`, except that it will not optimize the files, retaining newlines and empty spaces.
|npm run clean  | Will basically delete everything in the `.tmp` folder.
|npm run lines  | Will count the lines of code in the project, minus `.gitignore`'d files, for funzies. There are currently about 6k custom lines in this repo (views, controllers, helpers, hooks, etc).
|npm run test   | Run [Mocha](https://mochajs.org/) tests. Everything starts in the [`test/hooks.js`](test/hooks.js) file.
|npm run coverage | Runs [NYC](https://www.npmjs.com/package/nyc) coverage reporting of the Mocha tests, which generates HTML in `test/coverage`.

### Environment Variables used for remote servers:
| Variable              | DEV default       | PROD default      | Description
|-----------------------|-------------------|-------------------|----------------------
| ASSETS_URL            | "" (empty string) | "" (empty string) | Webpack is configured to modify static asset URLs to point to a CDN, like CloudFront. MUST end with a slash " / ", or be empty.
| BASE_URL              | https://myapi.app | https://myapi.app | The address of the Sails instance.
| DB_HOST               | localhost         | localhost         | The hostname of the datastore.
| DB_USER               | root              | produser          | Username for the datastore.
| DB_PASS               | mypass            | myprodpassword    | Password for the datastore.
| DB_NAME               | myapp             | proddatabase      | The name of the database inside the datastore.
| DB_PORT               | 3306              | 3306              | The port number for datastore.
| DB_SSL                | false             | false             | If the datastore requires SSL, set this to "true".
| SESSION_SECRET        | "" (empty string) | "" (empty string) | This is used to sign cookies, and SHOULD be set, especially on PRODUCTION environments.
| DATA_ENCRYPTION_KEY   | "" (empty string) | "" (empty string) | **Currently unused; intended for future use.**

## Request Logging
Automatic incoming request logging, is a 2 part process. First, the [`request-logger` hook](api/hooks/request-logger.js) gathers info from the request, and creates a new [`RequestLog` record](api/models/RequestLog.js), making sure to mask anything that may be sensitive, such as passwords. Then, a custom response gathers information from the response, again, scrubbing sensitive data (using the [customToJSON](https://sailsjs.com/documentation/concepts/models-and-orm/model-settings?identity=#customtojson) feature of Sails models) to prevent leaking of password hashes, or anything else that should never be publicly accessible. The [`keepModelsSafe` helper](api/helpers/keep-models-safe.js) and the custom responses (such as [ok](api/responses/ok.js) or [serverError](api/responses/serverError.js)) are responsible for the final leg of request logs.

## Using Webpack
#### Local Dev
The script `npm run open:client` will start the auto-reloading Webpack development server, and open a browser window.

#### Remote Builds
The script `npm run build` will make Webpack build all the proper assets into the `.tmp/public` folder. Sails will serve assets from this folder.

If you want to build assets, but retain spaces / tabs for debugging, you can use `npm run build:dev`.

#### Configuration
The webpack configuration can be found in the `webpack` folder. The majority of the configuration can be found in [`common.config.js`](webpack/common.config.js). Then, the other 3 files, such as [`dev.config.js`](webpack/dev.config.js) extend the `common.config.js` file.

## Building with React
React source files live in the `assets/src` folder. It is structured in such a way, where the `index.jsx` is really only used for local development (to help Webpack serve up the correct "app"). Then, there are the individual "apps", [main](assets/src/main.jsx) and [admin](assets/src/admin.jsx). These files are used as Webpack "[entry points](https://webpack.js.org/concepts/entry-points/)", to create 2 separate application bundles.

In a remote environment, Sails will look at the first subdirectory requested, and use that to determine which `index.html` file it needs to actually return. So, in this case, the "main" application will get built in `.tmp/public/main`, where the CSS is `.tmp/public/main/bundle.css`, the JavaScript is `.tmp/public/main/bundle.js`, and the HTML is `.tmp/public/main/index.html`. To view the main application, one would just go to `http://mydomain/` which gets redirected to `/main` (because we need to know what application we are using, we need a subdirectory), and now Sails will serve the `main` application. Whereas, if one were to go to `http://mydomain/admin`, Sails would now serve the `admin` application bundle (aka `.tmp/public/admin/index.html`).

## Schema Validation and Enforcement
Inside [`config/bootstrap.js`](config/bootstrap.js) is a bit of logic (**HEAVILY ROOTED IN NATIVE `MySQL` QUERIES**), which validates column types in the `PRODUCTION` database (aka `sails.config.models.migrate === 'safe'`), then will validate foreign key indexes. If there are too many columns, or there is a missing index, or incorrect column type, the logic will `console.error` any issues, then `process.exit(1)` (kill) the Sails server. The idea here, is that if anything is out of alignment, Sails will fail to lift, which will mean failure to deploy on AWS.

### If you do not want schema validation
... then you have 2 options:
 * Set `sails.config.models.validateOnBootstrap = false` at the bottom of [`config/models.js`](config/models.js).
 * OR replace the contents of `config/bootstrap.js` with the following:

```javascript
module.exports.bootstrap = function(next) {
    // You must call the callback function, or Sails will fail to lift!
    next();
};
```

## What about SEO?
I recommend looking at [prerender.io](https://prerender.io). They offer a service (free up to 250 pages) that caches the end result of a JavaScript-rendered view (React, Vue, Angular), allowing search engines to crawl otherwise un-crawlable web views. You can use the service in a number of ways. One way, is to use the [prerender-node](https://www.npmjs.com/package/prerender-node) package. To use it with Sails, you'll have to add it to the [HTTP Middleware](https://sailsjs.com/documentation/concepts/middleware#?http-middleware). Here's a quick example:

```javascript
middleware: {

    order: [
        'cookieParser',
        'session',
        'bodyParser',
        'prerender', // reference our custom middleware found below
        'compress',
        'router',
        'assetLog',
        'www',
        'favicon'
    ],

    prerender: require('prerender-node').set('prerenderToken', 'YOUR_TOKEN')

}
```

### Useful Links

+ [Sails Framework Documentation](https://sailsjs.com/get-started)
+ [Sails Deployment Tips](https://sailsjs.com/documentation/concepts/deployment)
+ [Sails Community Support Options](https://sailsjs.com/support)
+ [Sails Professional / Enterprise Options](https://sailsjs.com/enterprise)
+ [`react-bootstrap` Documentation](https://react-bootstrap.netlify.app/)
+ [Webpack Documentation](https://webpack.js.org/)
+ [Simple data fixtures for testing Sails.js (the npm package `fixted`)](https://www.npmjs.com/package/fixted)


### Version info

This app was originally generated on Fri Mar 20 2020 17:39:04 GMT-0500 (Central Daylight Time) using Sails v1.2.3.

<!-- Internally, Sails used [`sails-generate@1.16.13`](https://github.com/balderdashy/sails-generate/tree/v1.16.13/lib/core-generators/new). -->



<!--
Note:  Generators are usually run using the globally-installed `sails` CLI (command-line interface).  This CLI version is _environment-specific_ rather than app-specific, thus over time, as a project's dependencies are upgraded or the project is worked on by different developers on different computers using different versions of Node.js, the Sails dependency in its package.json file may differ from the globally-installed Sails CLI release it was originally generated with.  (Be sure to always check out the relevant [upgrading guides](https://sailsjs.com/upgrading) before upgrading the version of Sails used by your app.  If you're stuck, [get help here](https://sailsjs.com/support).)
-->

