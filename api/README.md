# API

This is where all API controllers, custom hooks, helpers, models, policies and responses live.

## Controllers

Controllers handle API requests, and decide how to respond, using the custom responses, which track API requests in our datastore.

## Helpers

Helpers are generic, reusable functions used by multiple controllers (or hooks, policies, etc).

## Hooks

Custom hooks (currently only the 1), are used to tap into different parts of a request. The custom hook setup in this repo, is designed to start recording an API request, while the custom responses finalize the record.

## Models

The data models inform Sails (really Waterline) how to create / modify tables (if `sails.config.models.migrate === 'alter'`), or our custom [schema validation and enforcement](../README.md#schema-validation-and-enforcement) on how it should behave.

## Policies

Policies are simple functions, that determine if a request should continue, or fail. These are configured in [`config/policies.js`](../config/policies.js)

## Responses

These custom responses handle the final leg of request logging. They are responsible for ensuring data isn't leaked, by utilizing the `customToJSON` functionality of models.
