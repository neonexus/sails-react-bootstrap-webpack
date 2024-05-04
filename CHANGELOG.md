# Changelog

# [v5.3.4](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v5.3.3...v5.3.4) (2024-05-03)
### Features

* Fixed `ejs` audit warning.
* Updated dependencies.

# [v5.3.3](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v5.3.2...v5.3.3) (2024-04-29)
### Features

* Added `ignoreAssets` option to the request logger. Should cut down noise a bit.
* Re-installed dependencies to do a package-lock reset. Should fix issues reported by Snyk.

# [v5.3.2](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v5.3.1...v5.3.2) (2024-04-22)
### Features

* Reworded the guide a bit, so it didn't sound so repetitive.
* Updated `fixted`.

## [v5.3.1](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v5.3.0...v5.3.1) (2024-04-22)
### Features

* Added a couple tips about TMUX to README.

## [v5.3.0](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v5.2.3...v5.3.0) (2024-04-22)
### Features

* Added TMUX and self-update scripts.
* Updated README for the new scripts, and Aiven.io mention.
* Updated dependencies.

## [v5.2.3](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v5.2.2...v5.2.3) (2024-04-09)
### Features

* Fixed issue with setup not setting DB SSL correctly.
* Fixed npm audit issues.
* Fixed metadata issue with Favicons.
* Updated dependencies.

## [v5.2.2](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v5.2.1...v5.2.2) (2024-01-24)
### Features

* Fixed stupid mistake with README (no update to the badges).
* Commented out Codecov for now... It's reporting 0%, which is not true...

## [v5.2.1](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v5.2.0...v5.2.1) (2024-01-24)
### Features

