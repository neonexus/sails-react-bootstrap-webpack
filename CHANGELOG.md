# Changelog

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

* Updated to React v18. See: [the upgrade guide to React 18](https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html).
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

This changelog is incomplete, as it was not started until **v2** (and rehashing that far back in the past is a lot of work for very little gain, the commits are there). I've gone as far back as this template became "popular" (people other than me began to clone it).
