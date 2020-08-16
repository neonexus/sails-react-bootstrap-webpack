# Custom Responses

Here are the custom responses, used to capture the final leg of a request for logging, including run time.

These responses are also responsible for running the [`keepModelsSafe`](../helpers/keep-models-safe.js) helper, to prevent leaking of sensitive info, by utilizing the `customToJSON` functionality of models.