* Created the [`.ncurc`](.ncurc) config file for [`npm-check-updates`](https://npmjs.com/package/npm-check-updates). Doing this to "lock" [Chai](https://npmjs.com/package/chai) into v4 on `ncu` calls.
* Small tweak to [`local.js.sample`](config/local.js.sample).
* Updated dependencies.

## [v5.2.0](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v5.1.1...v5.2.0) (2024-01-11)
### Features

* Made setup script handle DEV default DEK and session secret generation.
* NPM audit fix for `follow-redirects`.
* Updated dependencies.

## [v5.1.1](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v5.1.0...v5.1.1) (2024-01-06)
### Features

* Minor corrections.

## [v5.1.0](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v5.0.0...v5.1.0) (2024-01-06)
### Features

* Created the datastore wipe script, to clear LOCAL / DEVELOPMENT datastore(s). It's just like `DROP`ing the database. Will **not** run on PRODUCTION (or when `migrate = 'safe'`).
* Converted `.mocharc.yml` -> `.mocharc` (JSON) to be more consistent.
* Made the Ngrok script capable of installing [`@ngrok/ngrok`](https://npmjs.com/package/@ngrok/ngrok) when needed.
* Minor visual fix in security settings page.
* Built the "reactivate user" endpoint.
* Corrected "edit" and "delete" user routes to use ID in the route.
* Fixed issue in 2FA backup token generation, where it was possible to generate a pure number backup token. Now will ALWAYS have at least 1 letter.
* Updated dependencies.

## [v5.0.0](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v4.3.1...v5.0.0) (2023-12-05)
### Features

* Made [`app.js`](app.js) executable, so now you can run `./app.js` directly.
* Rewrote how the Ngrok script reads Sails' config files (now uses Sails' internal config loader).
* Fixed Travis / Codecov integration (so now it's not running the test suite twice).
* Created the `enforceForeignKeys` config option, to make testing PRODUCTION locally easier.
* Changed the configuration for PRODUCTION's `DATA_ENCRYPTION_KEY`. Will now throw an error on boot if not supplied.
* Made [`bootstrap.js`](config/bootstrap.js) enforce use of either `app.js` or `ngrok.js` through detection of `NOT_FROM_SAILS_LIFT` environment variable.
* Created a new configuration file ([`config/ngrok.js`](config/ngrok.js)) for [ngrok.js](ngrok.js).
* Fixed relative links in README.
* Created the [`setup.js`](setup.js) script for easy interactive configuration.
* Made `npm run create:admin` interactive.
* Updated dependencies.

## [v4.3.1](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v4.3.0...v4.3.1) (2023-11-05)
### Features

* Removed [`@ngrok/ngrok`](https://npmjs.org/package/@ngrok/ngrok) from dependencies. Not supposed to be pre-installed.

## [v4.3.0](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v4.2.4...v4.3.0) (2023-11-04)
### Features

* Fixed the "create user" modal.
* Fixed the pagination bar when `pages` = 0.
* Added small css tweaks for light / dark theme transitions.
* Updated Node LTS version for docker / package.
* Removed `omit=optional` from `.npmrc`.
* Replaced code coverage files with [Codecov](https://codecov.io).
* Updated dependencies.

### Breaking Changes

* Replaced [`ngrok`](https://npmjs.org/package/ngrok) with official [`@ngrok/ngrok`](https://npmjs.org/package/@ngrok/ngrok) in [ngrok.js](ngrok.js).

## [v4.2.4](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v4.2.3...v4.2.4) (2023-10-30)
### Features

* Fixed Bootstrap build. (Missing dark-mode file.)
* Built light / dark / auto switch for admin.
* Updated dependencies.

## [v4.2.3](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v4.2.2...v4.2.3) (2023-10-03)
### Features

* Minor consistency tweaks.
* Added Discord button to README.
* Updated dependencies.

## [v4.2.2](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v4.2.1...v4.2.2) (2023-09-13)
### Features

* Added in a new configuration to enable/disable automatic request logging.
* Updated dependencies.

## [v4.2.1](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v4.2.0...v4.2.1) (2023-04-23)
### Features

* Removed optional dependencies from `package.json`, as the setup would remove optional dependencies when installing new packages without use of `--include=optional`...
* Changed use of `NGROK_URL` -> `BASE_URL`.
* Renamed `NGROK_AUTH` -> `NGROK_TOKEN` to avoid confusion with the `ngrok.js` config option `auth`.
* Added some Ngrok config options.
* Updated dependencies.

## [v4.2.0](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v4.1.1...v4.2.0) (2023-04-20)
### Features

* Built a script for [`Ngrok`](https://www.npmjs.com/package/ngrok), which will build assets, start Sails, and create an Ngrok tunnel (to the configured PORT).
* Built 2FA (2-Factor Authentication) capabilities.
* Added `appName` as a config option.
* Added `createdBy` to the [`User`](api/models/User.js) model.
* Added [`sails-hook-autoreload`](https://www.npmjs.com/package/sails-hook-autoreload) support (must manually install).
* Built session expiration handling.
* Built password changing modal / API.
* Made session data saving automatic, and work with both sessions / API tokens.
* Fixed some README quirks.
* Removed unneeded React imports (because of the Babel transform). For more info, [read this announcement (from 2020...)](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html).
* Updated React links to use their new domain.
* Removed `serve-static` in favor of `express.static`.
* Updated dependencies.

### Breaking Changes

* Moved CSRF secret storage from the `data` column, to its own column, so it can easily be encrypted/decrypted in the [`Session`](api/models/Session.js) model.
* Changed how API tokens are handled. So now, when using an API token, the ID must be given first, then the token, seperated by a colon.<br />Example: `Authorization` header is: `tokenID:apiToken` (or `Bearer tokenID:apiToken`). This is because `token` is now an encrypted column.
* Renamed `sails.helpers.updateCsrf` -> `sails.helpers.updateCsrfAndExpiry` to reflect the session expiry update.
* Renamed `req.requestId`/`env.req.requestId` -> `req.id`/`env.req.id` to better match general convention.
* Renamed `process.env` -> `appConfig` in the Webpack config (a variable used to pass data down to the frontend). What was I doing?!...

## [v4.1.1](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v4.1.0...v4.1.1) (2023-03-14)
### Features

* Fixed a stupid mistake in [`api/controllers/admin/get-users.js`](api/controllers/admin/get-users.js).
* Updated dependencies.

## [v4.1.0](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v4.0.1...v4.1.0) (2023-03-13)

### Features

* Alphabetized the scripts in `package.json`.
* Added custom configuration options to the main `README`.
* Updated dependencies.
* Reworked how tests are run, so they are a bit more organized in a nested tree for reporting.
* Added JSDoc comments to most helpers to aid with auto-completion (some helpers aren't meant to be used outside of automation).
* Added some `README` files to a few key folders.
* Added table of contents to README.

### Breaking Changes

* Renamed `sails.config.logSensitiveData` -> `sails.config.security.requestLogger.logSensitiveData`.
* Rewrote the [`keepModelsSafe` helper](api/helpers/keep-models-safe.js) to better handle dates (Javascript or Moment).
* Changed `sails.helpers.getErrorMessages` to be a synchronous function.
* Changed `sails.helpers.simplifyErrors` to be a synchronous function.
* Changed `sails.helpers.generateToken` to use `SHA512` instead of `SHA256`, doubling the size of tokens (64 -> 128).

### Future Plans

* Switching [`Moment.js`](https://momentjs.com) -> [`Luxon`](https://moment.github.io/luxon/) per [Moment's recommendations](https://momentjs.com/docs/#/-project-status/recommendations/). There are a few difference to be aware of: [https://moment.github.io/luxon/#/moment](https://moment.github.io/luxon/#/moment). Display formats are also different between the 2.

## [v4.0.1](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v4.0.0...v4.0.1) (2023-02-19)
### Features

* Updated GitHub CodeQL config.
* Regenerated package-lock.json to use version 3.
* Manually updated `package-lock.json` to clear `npm audit` issues.
* Updated dependencies.
* Updated Node min requirement to 18.14.

## [v4.0.0](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v3.2.1...v4.0.0) (2023-02-11)

### Features

* More work on automated tests and utilities.
* Updated dependencies.
* Removed `md5` / `sha1` / `uuid` packages, in favor of Node built-ins.

### Breaking Changes

* Renamed tests entry point (`test/hooks.js` -> `test/startTests.js`).

## [v3.2.1](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v3.2.0...v3.2.1) (2022-11-16)

### Features

* Downgraded SASS to prevent issues with deprecations.

## [v3.2.0](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v3.1.1...v3.2.0) (2022-11-16)

### Features

* Built out PnwedPasswords.com (HaveIBeenPwned.com) API functionality into `is-password-valid` helper.
* Can be disabled in [config/security.js](config/security.js).
* FINALLY removed the usage of `res._headers`, so no more annoying deprecation message.
* Simplified stored session data.
* Updated dependencies.

## [v3.1.1](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v3.1.0...v3.1.1) (2022-09-08)

### Features

* Made improvements to SASS files for new Bootstrap version.
* Updated dependencies.

## [v3.1.0](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v3.0.3...v3.1.0) (2022-09-05)

### Features

* Built start of new user management page, mostly for proof-of-concept purposes.
* Built "semi-smart" pagination front-end components. More tweaks are required.

## [v3.0.3](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v3.0.2...v3.0.3) (2022-08-18)

### Features

* Fixed an issue with `webpack-dev-server`'s reload issue with complex routes (/admin/dashboard would fail to render properly on reload).
* Updated usage of `substr` -> `substring` throughout the project.
* Updated dependencies (except Bootstrap v5.1.3 -> v5.2.0, because it fails to compile with SASS).

## [v3.0.2](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v3.0.1...v3.0.2) (2022-04-23)

### Features

* Rebuilt ENV variables table, again.
* Updated dependencies.

## [v3.0.1](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v3.0.0...v3.0.1) (2022-04-13)

### Features

* Created the `.travis.yml` file.

## [v3.0.0](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v2.0.0...v3.0.0) (2022-04-13)

### Features

* Fixed the reloading issue when using Webpack Dev Server.

## [v3.0.0-beta](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v2.0.0...v3.0.0-beta.7) (2022-03-19)

### Features

* Fixed this CHANGELOG (incorrect date).
* Updated Dockerfile and package.json to new Node LTS v16.13 requirement.
* Fixed a bug in the `forceUppercaseOnFirst` function in the [`User model`](api/models/User.js).
* Changed default connections to datastores to have SSL enabled (must now explicitly disable SSL connections for remote servers).
* Removed use of global model names, in-favor of `sails.models` usage (for consistency, and to more easily allow disabling of global models).

### Breaking Changes

* Updated to React v18. See: [the upgrade guide to React 18](https://react.dev/blog/2022/03/08/react-18-upgrade-guide).
* Updated to React Router DOM v6. See: [the v5 -> v6 migration guide](https://reactrouter.com/docs/en/v6/upgrading/v5). This requires a **MAJOR** overhaul of how routes are handled.
* Moved some controllers into a "common" folder, instead of the "admin" folder (as they could be used outside of admin controls).

### Known Issues

* There is an issue with the Webpack dev server, and the way React routes are handled. Currently, if you aren't loading from an entry point (like /admin), and you refresh the page (on like /admin/dashboard), nothing renders. While this is not an issue for built assets, it is an issue if you are working with the auto-reload dev server. I'm still working on a fix for this, and suspect it's an issue from moving to the new React Router.

## [v2.0.0](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v1.9.0...v2.0.0) (2021-10-24)

### Features

* Updated all dependencies to most recent versions.
* Built out more tests to get better coverage.
* Created this CHANGELOG.

### Breaking Changes

* Updated to Bootstrap v5 and React-Bootstrap v2. There are several **breaking changes** between [Bootstrap v4](https://getbootstrap.com/docs/4.6) and [Bootstrap v5](https://getbootstrap.com/docs/5.1), see the [migration documentation](https://getbootstrap.com/docs/5.1/migration/) for the complete list of breaking changes. Also see [the React-Bootstrap migration guide](https://react-bootstrap.github.io/migrating/).
* Changed default connections to datastores to have SSL enabled (must now explicitly disable SSL connections for remote servers).

## [v1.9.0](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v1.8.1...v1.9.0) (2020-08-30)

### Features

* Created a better handling of the custom API layer for React. Removed need for `<APIConsumer>` in favor of state.
* Updated the React demo to use a navbar.

### Breaking Changes

* Removed `<APIConsumer>`. Must now pass around a state property (or some other form of variable).

## [v1.8.1](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v1.8.0...v1.8.1) (2020-08-30)

### Features

* Created API token handling (bearer tokens). Should only be used over HTTPs or for local testing tools.
* Added a `<noscript>` message to the entry template.

## [v1.8.0](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v1.7.0...v1.8.0) (2020-08-26)

### Features

* Removed need for EJS to have Sails serve the different entry points (marketing vs admin).

## [v1.7.0](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v1.6.0...v1.7.0) (2020-08-25)

### Features

* Created pagination helpers; one for model queries, one for API output.
* Created README in `.idea` (IntelliJ) folder.

## [v1.6.0](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v1.5.2...v1.6.0) (2020-08-16)

### Features

* Created `Dockerfile`.
* Added a few more comments.
* Updated NPM packages.
* Built better testing for project hook.

## [v1.5.2](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v1.5.1...v1.5.2) (2020-08-10)

### Features

* Fixed webpack config.
* Made `isLoggedIn` policy clear cookie if not logged in.

<br/><br/>

#### This changelog is incomplete, as it was not started until **v2** (and rehashing that far back in the past is a lot of work for very little gain, the commits are there). I've gone as far back as this template became "popular" (people other than me began to clone it).
