# Sails.js Views

Generally speaking, you do not want to modify files in this folder. You likely want [`../assets/src`](../assets/src) folder, where the React source files live.

The homepage [`pages/homepage.ejs`](pages/homepage.ejs) is setup so we can serve multiple React apps via Sails (recommended to use Nginx or some proxy to just read from `.tmp/public/REACT_APP` after running `npm run build`).

The error pages are still in-use, when appropriate however, and you will likely want to modify those.
