# sails-react-bootstrap-webpack

[![Travis CI status](https://img.shields.io/travis/com/neonexus/sails-react-bootstrap-webpack.svg?branch=release&logo=travis)](https://app.travis-ci.com/github/neonexus/sails-react-bootstrap-webpack)
[![Sails version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fneonexus%2Fsails-react-bootstrap-webpack%2Fv4.2.2%2Fpackage.json&query=%24.dependencies.sails&label=Sails&logo=sailsdotjs)](https://sailsjs.com)
[![React version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fneonexus%2Fsails-react-bootstrap-webpack%2Fv4.2.2%2Fpackage.json&query=%24.devDependencies.react&label=React&logo=react)](https://react.dev)
[![Bootstrap version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fneonexus%2Fsails-react-bootstrap-webpack%2Fv4.2.2%2Fpackage.json&query=%24.devDependencies.bootstrap&label=Bootstrap&logo=bootstrap)](https://getbootstrap.com)
[![Webpack version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fneonexus%2Fsails-react-bootstrap-webpack%2Fv4.2.2%2Fpackage.json&query=%24.devDependencies.webpack&label=Webpack&logo=webpack)](https://webpack.js.org)

[![Gitter Room](https://img.shields.io/badge/Chat-on_Gitter-blue?logo=gitter)](https://app.gitter.im/#/room/#sails-react-bootstrap-webpack:gitter.im)

This is an opinionated, base [Sails v1](https://sailsjs.com) application, using [Webpack](https://webpack.js.org) to handle [Bootstrap](https://getbootstrap.com) (using [SASS](https://sass-lang.com))
and [React](https://react.dev) builds. It is designed such that, one can build multiple React frontends (an admin panel, and a customer site maybe), that use the same API backend. This allows
developers to easily share React components across different frontends / applications. Also, because the backend and frontend are in the same repo (and the frontend is compiled before it is handed to
the end user), they can share [NPM](http://npmjs.com) libraries, like [Moment.js](https://momentjs.com)

## Table of Contents
* [Main Features](#main-features)
* [Branch Warning](#branch-warning)
* [Current Dependencies](#current-dependencies)
  * [A note about dependency versions](#a-note-about-dependency-versions)
* [How to Use](#how-to-use)
* [Configuration](#configuration)
    * [Custom Configuration Options](#custom-configuration-options)
    * [Want to configure the `X-Powered-By` header?](#want-to-configure-the-x-powered-by-header)
* [Environment Variables](#environment-variables)
* [Custom Security Policies](#custom-security-policies)
* [Scripts Built Into `package.json`](#scripts-built-into-packagejson)
* [Sails Scripts](#sails-scripts)
* [Request Logging](#request-logging)
  * [If you DO NOT want request logging](#if-you-do-not-want-request-logging)
* [Using Webpack](#using-webpack)
    * [Local Dev](#local-dev)
    * [Remote Builds](#remote-builds)
    * [Configuration](#configuration-1)
* [Building with React](#building-with-react)
    * [Serving Compiled Assets](#serving-compiled-assets)
* [Schema Validation and Enforcement](#schema-validation-and-enforcement)
    * [If you DO NOT want schema validation](#if-you-do-not-want-schema-validation)
* [PwnedPasswords.com Integration](#pwnedpasswordscom-integration)
* [Working With Ngrok](#working-with-ngrok)
    * [First Thing's First](#first-things-first)
    * [Script Options](#script-options)
* [Support for `sails-hook-autoreload`](#support-for-sails-hook-autoreload)
* [What About SEO?](#what-about-seo)
* [Useful Links](#useful-links)

## Main Features

* Online in a single command, thanks to included [Ngrok support](#working-with-ngrok).
* Automatic (incoming) request logging (manual outgoing), via Sails models / hooks.
* Setup for Webpack auto-reload dev server.
* Setup so Sails will serve Webpack-built bundles as separate apps (so, a marketing site, and an admin site can live side-by-side).
* More than a few custom [helper functions](api/helpers) to make life a little easier.
* Includes [react-bootstrap](https://www.npmjs.com/package/react-bootstrap) to make using Bootstrap styles / features with React easier.
* Schema validation and enforcement for `PRODUCTION`. This repo is set up for `MySQL` (can LIKELY be used with most if not all other SQL-based datastores [I have not tried]). If you plan to use a
  different datastore, you will likely want to disable the schema validation and enforcement
  feature inside [`config/bootstrap.js`](config/bootstrap.js). See [schema validation and enforcement](#schema-validation-and-enforcement) for more info.
* New passwords will be checked against the [PwnedPasswords API](https://haveibeenpwned.com/API/v3#PwnedPasswords). If there is a single hit for the password, an error will be given, and the user will
  be forced to choose another. See [PwnedPasswords integration](#pwnedpasswordscom-integration) for more info.
* Google Authenticator-style OTP (One-Time Password) functionality; also known as 2FA (2-Factor Authentication).

## Branch Warning

The `master` branch is experimental, and the [release branch](https://github.com/neonexus/sails-react-bootstrap-webpack/tree/release) (or
the [`releases section`](https://github.com/neonexus/sails-react-bootstrap-webpack/releases)) is where one should base their use of this template.

`master` is **volatile**, likely to change at any time, for any reason; this includes `git push --force` updates.

**FINAL WARNING: DO NOT RELY ON THE MASTER BRANCH!**

## Current Dependencies

* [Sails](https://sailsjs.com) **v1**
* [React](https://react.dev) **v18**
* [React Router](https://reactrouter.com) **v6**
* [Bootstrap](https://getbootstrap.com) **v5**
* [React-Bootstrap](https://react-bootstrap.github.io) **v2**
* [Webpack](https://webpack.js.org) **v5**

See the [`package.json`](package.json) for full details.

### A note about dependency versions

All dependencies in `package.json` are "version locked". This means that explicit version numbers are used ONLY, no fuzzy matches like `^` or `*`. The reason for this is the rampant uptick in package
poisoning. Once a version has been created on NPM, it can't be updated or recreated, only deleted. Plus, it's nice to see when dependency versions change in Git commits.

I manually check the changes when a package has a new version, to verify there isn't any sneaky bits trying to compromise something. I use
[`npm-check-updates`](https://www.npmjs.com/package/npm-check-updates), and just run `ncu` when I want to check dependencies.

## How to Use

This repo is not installable via `npm`. Instead, GitHub provides a handy "Use this template" (green) button at the top of this page. That will create a special clone of this repo (so there is a single,
init commit, instead of the commit history from this repo).

Or, you can download a copy of the [latest release](https://github.com/neonexus/sails-react-bootstrap-webpack/releases/latest).

## Configuration

In the `config` folder, there is the [`local.js.sample`](config/local.js.sample) file, which is meant to be copied to `local.js`. This file (`local.js`, not the sample) is ignored by Git, and intended
for use in local development, NOT remote servers. Generally one would use environment variables for remote server configuration (and this repo is already setup to handle environment variable
configuration for both DEV and PROD). See [Environment Variables](#environment-variables) for more.

### Custom Configuration Options

These options are **NOT** part of the [Sails Configuration Options](https://sailsjs.com/documentation/reference/configuration), but are ones built for this custom repo. All of these options can be
overridden in the `config/local.js`, just like every other option. If the option path is `sails.config.security.checkPwnedPasswords`, then you would add:

```javascript
{
    security: {
        checkPwnedPasswords: false
    }
}
```

... to your `config/local.js` to override any option on your local machine only.

<!-- The below comment is to prevent Webstorm from trying to find directories that don't exist. -->
<!--suppress ALL -->
<table>
    <thead>
        <tr>
            <th>Option Name (<code>sails.config.</code>)</th>
            <th>Found In (<code>config/</code>)</th>
            <th>Default</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>appName</code></td>
            <td>
                <code>local.js</code><br />
                <a href="/neonexus/sails-react-bootstrap-webpack/blob/release/config/env/development.js"><code>env/development.js</code></a><br />
                <a href="/neonexus/sails-react-bootstrap-webpack/blob/release/config/env/production.js"><code>env/production.js</code></a><br />
            </td>
            <td>
                <code>My&nbsp;App&nbsp;(LOCAL)</code><br />
                <code>My App (DEV)</code><br />
                <code>My App</code>
            </td>
            <td>
                The general name to use for this app.
            </td>
        </tr>
        <tr>
            <td><code>log.captureRequests</code></td>
            <td><a href="/neonexus/sails-react-bootstrap-webpack/blob/release/config/log.js"><code>log.js</code></a></td>
            <td><code>true</code></td>
            <td>
                When enabled, all incoming requests will automatically be logged via the <a href="/neonexus/sails-react-bootstrap-webpack/blob/release/api/models/RequestLog.js"><code>RequestLog</code></a> model, by the <a href="/neonexus/sails-react-bootstrap-webpack/blob/release/api/hooks/request-logger.js"><code>request-logger</code></a> hook, and the <a href="/neonexus/sails-react-bootstrap-webpack/blob/release/api/helpers/finalize-request-log.js"><code>finalize-request-log</code></a> helper.
                <br /><br />See <a href="#request-logging">Request Logging</a> for more info.
            </td>
        </tr>
        <tr>
            <td><code>models.validateOnBootstrap</code></td>
            <td><a href="/neonexus/sails-react-bootstrap-webpack/blob/release/config/bootstrap.js"><code>bootstrap.js</code></a></td>
            <td><code>true</code></td>
            <td>When enabled, and <code>models.migrate === 'safe'</code> (aka PRODUCTION), then the SQL schemas of the default datastore will be validated against the model definitions. <br><br>See <a href="#schema-validation-and-enforcement">schema validation and enforcement</a> for more info.</td>
        </tr>
        <tr>
            <td><code>security.checkPwnedPasswords</code></td>
            <td><a href="/neonexus/sails-react-bootstrap-webpack/blob/release/config/security.js"><code>security.js</code></a></td>
            <td><code>true</code></td>
            <td>When enabled, <a href="/neonexus/sails-react-bootstrap-webpack/blob/release/api/helpers/is-password-valid.js"><code>sails.helpers.isPasswordValid()</code></a> will run its normal checks, before checking with the PwnedPasswords.com API to verify the password has not been found in a known security breach. If it has, it will consider the password invalid.</td>
        </tr>
        <tr>
            <td>
                <code>security</code><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code>.requestLogger</code><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code>.logSensitiveData</code>
            </td>
            <td><a href="/neonexus/sails-react-bootstrap-webpack/blob/release/config/security.js"><code>security.js</code></a> <br> <a href="/neonexus/sails-react-bootstrap-webpack/blob/release/config/env/development.js"><code>env/development.js</code></a></td>
            <td><code>false</code></td>
            <td>If enabled, and NOT a PRODUCTION environment, the <a href="#request-logging">request logger</a> will log sensitive info, such as passwords. <br><br> This will ALWAYS be false on PRODUCTION. It is in the PRODUCTION configuration file only as a reminder.</td>
        </tr>
    </tbody>
</table>

### Want to configure the `X-Powered-By` header?

Sails.js has middleware (akin to [Express.js Middleware](https://expressjs.com/en/guide/using-middleware.html), Sails is built on Express.js after all...). Inside
of [`config/http.js`](config/http.js) we create our own `X-Powered-By` header, using Express.js Middleware.

## Environment Variables

There are a few environment variables that the remote configuration files are set up for. There are currently 3 variables that change names between DEV and PROD; this is intentional, and has proven
very useful in my experience. DEV has shorter names like `DB_HOST`, where PROD has fuller names like `DB_HOSTNAME`. This helps with ensuring you are configuring the correct remote server, and has
prevented accidental DEV deployments to PROD.

If you DO NOT like this behavior, and would prefer the variables stay the same across your environments, feel free to change them in [`config/env/development.js`](config/env/development.js)
and [`config/env/production.js`](config/env/production.js)

| Variable                                             | Default                                   | Description                                                                                                                     |
|------------------------------------------------------|-------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `ASSETS_URL`                                         | "" (empty string)                         | Webpack is configured to modify static asset URLs to point to a CDN, like CloudFront. MUST end with a slash " / ", or be empty. |
| `BASE_URL`                                           | https://myapi.app                         | The address of the Sails instance.                                                                                              |
| **DEV:** `DB_HOST`<br />**PROD:**&nbsp;`DB_HOSTNAME` | localhost                                 | The hostname of the datastore.                                                                                                  |
| **DEV:** `DB_USER`<br />**PROD:** `DB_USERNAME`      | **DEV:** root <br /> **PROD:** produser   | Username of the datastore.                                                                                                      |
| **DEV:** `DB_PASS`<br />**PROD:** `DB_PASSWORD`      | **DEV:** mypass <br /> **PROD:** prodpass | Password of the datastore.                                                                                                      |
| `DB_NAME`                                            | **DEV:** myapp <br /> **PROD:** prod      | The name of the database inside the datastore.                                                                                  |
| `DB_PORT`                                            | 3306                                      | The port number for the datastore.                                                                                              |
| `DB_SSL`                                             | true                                      | If the datastore requires SSL, set this to "true".                                                                              |
| `SESSION_SECRET`                                     | "" (empty string)                         | Used to sign cookies, and SHOULD be set, especially on PRODUCTION environments.                                                 |
| `NGROK_TOKEN`                                        | "" (empty string)                         | Ngrok auth token used in the [`ngrok.js`](#working-with-ngrok) script.                                                          |

[//]: # (| DATA_ENCRYPTION_KEY | "" &#40;empty string&#41; | **DATA_ENCRYPTION_KEY** | **"" &#40;empty string&#41;** | **Currently unused; intended for future use.**                                                                                  |)

## Custom Security Policies

Security policies that are responsible for protecting API endpoints live in the [api/policies](api/policies) folder, and are configured in the [config/policies.js](config/policies.js) file.

The most important policy, in terms of this repo, is the [`is-logged-in`](api/policies/isLoggedIn.js) policy. It determines if the request is being made from a valid session, and if so, passes the session data down to controllers (and other policies). Past that, there is currently only a second policy: [`is-admin`](api/policies/isAdmin.js). It uses the session data from `is-logged-in` to determine if the user is an admin; if they aren't, the request is rejected.

Read more about Sails' security policies: [https://sailsjs.com/documentation/concepts/policies](https://sailsjs.com/documentation/concepts/policies)

## Scripts built into [`package.json`](package.json):

Here, `sails run ...` is nearly the same as `npm run ...`, except that `sails run` tends to be quieter/cleaner (try `npm run generate:dek` vs `sails run generate:dek`), and will spin up a quick
instance of Sails, so one can build terminal scripts that deal with Sails' architecture (like `sails run create-admin`). So, I've opted to use `sails run` as my go-to for running scripts.

This does require you either have Sails installed globally, or you have `node_modules/.bin` of this project added to your `$PATH`.

<table>
    <thead>
        <tr>
            <th>Command</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><pre><code>sails run build</code></pre></td>
            <td>Will run <code>sails run clean</code>, then <code>sails run build:prod</code>.</td>
        </tr>
        <tr>
            <td><pre><code>sails run build:dev</code></pre></td>
            <td>Will run <code>sails run clean</code>, then <code>sails run build:dev:webpack</code>.</td>
        </tr>
        <tr>
            <td><pre><code>sails run build:dev:webpack</code></pre></td>
            <td>Same thing as <code>sails run build:prod</code>, except that it will not optimize the files, retaining newlines and empty spaces.</td>
        </tr>
        <tr>
            <td><pre><code>sails run build:prod</code></pre></td>
            <td>Runs Webpack to build production-level assets into <code>.tmp/public</code>.</td>
        </tr>
        <tr>
            <td><pre><code>sails run clean</code></pre></td>
            <td>Will delete everything in the <code>.tmp</code> folder.</td>
        </tr>
        <tr>
            <td><pre><code>sails run coverage</code></pre></td>
            <td>Runs <a rel="nofollow" href="https://www.npmjs.com/package/nyc">NYC</a> coverage reporting of the Mocha tests, which generates HTML in <code>test/coverage</code>.</td>
        </tr>
        <tr>
            <td><pre><code>sails run create:admin</code></pre></td>
            <td>An alias for the Sails script <code>sails run create-admin</code>. See <a href="#sails-scripts">Sails Scripts</a> for more info.</td>
        </tr>
        <tr>
            <td><pre><code>sails run debug</code></pre></td>
            <td>Alias for <code>node --inspect app.js</code>.</td>
        </tr>
        <tr>
            <td><pre><code>sails run generate:dek</code></pre></td>
            <td>Generate a DEK (Data Encryption Key).</td>
        </tr>
        <tr>
            <td><pre><code>sails run generate:token</code></pre></td>
            <td>Generate a 64-character token.</td>
        </tr>
        <tr>
            <td><pre><code>sails run generate:uuid</code></pre></td>
            <td>Generate a v4 UUID.</td>
        </tr>
        <tr>
            <td><pre><code>sails run lift</code></pre></td>
            <td>The same thing as <code>sails lift</code> or <code>node app.js</code>; will
                "<a rel="nofollow" href="https://sailsjs.com/documentation/reference/command-line-interface/sails-lift">lift our Sails</a>" instance (aka starting the API).
            </td>
        </tr>
        <tr>
            <td><pre><code>sails run lift:prod</code></pre></td>
            <td>The same thing as <code>sails lift --prod</code> or <code>NODE_ENV=production node app.js</code>.</td>
        </tr>
        <tr>
            <td><pre><code>sails run lines</code></pre></td>
            <td>Will count the lines of code in the project, minus <code>.gitignore</code>'d files, for funzies. There are currently about 7k custom lines in this repo (views, controllers, helpers, hooks, etc); a small drop in the bucket, compared to what it's built on.
            </td>
        </tr>
        <tr>
            <td><pre><code>sails run open:client</code></pre></td>
            <td>Will run the <a rel="nofollow" href="https://webpack.js.org/configuration/dev-server/">Webpack Dev Server</a> and open a browser tab / window.</td>
        </tr>
        <tr>
            <td><pre><code>sails run start</code></pre></td>
            <td>Will run both <code>sails run lift</code> and <code>sails run open:client</code> in parallel.</td>
        </tr>
        <tr>
            <td><pre><code>sails run test</code></pre></td>
            <td>Run <a rel="nofollow" href="https://mochajs.org/">Mocha</a> tests. Everything starts in the
                <a href="test/startTests.js"><code>test/startTests.js</code></a> file.
            </td>
        </tr>
    </tbody>
</table>

## Sails Scripts

These scripts generally require access to working models, or helpers, so a quick instance is spun-up to run them. Currently [`create-admin`](scripts/create-admin.js) is the only script in the [`scripts`](scripts) folder.

See the [Sails Docs](https://sailsjs.com/documentation/concepts/shell-scripts) for more info on Sails scripts.

## Request Logging

Automatic incoming request logging, is a 2 part process. First, the [`request-logger` hook](api/hooks/request-logger.js) gathers info from the request, and creates a
new [`RequestLog` record](api/models/RequestLog.js), making sure to mask anything that may be sensitive, such as passwords. Then, a custom response gathers information from the response, again,
scrubbing sensitive data (using the [customToJSON](https://sailsjs.com/documentation/concepts/models-and-orm/model-settings?identity=#customtojson) feature of Sails models) to prevent leaking of
password hashes, or anything else that should never be publicly accessible. The [`keepModelsSafe` helper](api/helpers/keep-models-safe.js) and the custom responses (such as [ok](api/responses/ok.js)
or [serverError](api/responses/serverError.js)) are responsible for the final leg of request logs.

## If you DO NOT want request logging

You can easily disable request logging, by setting `sails.config.log.captureRequests = false`. See [custom configuration options](#custom-configuration-options) for more.

## Using Webpack

### Local Dev

The script `npm run open:client` will start the auto-reloading Webpack development server, and open a browser window. When you save changes to assets (React files mainly), it will auto-compile the
update, then refresh the browser automatically.

### Remote Builds

The script `npm run build` will make Webpack build all the proper assets into the `.tmp/public` folder. Sails will serve assets from this folder.

If you want to build assets, but retain spaces / tabs for debugging, you can use `npm run build:dev`.

### Configuration

The webpack configuration can be found in the [`webpack`](webpack) folder. The majority of the configuration can be found in [`common.config.js`](webpack/common.config.js). Then, the other 3 files,
such as [`dev.config.js`](webpack/dev.config.js) extend the `common.config.js` file.

## Building with React

React source files live in the [`assets/src`](assets/src) folder. It is structured in such a way, where the `index.jsx` is really only used for local development (to help Webpack serve up the
correct "app"). Then, there are the individual "apps", [main](assets/src/main.jsx) and [admin](assets/src/admin.jsx). These files are used as
Webpack "[entry points](https://webpack.js.org/concepts/entry-points/)", to create 2 separate application bundles.

In a remote environment, Sails will look at the first subdirectory requested, and use that to determine which `index.html` file it needs to actually return. So, in this case, the "main" application
will get built in `.tmp/public/main`, where the CSS is `.tmp/public/main/bundle.css`, the JavaScript is `.tmp/public/main/bundle.js`, and the HTML is `.tmp/public/main/index.html`.

### Serving Compiled Assets

Sails is currently setup (see [config/routes.js](config/routes.js)) to automatically serve compiled files from `.tmp/public`. If Sails needs to return the initial HTML, it will take the first subdirectory of the request (`/admin` from `/admin/dashboard`), and will return the `index.html` from `.tmp/public`.

Example: User requests `/admin/dashboard`, Sails will serve `.tmp/public/admin/index.html`.

I recommend using a content CDN, something like [AWS CloudFront](https://aws.amazon.com/cloudfront), to help ease the burden of serving static files, and making less calls to your Sails instance(s). It may also be a good idea to consider using something like [Nginx](https://nginx.org/en/) to handle serving of compiled assets, leaving Sails to only have to handle API requests.

## Schema Validation and Enforcement

Inside [`config/bootstrap.js`](config/bootstrap.js) is a bit of logic (**HEAVILY ROOTED IN NATIVE `MySQL` QUERIES**), which validates column types in the `PRODUCTION` database (
aka `sails.config.models.migrate === 'safe'`), then will validate foreign key indexes. If there are too many columns, or there is a missing index, or incorrect column type, the logic
will `console.error` any issues, then `process.exit(1)` (kill) the Sails server. The idea here, is that if anything is out of alignment, Sails will fail to lift, which will mean failure to deploy on
PRODUCTION, preventing accidental, invalid live deployments; a final safety net if you will.

### If you DO NOT want schema validation

... then you have 2 options:

* Set `sails.config.models.validateOnBootstrap = false` at the bottom of [`config/models.js`](config/models.js).
* OR replace the contents of `config/bootstrap.js` with the following:

```javascript
module.exports.bootstrap = function(next) {
    // You must call the callback function, or Sails will fail to lift!
    next();
};
```

## PwnedPasswords.com Integration

When a new password is being created, it is checked with the [PwnedPasswords.com API](https://haveibeenpwned.com/API/v3#PwnedPasswords). This API uses a k-anonymity model, so the password that is
searched for is never exposed to the API. Basically, the password is hashed, then the first 5 characters are sent to the API, and the API returns any hashes that start with those 5 characters,
including the amount of times that hash (aka password) has been found in known security breaches.

This functionality is turned on by default, and can be shutoff per-use, or globally throughout the app. [`sails.helpers.isPasswordValid`](api/helpers/is-password-valid.js) can be used with `skipPwned`
option set to `true`, to disable the check per use (see [`api/controllers/common/login.js`](api/controllers/common/login.js#L40) for example). Inside of [`config/security.js`](config/security.js), the
variable `checkPwnedPasswords` can be set to `false` to disable it globally.

## Working With Ngrok

This repo has a custom script ([`ngrok.js`](ngrok.js)), which will start a Ngrok tunnel (using the NPM package [`ngrok`](https://npmjs.com/package/ngrok)), build assets, and start Sails.

### First thing's first

You will want to get an auth token (and create an account if you haven't already): https://dashboard.ngrok.com/tunnels/authtokens

You will need to `npm i ngrok --save-dev` before you can do anything. I've opted to not have it pre-installed, as it does add a bit of bloat, and not everyone is going to use it.

After you have it installed, you can run `ngrok.js`, with node: `node ngrok` or just directly: `./ngrok.js`.

### Script Options

These are the current configuration flags. Order does not matter.

| Option                | Description                                                                                                                                                                                                                                                                                |
|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `auth=USER:PASS`      | This will protect the Ngrok tunnel with HTTP Basic Auth, using the USER / PASS you supply.                                                                                                                                                                                                 |
| `nobuild`             | Adding this flag will skip asset building.                                                                                                                                                                                                                                                 |
| `domain=MYDOMAIN`     | The domain to connect the tunnel from Sails to.                                                                                                                                                                                                                                            |
| `region=MYREGION`     | The region to use for connection to the Ngrok services. One of Ngrok regions (`us`, `eu`, `au`, `ap`, `sa`, `jp`, `in`). Defaults to `us`.                                                                                                                                                 |
| `token=MY_AUTH_TOKEN` | Adding this flag will set your Ngrok auth token. In most cases, ngrok will automatically save this token in your home folder, and re-use it later. You can test this out by omitting your token on next run, and go to your [Ngrok dashboard](https://dashboard.ngrok.com/tunnels/agents). |

You can also use the environment variable `NGROK_TOKEN` to pass your auth token. If both environment variable, and script flag are set, the script flag will take priority.

An example: `node ngrok nobuild token=S1T2A3Y4I5N6G7A8L9I0V1E region=us`

## Support for `sails-hook-autoreload`

If you would like to use [`sails-hook-autoreload`](https://npmjs.com/package/sails-hook-autoreload), just install it: `npm i sails-hook-autoreload --save-dev`. The config file [`config/autoreload.js`](config/autoreload.js) is already pre-configured for this repo.

## What about SEO?

I recommend looking at [prerender.io](https://prerender.io). They offer a service (free up to 250 pages) that caches the end result of a JavaScript-rendered view (React, Vue, Angular), allowing search
engines to crawl otherwise un-crawlable web views. You can use the service in a number of ways. One way, is to use the [prerender-node](https://www.npmjs.com/package/prerender-node) package. To use it
with Sails, you'll have to add it to the [HTTP Middleware](https://sailsjs.com/documentation/concepts/middleware#?http-middleware). Here's a quick example:

```javascript
middleware: {

    order: [
        'cookieParser',
        'bodyParser',
        'prerender',    // reference our custom middleware found below;
                        // we run this before compression and routing,
                        // because it is a proxy, saving time and resources
        'compress',
        'customPoweredBy',
        'router',       // custom Sails middleware handler (config/routes.js)
        'assetLog',     // the request wasn't caught by any of the above middleware, must be assets
        'www',          // default hook to serve static files
        'favicon'       // default hook to serve favicon
    ],

    // REMEMBER! Environment variables are your friends!!!
    prerender: require('prerender-node').set('prerenderToken', 'YOUR_TOKEN')

}
```

## Useful Links

* [Sails Framework Documentation](https://sailsjs.com/get-started)
* [Sails Deployment Tips](https://sailsjs.com/documentation/concepts/deployment)
* [Sails Community Support Options](https://sailsjs.com/support)
* [Sails Professional / Enterprise Options](https://sailsjs.com/enterprise)
* [`react-bootstrap` Documentation](https://react-bootstrap.netlify.app)
* [Webpack Documentation](https://webpack.js.org)
* [React Documentation](https://react.dev)
* [Bootstrap Documentation](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
* [Simple data fixtures for testing Sails.js (the npm package `fixted`)](https://www.npmjs.com/package/fixted)

### Version info

This app was originally generated on Fri Mar 20 2020 17:39:04 GMT-0500 (Central Daylight Time) using Sails v1.2.3.

#### Code Coverage

The current code coverage [can be viewed here](https://htmlpreview.github.io/?https://github.com/neonexus/sails-react-bootstrap-webpack/blob/release/test/coverage/index.html).

<!-- Internally, Sails used [`sails-generate@1.16.13`](https://github.com/balderdashy/sails-generate/tree/v1.16.13/lib/core-generators/new). -->

<!--
Note:  Generators are usually run using the globally-installed `sails` CLI (command-line interface).  This CLI version is _environment-specific_ rather than app-specific, thus over time, as a project's dependencies are upgraded or the project is worked on by different developers on different computers using different versions of Node.js, the Sails dependency in its package.json file may differ from the globally-installed Sails CLI release it was originally generated with.  (Be sure to always check out the relevant [upgrading guides](https://sailsjs.com/upgrading) before upgrading the version of Sails used by your app.  If you're stuck, [get help here](https://sailsjs.com/support).)
-->
