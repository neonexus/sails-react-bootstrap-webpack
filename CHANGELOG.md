# Changelog

This changelog is incomplete, as it was not started until **v2** (and rehashing that far back in the past is a lot of work for very little gain). I've gone as far back as this template became "popular" (people other than me began to clone it).

# [v2.0.0](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v1.9.0...v2.0.0) (2021-99-99)

### Features

* Updated to Bootstrap v5. There are several **breaking changes** between [Bootstrap v4](https://getbootstrap.com/docs/4.6) and [Bootstrap v5](https://getbootstrap.com/docs/5.1), see the [migration documentation](https://getbootstrap.com/docs/5.1/migration/) for the complete list of breaking changes.
* Updated all dependencies to most recent versions.
* Built out more tests to get better coverage.
* Created this CHANGELOG.

# [v1.9.0](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v1.8.1...v1.9.0) (2020-08-30)

### Features

* Created a better handling of the custom API layer for React. Removed need for `<APIConsumer>` in favor of state.
* Updated the React demo to use a navbar.

### Breaking Changes

* Removed `<APIConsumer>`. Must now pass around a state property (or some other form of variable).

# [v1.8.1](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v1.8.0...v1.8.1) (2020-08-30)

### Features

* Created API token handling (bearer tokens). Should only be used over HTTPs or for local testing tools.
* Added a `<noscript>` message to the entry template.

# [v1.8.0](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v1.7.0...v1.8.0) (2020-08-26)

### Features

* Removed need for EJS to have Sails serve the different entry points (marketing vs admin).

# [v1.7.0](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v1.6.0...v1.7.0) (2020-08-25)

### Features

* Created pagination helpers; one for model queries, one for API output.
* Created README in `.idea` (IntelliJ) folder.

# [v1.6.0](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v1.5.2...v1.6.0) (2020-08-16)

### Features

* Created `Dockerfile`.
* Added a few more comments.
* Updated NPM packages.
* Built better testing for project hook.

# [v1.5.2](https://github.com/neonexus/sails-react-bootstrap-webpack/compare/v1.5.1...v1.5.2) (2020-08-10)

### Features

* Fixed webpack config.
* Made `isLoggedIn` policy clear cookie if not logged in.
