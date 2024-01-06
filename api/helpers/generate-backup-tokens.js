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
        let token = sails.helpers.generateToken();
        let backupTokens = [];

        let last = null;
        for (let i = 0; i < 10; ++i) {
            do {
                // Regenerate the token if this is our second time around in the do...while loop.
                if (last === i) {
                    token = sails.helpers.generateToken();
                } else {
                    last = i;
                }

                backupTokens[i] = token.substring(i * 8, (i * 8) + 8);
            } while (!isNaN(backupTokens[i])); // Don't let pure number tokens through. They MUST have at least 1 letter.
        }

        return exits.success(backupTokens);
    }
};
