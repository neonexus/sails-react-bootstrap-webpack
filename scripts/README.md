# Scripts

To run scripts in Sails >v1, one just needs to `sails run SCRIPT_NAME`, where `SCRIPT_NAME` is the file name in the `scripts` folder.

## Current Scripts

Script Name     | Command | Inputs | Description
----------------|---------|--------|-----
Create Admin    | `sails run create-admin` | <ul><li>`--email='user@domain.com'`</li><li>`--firstName='First'`</li><li>`--lastName='Last'`</li><li>`--password='myPass'`</li> | Create an ADMIN user in the configured datastore. Can only be run once; for safety, if there is an active admin user found, the script will halt. The API endpoints must be used from that point forward.
