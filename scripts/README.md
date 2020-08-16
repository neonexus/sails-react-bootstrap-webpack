# Scripts

To run scripts in Sails >= v1, one just needs to `sails run SCRIPT_NAME`, where `SCRIPT_NAME` is the file name (minus extension) in the `scripts` folder.

## Current Scripts

<table>
    <thead>
        <th>Script Name</th>
        <th>Command</th>
        <th>Inputs</th>
        <th>Description</th>
    </thead>
    <tbody>
        <td nowrap>Create Admin</td>
        <td nowrap><code>sails run create-admin</code></td>
        <td nowrap>
            <ul>
                <li><code>--email='user@domain.com'</code></li>
                <li><code>--firstName='First'</code></li>
                <li><code>--lastName='Last'</code></li>
                <li><code>--password='myPass'</code></li>
            </ul>
        </td>
        <td>
            Create an ADMIN user in the configured datastore. Can only be run once; for safety, if there is an active admin user found, the script will halt. The API endpoints must be used from that point forward.
        </td>
    </tbody>
</table>

### Useful Links

[Sails documentation for shell scripts](https://sailsjs.com/documentation/concepts/shell-scripts)
