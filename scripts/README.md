# Scripts

To run scripts in Sails >v1, one just needs to `sails run SCRIPT_NAME`, where `SCRIPT_NAME` is the file name in the `scripts` folder.

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
        <td nowrap>`sails run create-admin`</td>
        <td nowrap>
            <ul>
                <li>`--email='user@domain.com'`</li>
                <li>`--firstName='First'`</li>
                <li>`--lastName='Last'`</li>
                <li>`--password='myPass'`</li>
            </ul>
        </td>
        <td>
            Create an ADMIN user in the configured datastore. Can only be run once; for safety, if there is an active admin user found, the script will halt. The API endpoints must be used from that point forward.
        </td>
    </tbody>
</table>
