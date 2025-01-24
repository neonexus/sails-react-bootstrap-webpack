# React Source Files

This is where our React source files live.

## Things to note

* The 2 files in the root of this directory are Webpack entry points. These files are the starting point for our React apps.
* The `common` folder is where shared, custom components should live.
* The `data` folder is where React contexts live. See: https://react.dev/learn/passing-data-deeply-with-context
* The capitalized folders, like `Admin` and `Main` are "app" folders. `admin.jsx` mainly uses the `Admin` folder (`/admin`), `main.jsx` uses `Main` (`/main`); the lower-cased folders are communal.
