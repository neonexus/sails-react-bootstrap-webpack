# Configuration

The majority of configuration files live in this folder. `local.js.sample` is intended to be copied to `local.js` (which is Git ignored), which will override anything in the `env` folder (defaults to `env/development.js`).

## Things to keep in-mind

* NEVER store credentials, security keys, session secrets, etc in Git-tracked files!
* `bootstrap.js` Has nothing to do with the CSS framework Bootstrap. It is actually the last file Sails runs before being fully "lifted". Currently, this repo uses this file for schema validation and enforcement on production servers. Read more about this in the main [README](../README.md#schema-validation-and-enforcement).

### Useful Links

* [Sails documentation for configuration](https://sailsjs.com/documentation/concepts/configuration)
* [Sails bootstrap documentation](https://sailsjs.com/documentation/reference/configuration/sails-config-bootstrap)
