/**
 * Generate Backup Tokens
 * @function sails.helpers.generateBackupTokens
 *
 * @returns {Array} An array of 10 backup tokens.
 */
module.exports = {
    friendlyName: 'Generate Backup Tokens',

    description: 'Generate 10 backup 2FA tokens.',

    sync: true, // Not an async function.

    exits: {},

    fn: (inputs, exits) => {
        const token = sails.helpers.generateToken();
        let backupTokens = [];

        for (let i = 0; i < 10; ++i) {
            backupTokens[i] = token.substring(i * 8, (i * 8) + 8);
        }

        return exits.success(backupTokens);
    }
};
