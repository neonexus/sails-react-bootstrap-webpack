# Scripts

To run scripts in Sails, one just needs to `sails run SCRIPT_NAME`, where `SCRIPT_NAME` is the file name (minus extension) in the `scripts` folder.

## Current Scripts

<table>
    <thead>
        <th>Command</th>
        <th>File</th>
        <th>Inputs</th>
        <th>Description</th>
    </thead>
    <tbody>
        <tr>
            <td><pre><code>sails run create-admin</code></pre></td>
            <td nowrap><a href="create-admin.js">create-admin.js</a></td>
            <td>
                <ul>
                    <li><code>email</code></li>
                    <li><code>firstName</code></li>
                    <li><code>lastName</code></li>
                    <li><code>password</code></li>
                </ul>
            </td>
            <td>
                Create an ADMIN user in the configured datastore. Can only be run once. For safety, if there is an active admin user found, the script will halt. The API endpoints must be used from that point forward.
            </td>
        </tr>
    </tbody>
</table>

### Useful Links

[Sails documentation for shell scripts](https://sailsjs.com/documentation/concepts/shell-scripts)
