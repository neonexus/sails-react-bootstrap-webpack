# sails-react-bootstrap-webpack

[![Travis CI status](https://img.shields.io/travis/com/neonexus/sails-react-bootstrap-webpack.svg?branch=release&logo=travis)](https://app.travis-ci.com/github/neonexus/sails-react-bootstrap-webpack)
[![Sails version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fneonexus%2Fsails-react-bootstrap-webpack%2Fv5.3.4%2Fpackage.json&query=%24.dependencies.sails&label=Sails&logo=sailsdotjs)](https://sailsjs.com)
[![React version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fneonexus%2Fsails-react-bootstrap-webpack%2Fv5.3.4%2Fpackage.json&query=%24.devDependencies.react&label=React&logo=react)](https://react.dev)
[![Bootstrap version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fneonexus%2Fsails-react-bootstrap-webpack%2Fv5.3.4%2Fpackage.json&query=%24.devDependencies.bootstrap&label=Bootstrap&logo=bootstrap&logoColor=white)](https://getbootstrap.com)
[![Webpack version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fneonexus%2Fsails-react-bootstrap-webpack%2Fv5.3.4%2Fpackage.json&query=%24.devDependencies.webpack&label=Webpack&logo=webpack)](https://webpack.js.org)

[//]: # ([![Codecov]&#40;https://img.shields.io/codecov/c/github/neonexus/sails-react-bootstrap-webpack?logo=codecov&#41;]&#40;https://codecov.io/gh/neonexus/sails-react-bootstrap-webpack&#41;)

[//]: # ([![Discord Server]&#40;https://img.shields.io/badge/Discord_server-silver?logo=discord&#41;]&#40;http://discord.gg/Y5K73E84Tc&#41;)

This is a starter application, built on [Sails v1](https://sailsjs.com), [React](https://react.dev), [Bootstrap](https://getbootstrap.com), and [Webpack](https://webpack.js.org). It is designed
so that multiple front-ends (a customer front-end, and an admin panel perhaps; more if need be) can live side-by-side, and use the same API. It even has built-in [Ngrok support](#working-with-ngrok).
A virtual start-up in a box!

## Quick Install

NOTE: You will need access to a MySQL / MariaDB database for the setup. If you want to use a different datastore, you'll need to configure it manually.

[Aiven.io](https://aiven.io) has FREE (no CC required) secure MySQL (5 GB), and Redis (1 GB). Both require use of SSL, and can be restricted to specified IPs. (If you are having trouble finding the
FREE instances, you need to select Digital Ocean as the cloud provider.) Use my [referral link](https://console.aiven.io/signup?referral_code=mk36ekt3wo1dvij7joon) to signup, and you'll get $100
extra when you start a trial (trial is NOT needed for the free servers).

```shell
npx drfg neonexus/sails-react-bootstrap-webpack my-new-site
cd my-new-site
npm run setup
npm run start   OR   npm run ngrok
```

## Table of Contents

* [Main Features](#main-features)
* [Branch Warning](#branch-warning)
* [Current Dependencies](#current-dependencies)
  * [A note about dependency versions](#a-note-about-dependency-versions)
* [How to Use](#how-to-use)
  * [Downloading a Copy](#downloading-a-copy)
  * [Interactive Setup](#interactive-setup)
* [Configuration](#configuration)
  * [Custom Configuration Options](#custom-configuration-options)
  * [Want to configure the `X-Powered-By` header?](#want-to-configure-the-x-powered-by-header)
  * [Environment Variables](#environment-variables)
* [Custom Security Policies](#custom-security-policies)
* [Scripts Built Into `package.json`](#scripts-built-into-packagejson)
* [Sails Scripts](#sails-scripts)
* [Request Logging](#request-logging)
  * [If you DO NOT want request logging](#if-you-do-not-want-request-logging)
* [Using `Webpack`](#using-webpack)
  * [Local Dev](#local-dev)
  * [Remote Builds](#remote-builds)
  * [Configuration](#configuration-1)
* [Building with `React`](#building-with-react)
  * [Serving Compiled Assets](#serving-compiled-assets)
* [Schema Validation and Enforcement](#schema-validation-and-enforcement)
  * [Why are foreign keys enforced?](#why-are-foreign-keys-enforced)
  * [If you DO NOT want schema validation](#if-you-do-not-want-schema-validation)
* [`PwnedPasswords.com` Integration](#pwnedpasswordscom-integration)
* [Working With `Ngrok`](#working-with-ngrok)
  * [First Thing's First](#first-things-first)
  * [Sails-Style Configuration](#sails-style-configuration)
  * [Script Options](#script-options)
* [Support for `sails-hook-autoreload`](#support-for-sails-hook-autoreload)
* [Getting Setup Remotely](#getting-setup-remotely)
  * [What is TMUX?](#what-is-tmux)
  * [A simple walkthrough for a self-updating VM](#a-simple-walkthrough-for-a-self-updating-vm)
* [What About SEO?](#what-about-seo)
* [Useful Links](#useful-links)

## Main Features

* Online in a single command, thanks to included [Ngrok support](#working-with-ngrok).
* Automatic (incoming) request logging (manual outgoing), via Sails models / hooks.
* Setup for Webpack auto-reload dev server. Build; save; auto-reload.
* Setup so Sails will serve Webpack-built bundles as separate apps (so, a marketing site, and an admin site can live side-by-side).
* More than a few custom [API helper functions](api/helpers) to make life a little easier.
* Includes [react-bootstrap](https://www.npmjs.com/package/react-bootstrap) to make using Bootstrap styles / features with React easier.
* Schema validation and enforcement for `PRODUCTION`. See [schema validation and enforcement](#schema-validation-and-enforcement).
* New passwords will be checked against the [PwnedPasswords API](https://haveibeenpwned.com/API/v3#PwnedPasswords). If there is a single hit for the password, an error will be given, and the user will
  be forced to choose another. See [PwnedPasswords integration](#pwnedpasswordscom-integration) for more info.
* Google Authenticator-style OTP (One-Time Password) functionality; also known as 2FA (2-Factor Authentication).
SMS is costly and [vulnerable to attack](https://authy.com/blog/understanding-2fa-the-authy-app-and-sms/). Please don't use SMS as a primary 2FA method!
* **Made with 10% more LOVE than the next leading brand!**

## Branch Warning

The `master` branch is experimental, and the [release branch](https://github.com/neonexus/sails-react-bootstrap-webpack/tree/release) (or the [`releases section`](https://github.com/neonexus/sails-react-bootstrap-webpack/releases)) is where one should base their use of this template.

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

All dependencies in `package.json` are "version locked". This means that explicit version numbers are used, no fuzzy matches like `^` or `*`.
A couple of reasons / advantages for why this is done:

* Package poisoning is a serious threat, that should NOT be taken lightly. You are relying on someone else's package, and if you have a fuzzy match for a dependency, you are opening the door wide open
for bad actors to do bad things. If the author of the package you depend on gets hacked, and the hacker decides to manipulate a package for nefarious purposes, all they have to do is release a minor
version to the package, and your fuzzy match will download it, no questions asked.
* If there happens to be a release that falls in a fuzzy match, which just so happens to have been released after testing is completed, but before PRODUCTION has done an `npm install`, there is a
possibility of bugs being introduced into PRODUCTION, and not caught until well after customers become extremely irate.
* Version locking helps prevent "works on my machine" syndrome. Because it is generally habit to `npm install` after a `git pull` (or at least should be if not a Git hook), keeping versions explicit
with commits helps prevent a LOT of weirdness.
* It's just easier to see when dependency versions change in commit history. Helps prevent headaches.

In the end, **DON'T BE FUZZY! BE EXPLICIT!** Use a tool like [`npm-check-updates`](https://www.npmjs.com/package/npm-check-updates) to make dependency updates easier to audit / update.

## How to Use

### Downloading a Copy

You can quickly download / install dependencies using [`drfg` (Download Release From GitHub)](https://www.npmjs.com/package/drfg) via NPX (if you have Node.js installed, you have NPX):

```shell
npx drfg neonexus/sails-react-bootstrap-webpack
```

This will download this repo's latest version, extract it, then install the dependencies into the folder `sails-react-bootstrap-webpack` in the current working directory.
If you want to install in a different location, just supply the new folder name as the second parameter:

```shell
npx drfg neonexus/sails-react-bootstrap-webpack my-new-site
```

Or, GitHub provides a handy "Use this template" (green) button at the top of this page. That will create a special clone of this repo (so there is a single, init commit,
instead of the commit history from this repo).

Or, you can download a copy of the [latest release](https://github.com/neonexus/sails-react-bootstrap-webpack/releases/latest) manually.

See [the scripts section](#scripts-built-into-packagejson) for the various ways to build the frontend and run the backend.
See the [working with Ngrok](#working-with-ngrok) section on how to spin-up an instance with Ngrok attached.

### Interactive Setup

```shell
npm run setup
```
OR
```shell
./setup.js
```

The [setup.js](setup.js) script will walk you through interactive questions, and create a `config/local.js` for you, based on the contents of [`config/local.js.sample`](config/local.js.sample).
If you already have a `config/local.js`, the setup script will use the configuration options as defaults (including passwords), and rebuild it.

After you're all configured, you'll likely want an admin user:

```shell
npm run create:admin
```

The create admin script is designed to allow only a single admin user to be created in this manner. After this point, the API must be used.

## Configuration

In the [`config` folder](config), there is the [`local.js.sample`](config/local.js.sample) file, which is meant to be copied to `local.js`. This file (`local.js`, not the sample) is ignored by Git,
and intended for use in local development, NOT remote servers. Generally one would use environment variables for remote server configuration (and this repo is already setup to handle environment
variable configuration for both DEV and PROD). See [Environment Variables](#environment-variables) for more.

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
                <a href="config/local.js.sample"><code>local.js</code></a><br />
                <a href="config/env/development.js"><code>env/development.js</code></a><br />
                <a href="config/env/production.js"><code>env/production.js</code></a><br />
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
            <td><a href="config/log.js"><code>log.js</code></a></td>
            <td><code>true</code></td>
            <td>
                When enabled, all incoming requests will automatically be logged via the
                <a href="api/models/RequestLog.js"><code>RequestLog</code></a> model, by the
                <a href="api/hooks/request-logger.js"><code>request-logger</code></a> hook, and the
                <a href="api/helpers/finalize-request-log.js"><code>finalize-request-log</code></a> helper.
                <br /><br />See <a href="#request-logging">Request Logging</a> for more info.
            </td>
        </tr>
        <tr>
            <td><code>log.ignoreAssets</code></td>
            <td><a href="config/log.js"><code>log.js</code></a></td>
            <td><code>true</code></td>
            <td>
                When enabled (and `captureRequests` is `true`), this will force the logger to skip over assets (things like `.js` / `.css`, etc.).
            </td>
        </tr>
        <tr>
            <td><code>models.validateOnBootstrap</code></td>
            <td><a href="config/models.js"><code>models.js</code></a></td>
            <td><code>true</code></td>
            <td>
                When enabled, and <code>models.migrate === 'safe'</code> (aka PRODUCTION), then the SQL schemas of the default datastore will be validated against the model definitions.
                <br><br>See <a href="#schema-validation-and-enforcement">schema validation and enforcement</a> for more info.
            </td>
        </tr>
        <tr>
            <td><code>models.enforceForeignKeys</code></td>
            <td><a href="config/models.js"><code>models.js</code></a></td>
            <td><code>true</code></td>
            <td>
                This is a modification option for the <code>validateOnBootstrap</code> configuration.
                When both are <code>true</code>, the schema validation and enforcement will also enforce foreign key relationships.
                It can be useful to disable this option when testing PRODUCTION configuration locally.
            </td>
        </tr>
        <tr>
            <td><code>security.checkPwnedPasswords</code></td>
            <td><a href="config/security.js"><code>security.js</code></a></td>
            <td><code>true</code></td>
            <td>
                When enabled, <a href="api/helpers/is-password-valid.js"><code>sails.helpers.isPasswordValid()</code></a> will run its normal
                checks, before checking with the PwnedPasswords.com API to verify the password has not been found in a known security breach. If it has, it will consider the password invalid.
            </td>
        </tr>
        <tr>
            <td>
                <code>security</code><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code>.requestLogger</code><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code>.logSensitiveData</code>
            </td>
            <td>
                <a href="config/security.js"><code>security.js</code></a>
                <br/> <a href="config/env/development.js"><code>env/development.js</code></a>
            </td>
            <td><code>false</code></td>
            <td>
                If enabled, and NOT a PRODUCTION environment, the <a href="#request-logging">request logger</a> will log sensitive info, such as passwords.
                <br/><br/> This will ALWAYS be false on PRODUCTION. It is in the PRODUCTION configuration file only as a reminder.
            </td>
        </tr>
    </tbody>
</table>

### Want to configure the `X-Powered-By` header?

Sails.js has middleware (akin to [Express.js Middleware](https://expressjs.com/en/guide/using-middleware.html), Sails is built on Express.js after all...). Inside
of [`config/http.js`](config/http.js) we create our own `X-Powered-By` header, using Express.js Middleware.

### Environment Variables

There are a few environment variables that the remote configuration files are set up for. There are currently 3 variables that change names between DEV and PROD; this is intentional, and has proven
very useful in my experience. DEV has shorter names like `DB_HOST`, where PROD has fuller names like `DB_HOSTNAME`. This helps with ensuring you are configuring the correct remote server, and has
prevented accidental DEV deployments to PROD.

If you DO NOT like this behavior, and would prefer the variables stay the same across your environments, feel free to change them in [`config/env/development.js`](config/env/development.js)
and [`config/env/production.js`](config/env/production.js)

| Variable                                             | Default                                   | Description                                                                                                                     |
|------------------------------------------------------|-------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `ASSETS_URL`                                         | "" (empty string)                         | Webpack is configured to modify static asset URLs to point to a CDN, like CloudFront. MUST end with a slash " / ", or be empty. |
| `BASE_URL`                                           | https://myapi.app                         | The address of the Sails instance.                                                                                              |
| `DATA_ENCRYPTION_KEY`                                | "" (empty string)                         | The data encryption key to use when encrypting / decrypting data in the datastore.                                              |
| **DEV:** `DB_HOST`<br />**PROD:**&nbsp;`DB_HOSTNAME` | localhost                                 | The hostname of the datastore.                                                                                                  |
| **DEV:** `DB_USER`<br />**PROD:** `DB_USERNAME`      | **DEV:** root <br /> **PROD:** produser   | Username of the datastore.                                                                                                      |
| **DEV:** `DB_PASS`<br />**PROD:** `DB_PASSWORD`      | **DEV:** mypass <br /> **PROD:** prodpass | Password of the datastore.                                                                                                      |
| `DB_NAME`                                            | **DEV:** myapp <br /> **PROD:** prod      | The name of the database inside the datastore.                                                                                  |
| `DB_PORT`                                            | 3306                                      | The port number for the datastore.                                                                                              |
| `DB_SSL`                                             | true                                      | If the datastore requires SSL, set this to "true".                                                                              |
| `NGROK_AUTHTOKEN`                                    | "" (empty string)                         | Ngrok auth token used in the [`ngrok.js`](#working-with-ngrok) script.                                                          |
| `NGROK_BASIC`                                        | "" (empty string)                         | The `user:pass` combo to use for basic authentication with [`ngrok.js`](#working-with-ngrok).                                   |
| `NGROK_DOMAIN`                                       | "" (empty string)                         | The domain to tunnel Sails to. Used in [`ngrok.js`](#working-with-ngrok).                                                       |
| `SESSION_SECRET`                                     | "" (empty string)                         | Used to sign cookies. If changed, will invalidate all sessions.                                                                 |

## Custom Security Policies

Security policies that are responsible for protecting API endpoints live in the [api/policies](api/policies) folder, and are configured in the [config/policies.js](config/policies.js) file.

The most important policy, in terms of this repo, is the [`is-logged-in`](api/policies/isLoggedIn.js) policy. It determines if the request is being made from a valid session, and if so, passes the
session data down to controllers (and other policies). Past that, there is currently only a second policy: [`is-admin`](api/policies/isAdmin.js). It uses the session data from `is-logged-in` to
determine if the user is an admin; if they aren't, the request is rejected.

Read more about Sails' security policies: [https://sailsjs.com/documentation/concepts/policies](https://sailsjs.com/documentation/concepts/policies)

## Scripts built into [`package.json`](package.json):

<table>
    <thead>
        <tr>
            <th>Command</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><pre><code>npm run build</code></pre></td>
            <td>Will run <code>npm run clean</code>, then <code>npm run build:prod</code>.</td>
        </tr>
        <tr>
            <td><pre><code>npm run build:dev</code></pre></td>
            <td>
                Same thing as <code>npm run build:prod</code>, except that it will not optimize the files, retaining newlines and empty spaces. Will run <code>npm run clean</code>, then
                <code>npm run build:dev:webpack</code>.
            </td>
        </tr>
        <tr>
            <td><pre><code>npm run clean</code></pre></td>
            <td>Will delete everything in the <code>.tmp</code> folder.</td>
        </tr>
        <tr>
            <td><pre><code>npm run codecov</code></pre></td>
            <td>Command to run tests, generate code coverage, and upload said coverage to Codecov. Designed to be run by CI test runners like <a href="https://www.travis-ci.com">Travis CI</a>.</td>
        </tr>
        <tr>
            <td><pre><code>npm run coverage</code></pre></td>
            <td>Runs <a rel="nofollow" href="https://www.npmjs.com/package/nyc">NYC</a> coverage reporting of the Mocha tests, which generates HTML in <code>test/coverage</code>.</td>
        </tr>
        <tr>
            <td><pre><code>npm run create:admin</code></pre></td>
            <td>
                Will run the Sails script <code>sails run create-admin</code> (<a href="scripts/create-admin.js">scripts/create-admin.js</a>).
                See <a href="#sails-scripts">Sails Scripts</a> for more info.
            </td>
        </tr>
        <tr>
            <td><pre><code>npm run debug</code></pre></td>
            <td>Alias for <code>node --inspect app.js</code>.</td>
        </tr>
        <tr>
            <td><pre><code>npm run generate:dek</code></pre></td>
            <td>Generate a DEK (Data Encryption Key).</td>
        </tr>
        <tr>
            <td><pre><code>npm run generate:token</code></pre></td>
            <td>Generate a 64-character token.</td>
        </tr>
        <tr>
            <td><pre><code>npm run generate:uuid</code></pre></td>
            <td>Generate a v4 UUID.</td>
        </tr>
        <tr>
            <td><pre><code>npm run lift</code></pre></td>
            <td>The same thing as <code>node app.js</code> or <code>./app.js</code>; will
                "<a rel="nofollow" href="https://sailsjs.com/documentation/reference/command-line-interface/sails-lift">lift our Sails</a>" instance (aka starting the API).
            </td>
        </tr>
        <tr>
            <td><pre><code>npm run lift:prod</code></pre></td>
            <td>The same thing as <code>NODE_ENV=production node app.js</code>.</td>
        </tr>
        <tr>
            <td><pre><code>npm run lines</code></pre></td>
            <td>
                Will count the lines of code in the project, minus <code>.gitignore</code>'d files, for funzies. There are currently about 7k custom lines in this repo
                (views, controllers, helpers, hooks, etc); a small drop in the bucket, compared to what it's built on.
            </td>
        </tr>
        <tr>
            <td><pre><code>npm run setup</code></pre></td>
            <td>
                Same thing as <code>node setup.js</code> or <code>./setup.js</code>. The setup script will interactively ask questions, and create a <code>`config/local.js</code>
                based on the contents of <a href="config/local.js.sample"><code>config/local.js.sample</code></a>.
            </td>
        </tr>
        <tr>
            <td><pre><code>npm run start</code></pre></td>
            <td>Will run both <code>npm run lift</code> and <code>npm run webpack</code> in parallel.</td>
        </tr>
        <tr>
            <td><pre><code>npm run test</code></pre></td>
            <td>Run <a rel="nofollow" href="https://mochajs.org/">Mocha</a> tests. Everything starts in the
                <a href="test/startTests.js"><code>test/startTests.js</code></a> file.
            </td>
        </tr>
        <tr>
            <td><pre><code>npm run webpack</code></pre></td>
            <td>Will run the <a rel="nofollow" href="https://webpack.js.org/configuration/dev-server/">Webpack Dev Server</a> and open a browser tab / window.</td>
        </tr>
    </tbody>
</table>

## Sails Scripts

These scripts generally require access to working models, or helpers, so a quick instance is spun-up to run them. Currently [`create-admin`](scripts/create-admin.js) is the only script in
the [`scripts`](scripts) folder.

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

The script `npm run webpack` will start the auto-reloading Webpack development server, and open a browser window. When you save changes to assets (React files mainly), it will auto-compile the
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

Sails is currently setup (see [config/routes.js](config/routes.js)) to automatically serve compiled files from `.tmp/public`. If Sails needs to return the initial HTML, it will take the first
subdirectory of the request (`/admin` from `/admin/dashboard`), and will return the `index.html` from `.tmp/public`.

Example: User requests `/admin/dashboard`, Sails will serve `.tmp/public/admin/index.html`.

I recommend using a content CDN, something like [AWS CloudFront](https://aws.amazon.com/cloudfront), to help ease the burden of serving static files, and making less calls to your Sails instance(s).
It may also be a good idea to consider using something like [Nginx](https://nginx.org/en/) to handle serving of compiled assets, leaving Sails to only have to handle API requests.

## Schema Validation and Enforcement

This feature is designed for `MySQL` (can LIKELY be used with most if not all other SQL-based datastores [I have not tried]). If you plan to use a different datastore, you will likely want to disable this
feature.

Inside [`config/bootstrap.js`](config/bootstrap.js) is a bit of logic (**HEAVILY ROOTED IN NATIVE `MySQL` QUERIES**), which validates column types in the `PRODUCTION` database (
aka `sails.config.models.migrate === 'safe'`), then will validate foreign key indexes. If there are too many columns, or there is a missing index, or incorrect column type, the logic
will `console.error` any issues, then `process.exit(1)` (kill) the Sails server. The idea here, is that if anything is out of alignment, Sails will fail to lift, which will mean failure to deploy on
PRODUCTION, preventing accidental, invalid live deployments; a final safety net if you will.

### Why are foreign keys enforced?

While yes, Sails (rather [Waterline](https://npmjs.com/package/waterline)) does not actually require foreign keys to handle relationships, generally in a PRODUCTION environment there are more tools
at-play that DO require these relationships to work properly. So, by default, this repo is designed to validate that the keys are set up correctly. This feature can be turned off by changing
`sails.config.enforceForeignKeys = false` in `config/local.js` (or `config/models.js`).

### If you DO NOT want schema validation

...then you can set `sails.config.models.validateOnBootstrap = false` at the bottom of [`config/models.js`](config/models.js).

## PwnedPasswords.com Integration

When a new password is being created, it is checked with the [PwnedPasswords.com API](https://haveibeenpwned.com/API/v3#PwnedPasswords). This API uses a k-anonymity model, so the password that is
searched for is never exposed to the API. Basically, the password is hashed, then the first 5 characters are sent to the API, and the API returns any hashes that start with those 5 characters,
including the amount of times that hash (aka password) has been found in known security breaches.

This functionality is turned on by default, and can be shutoff per-use, or globally throughout the app. [`sails.helpers.isPasswordValid`](api/helpers/is-password-valid.js) can be used with `skipPwned`
option set to `true`, to disable the check per use (see [`api/controllers/common/login.js`](api/controllers/common/login.js#L40) for example). Inside of [`config/security.js`](config/security.js), the
variable `checkPwnedPasswords` can be set to `false` to disable it globally.

## Working With Ngrok

This repo has a custom script ([`ngrok.js`](ngrok.js)), which will start a Ngrok tunnel (using the official Ngrok NPM package [`@ngrok/ngrok`](https://npmjs.com/package/@ngrok/ngrok)), build assets, and start Sails.

### First thing's first

You will want to get an auth token (and create an account if you haven't already): https://dashboard.ngrok.com/tunnels/authtokens

You will need to `npm i @ngrok/ngrok --save-dev` before you can do anything. I've opted to not have it pre-installed, as it does add a bit of bloat, and not everyone is going to use it.

After you have it installed, you can run `ngrok.js`, with node: `node ngrok` or just directly: `./ngrok.js`.

### Sails-Style Configuration

If you prefer to configure Ngrok using Sails' style configuration, you can do so with [`config/ngrok.js`](config/ngrok.js), or `config/local.js`. Additionally, the [setup script](#interactive-setup)
will help you configure / install Ngrok.

### Script Options

These are the current configuration flags. Order does not matter.

An example: `node ngrok.js nobuild token=S1T2A3Y4I5N6G7A8L9I0V1E`

| Option            | Description                                                                                                                                                                                                                 |
|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `auth=USER:PASS`  | This will protect the Ngrok tunnel with HTTP Basic Auth, using the USER / PASS you supply. You can also use the `NGROK_BASIC` environment variable.                                                                         |
| `build`           | Adding this flag will force asset building.                                                                                                                                                                                 |
| `nobuild`         | Adding this flag will skip asset building.                                                                                                                                                                                  |
| `domain=MYDOMAIN` | The domain to connect the tunnel from Sails to. You can also use the `NGROK_DOMAIN` environment variable.                                                                                                                   |
| `port=SAILSPORT`  | The port to use internally for Sails. Useful if you want to run multiple instances on the same machine. The `PORT` environment variable or `sails.config.port` option is used as fall-backs if the script option isn't set. |
| `region=MYREGION` | The region to use for connection to the Ngrok services. One of Ngrok regions (`us`, `eu`, `au`, `ap`, `sa`, `jp`, `in`). You can also use the `NGROK_REGION` environment variable. Defaults to `global`.                    |
| `token=AUTHTOKEN` | Adding this flag will set your Ngrok auth token. You can also use `NGROK_AUTHTOKEN` or `NGROK_TOKEN` environment variables.                                                                                                 |

**NOTE:** For each option, the script flag will take precedent if a corresponding environment variable (or Sails configuration) is set.

For example: `./ngrok.js token=AUTHTOKEN1` > `NGROK_AUTHTOKEN=AUTHTOKEN2 ./ngork.js`.

## Support for `sails-hook-autoreload`

If you would like to use [`sails-hook-autoreload`](https://npmjs.com/package/sails-hook-autoreload), just install it: `npm i sails-hook-autoreload --save-dev`. The config
file [`config/autoreload.js`](config/autoreload.js) is already pre-configured for this repo.

## Getting Setup Remotely

There are a lot of ways to go about remote deployments; many automated, some not so much. For the sake of argument, let's say you want to set up a remote server by hand. It would be nice if said
server (or servers if behind a load-balancer), could do a `git pull`, `npm install`, and if need be `npm run build`.  It would also be great if you could see the progress, or even
just the console of the Node server.

That's what the [`self-update.sh`](self-update.sh) and [`tmux.sh`](tmux.sh) shell scripts are for. Note, they are both using `bash`, but should work just fine in `zsh`.

### What is TMUX?

In simplest terms, TMUX is a "terminal multiplexer". It lets you switch between programs in one terminal, detach them (they keep running in the background) and reattach them to a different terminal.

In other words, it adds a lot of magic to the terminal. One of the most useful things, is being able to run programs in the background, but still be able to see the console output later (as
it is still running). It runs (on the remote server) on most Linux-y distros, including macOS.

[TMUXCheatSheet.com](https://tmuxcheatsheet.com/) has a great "how to install and use" that you can find here: https://tmuxcheatsheet.com/how-to-install-tmux/

Once installed, just run `tmux a` (or `tmux attach`), which will attach to the last open session. If there isn't one, it'll open one. Running just `tmux` will create a whole new session, and you
generally don't want that.

`Ctrl + b` is the command to start a TMUX shortcut. It is how you navigate around inside TMUX.

A couple shortcuts you'll want to know:

| Description     | Command                                              |
|-----------------|------------------------------------------------------|
| Detach TMUX     | `Ctrl + b` then `d`                                  |
| Next Window     | `Ctrl + b` then `n`                                  |
| Previous Window | `Ctrl + b` then `p`                                  |
| Create Window   | `Ctrl + b` then `c`                                  |
| Close Window    | `Ctrl + b` then `&` (aka `Shift + 7`) OR just `exit` |
| Window Preview  | `Ctrl + b` then `w`                                  |
| Rename Window   | `Ctrl + b` then `,`                                  |


### A simple walkthrough for a self-updating VM

For this guide, I'm going to be using Amazon Linux as the basis; it's a great default if using AWS. However, most of these steps can easily be adapted for other distros.

It should also be noted, this is by no means the only way to set up remote servers; nor is it a thorough guide. This is just a quick-n-dirty, get off the ground running without a lot of tooling, kind
of guide. There are PLENTY of automated deployment managers and documentation out there. This is fairly open-ended; it is assumed you know how to do a portion of basic remote server management.

#### Getting Started

Spin up a new instance at the smallest size possible (as of this writing, `t4g.nano` is the smallest) and SSH into it and follow along.

#### Lack of Memory

While the smallest instance size will certainly not have enough RAM to support an asset build, it is plenty for running our Node server.

To make it so the instance CAN handle an asset build (despite its lack of memory), you'll want to create a swapfile. I use 4 GB swapfiles, as that seems to be more than enough head-room for asset
building, however, you can most likely get away with just 2G.

First, create the file, and allocate the space:
```shell
sudo fallocate -l 4G /swapfile
```

Make it readable / writable only from ROOT:
```shell
sudo chmod 600 /swapfile
```

Make it a proper swapfile:
```shell
sudo mkswap /swapfile
```

Tell the OS to actually use the swapfile:
```shell
sudo swapon /swapfile
```

Edit the `fstab` table to make this swapfile permanent:
```shell
sudo nano /etc/fstab
```

Add this to the bottom of the `fstab` and save:
```shell
/swapfile swap swap defaults 0 0
```

#### Get the basics installed

Now that we have the lack of memory issue dealt with, let's get the 3 bits of software installed that we for sure need: `git`, `node` and `tmux`:

```shell
sudo yum install git nodejs tmux
```

#### Setup server to be authenticated for `git pull`

This is going to assume you have a repo setup with GitHub, but the keygen is pretty much universal.

Generate SSH key:
```shell
ssh-keygen -t ed25519 -C server.name@my.app
```

Copy the public key:
```shell
cat ~/.ssh/id_ed25519.pub
```

Save it as a ["deploy key"](https://docs.github.com/v3/guides/managing-deploy-keys/#deploy-keys). (Or however you need to save it in your repo to allow `git pull` on the remote server).

#### Clone your repo

Once you have the server's public key saved in your repo manager, you should be able to clone your repo on the remote server:

```shell
git clone git@github.com:USERNAME/REPO.git myapp
```

#### Make sure dependencies work

Next, you'll want to `cd myapp`, and `npm install`.

Before you can actually start the server for a dry-run, you need to decide how you are going to store the server's credentials (user/pass for datastores and the like). It is recommended you use
the [environment variables](#environment-variables), but it is also possible to run the [interactive setup](#interactive-setup), and generate a `local.js`.

#### Give it a spin

You should now be able to `sudo npm run lift:prod` (recommended for all remote environments, even DEV). `sudo` is needed on Amazon Linux, because it requires ROOT permissions to open ports.

If everything is working as intended... congrats (or so you thought)! Now that you have everything working, it's time to get the server to update / rebuild / start itself.

#### Final stretch

Next up, you need to decide how you are going to have the `tmux.sh` script run on startup. The easiest way would be to just install `cronie` (for the use of `crontab`):

```shell
sudo yum install cronie
```

Enable the service:
```shell
sudo systemctl enable crond.service
```

Start said service:
```shell
sudo systemctl start crond.service
```

Edit the `crontab` to run the script at `@reboot`:

```shell
@reboot cd myapp; ./tmux.sh
```

#### Have you tried turning it off and on again?

Force the instance to restart, and it should automatically lift the server inside of TMUX.

```shell
sudo reboot
```

After reconnecting to the instance, you should be able to `tmux attach` and see the Sails console.

Once you've verified everything works, you can use `./tmux.sh myapp status` / `./tmux.sh myapp start` / `./tmux.sh myapp stop` / `./tmux.sh myapp restart` (but you don't have to).

#### Now save that image!

Now that you have a self-starting/updating server, you should create an AMI from that instance. After it's been created, you should be able to terminate the running instance, and spin up a new one
using your new custom AMI, and everything should just work. Now you have the start of a robust remote fleet; because spinning up new servers is just a couple clicks (or commands) away.

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

<!-- Internally, Sails used [`sails-generate@1.16.13`](https://github.com/balderdashy/sails-generate/tree/v1.16.13/lib/core-generators/new). -->
