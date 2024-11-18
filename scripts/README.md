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
                    <li>NONE (interactive)</li>
                </ul>
            </td>
            <td>
                Create an ADMIN user in the configured datastore. Can only be run once. For safety, if there is an active admin user found, the script will halt. The API endpoints must be used from that point forward.
            </td>
        </tr>
        <tr>
            <td><pre><code>sails run datastore-wipe</code></pre></td>
            <td nowrap><a href="datastore-wipe.js">datastore-wipe.js</a></td>
            <td><ul><li>NONE</li></ul></td>
            <td>Wipe the entire datastore this instance is connected to. Will be asked multiple, random questions to prevent disaster.<br /><br />WILL NEVER RUN ON PRODUCTION FOR SAFETY REASONS!</td>
        </tr>
    </tbody>
</table>

### Useful Links

[Sails documentation for shell scripts](https://sailsjs.com/documentation/concepts/shell-scripts)
