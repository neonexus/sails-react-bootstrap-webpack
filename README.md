# sails-react-bootstrap-webpack

This is an opinionated base [Sails v1](https://sailsjs.com) application, using Webpack to handle Bootstrap (SASS) and React.

## Main Features

+ Automatic (incoming) request logging, via Sails models / hooks.
+ Setup for Webpack auto-reload dev server.
+ Setup so Sails will serve Webpack-built bundles as separate apps (so, a marketing site, and an admin site can live side-by-side).
+ Includes [react-bootstrap](https://www.npmjs.com/package/react-bootstrap) to make using Bootstrap styles / features with React easier.
+ Schema validation and enforcement for `PRODUCTION`. This repo is setup for `MySQL`. If you plan to use a different datastore, you will want to modify [`config/bootstrap.js`](config/bootstrap.js) (not to be confused with the CSS framework, this config file is what Sails runs just before finally "lifting". See [Sails documentation](https://sailsjs.com/config/bootstrap) about the `config/bootstrap.js` file.)

## How to Use
This repo is not installable via `npm`. It should be forked to help kick-start projects.

Scripts built into [`package.json`](package.json):

| Command       | Description
|---------------|-------------------
|`npm run start`| Will run both `npm run lift` and `npm run open:client` in parallel.
|`npm run open:client` | Will run the [Webpack Dev Server](https://webpack.js.org/configuration/dev-server/) and open a browser tab / window.
|`npm run lift` | The same thing as `sails lift` or `node app.js`; will "[lift our Sails](https://sailsjs.com/documentation/reference/command-line-interface/sails-lift)" instance.
|`npm run debug` | Alias for `node --inspect app.js`.
|`npm run build` | Will run `npm run clean`, then will build production-ready files with Webpack in the `.tmp/public` folder.
|`npm run build:dev` | Same thing as `npm run build`, except that it will not optimize the files, retaining newlines and empty spaces.
|`npm run clean` | Will basically delete everything in the `.tmp` folder.
|`npm run lines` | Will count the lines of code in the project, minus `.gitignore`'d files, for funzies.

## Request Logging
Automatic incoming request logging, is a 2 part process. First, the [`request-logger` hook](api/hooks/request-logger.js) gathers info from the quest, and creates a new [`RequestLog` record](api/models/RequestLog.js), making sure to mask anything that may be sensitive, such as passwords. Then, a custom response gathers information from the response, again, scrubbing sensitive data (using the [customToJSON](https://sailsjs.com/documentation/concepts/models-and-orm/model-settings?identity=#customtojson) feature of Sails models) to prevent leaking of password hashes, or anything else that should never be publicly accessible. The [`keepModelsSafe` helper](api/helpers/keep-models-safe.js) and the custom responses (such as [ok](api/responses/ok.js) or [serverError](api/responses/serverError.js)) are responsible for the final leg of request logs.

## Using Webpack
#### Local Dev
The script `npm run open:client` will start the auto-reloading Webpack development server, and open a browser window.

#### Remote Builds
The script `npm run build` will make Webpack build all the proper assets into the `.tmp/public` folder. Sails will serve assets from this folder.

If you want to build assets, but retain spaces / tabs for debugging, you can use `npm run build:dev`.

#### Configuration
The webpack configuration can be found in the `config/webpack` folder. The majority of the configuration can be found in [`common.config.js`](config/webpack/common.config.js). Then, the other 3 files, such as [`dev.config.js`](config/webpack/dev.config.js) extend the `common.config.js` file.

## Building with React
React source files live in the `assets/src` folder. It is structured in such a way, where the `index.jsx` is really only used for local development (to help Webpack serve up the correct "app"). Then, there are the individual "apps", [main](assets/src/main.jsx) and [admin](assets/src/admin.jsx). These files are used as Webpack "[entry points](https://webpack.js.org/concepts/entry-points/)", to create 2 separate application bundles.

In a remote environment, Sails will look at the first subdirectory requested, and use that to determine which `index.html` file it needs to actually return. So, in this case, the "main" application will get built in `.tmp/public/main`, where the CSS is `.tmp/public/main/bundle.css`, the JavaScript is `.tmp/public/main/bundle.js`, and the HTML is `.tmp/public/main/index.html`. To view the main application, one would just go to `http://mydomain/` which gets redirected to `/main` (because we need to know what application we are using, we need a subdirectory), and now Sails will serve the `main` application. Whereas, if one were to go to `http://mydomain/admin`, Sails would now serve the `admin` application bundle (aka `.tmp/public/admin/index.html`).

## Schema Validation and Enforcement
Inside [`config/bootstrap.js`](config/bootstrap.js) is a bit of logic (**HEAVILY ROOTED IN NATIVE `MySQL` QUERIES**), which validates column types in the `PRODUCTION` database (aka `sails.config.models.migrate === 'safe'`), then will validate foreign key indexes. If there are too many columns, or there is a missing index, or incorrect column type, the logic will `console.error` any issues, then `process.exit(1)` (kill) the Sails server. The idea here, is that if anything is out of alignment, Sails will fail to lift, which will mean failure to deploy on AWS.

### If you do not want schema validation
... then replace the contents of `config/bootstrap.js` with the following:

```javascript
module.exports.bootstrap = function(next) {
    // You must call the callback function, or Sails will fail to lift!
    next();
};
```

### Useful Links

+ [Sails Framework Documentation](https://sailsjs.com/get-started)
+ [Sails Deployment Tips](https://sailsjs.com/documentation/concepts/deployment)
+ [Sails Community Support Options](https://sailsjs.com/support)
+ [Sails Professional / Enterprise Options](https://sailsjs.com/enterprise)
+ [`react-bootstrap` Documentation](https://react-bootstrap.netlify.app/)
+ [Webpack Documentation](https://webpack.js.org/)


### Version info

This app was originally generated on Fri Mar 20 2020 17:39:04 GMT-0500 (Central Daylight Time) using Sails v1.2.3.

<!-- Internally, Sails used [`sails-generate@1.16.13`](https://github.com/balderdashy/sails-generate/tree/v1.16.13/lib/core-generators/new). -->



<!--
Note:  Generators are usually run using the globally-installed `sails` CLI (command-line interface).  This CLI version is _environment-specific_ rather than app-specific, thus over time, as a project's dependencies are upgraded or the project is worked on by different developers on different computers using different versions of Node.js, the Sails dependency in its package.json file may differ from the globally-installed Sails CLI release it was originally generated with.  (Be sure to always check out the relevant [upgrading guides](https://sailsjs.com/upgrading) before upgrading the version of Sails used by your app.  If you're stuck, [get help here](https://sailsjs.com/support).)
-->

