const prompts = require('prompts');

module.exports = {
    friendlyName: 'Datastore Wipe',

    description: 'Wipe all data on all the datastores. WILL NOT run on PRODUCTION. VERY DANGEROUS!!!',

    inputs: {},

    exits: {
        canceled: {
            description: 'Datastore wipe was canceled.'
        },
        success: {
            description: 'Success! THIS DATASTORE IS CLEAN.'
        },
        production: {
            description: 'You CAN NOT run this program on a PRODUCTION environment.'
        }
    },

    fn: async (inputs, exits) => {
        if ((process.env.NODE_ENV && process.env.NODE_ENV.toUpperCase() === 'PRODUCTION') || sails.config.models.migrate.toLowerCase() === 'safe') {
            return exits.production();
        }

        // A word for every letter.
        const randomWords = [
            'Vanilla',
            'Fluffy',
            'Ultimate',
            'Longitude',
            'Zenith',
            'Inquisitive',
            'Dimple',
            'Spectrum',
            'Gargoyle',
            'Bobcat',
            'Official',
            'Winning',
            'Ephemeral',
            'Young',
            'Train',
            'Mingle',
            'Joint',
            'Cascade',
            'Rabbit',
            'Prelude',
            'Quiet',
            'Halo',
            'Nickel',
            'Kilometer',
            'Xenon',
            'Apple',
        ];

        const chosenOne = Math.floor(Math.random() * randomWords.length);

        let notChosenOne;
        do {
            notChosenOne = Math.floor(Math.random() * randomWords.length);
        } while (notChosenOne === chosenOne);

        const answers = await prompts([
            {
                message: 'Do you wish to wipe all of the data from the connected datastore(s)?',
                name: 'sureConfirm',
                type: 'confirm',
                initial: false
            }, {
                message: 'ARE YOU ABSOLUTELY SURE? THIS CAN NOT BE UNDONE! YOU WILL LOSE EVERYTHING! ALL DATA WILL BE ERASED!',
                name: 'sureToggle',
                type: (prev) => {
                    if (prev) {
                        console.log('');

                        return 'toggle';
                    }

                    return null;
                },
                initial: false,
                inactive: 'NO, CANCEL',
                active: 'YES, I\'M SURE'
            }, {
                message: 'FINAL FAILSAFE VERIFICATION. In order to erase everything, you must select the word "' + randomWords[chosenOne] + '":',
                name: 'sureSelect',
                type: (prev) => {
                    if (prev) {
                        console.log('');

                        return 'select';
                    }

                    return null;
                },
                initial: notChosenOne,
                choices: randomWords
            }
        ]);

        if (!answers.sureConfirm || !answers.sureToggle || answers.sureSelect !== chosenOne) {
            console.log('');

            return exits.canceled();
        }

        // It's a bit more than 10 seconds...
        console.log('\nYOU NOW HAVE 10 SECONDS TO CHANGE YOUR MIND, BEFORE ALL DATA IS DESTROYED...\n');
        await sleep(2500);
        console.log('10');
        await sleep();
        console.log('9');
        await sleep();
        console.log('8');
        await sleep();
        console.log('7');
        await sleep();
        console.log('6');
        await sleep();
        console.log('\nI REALLY HOPE YOU KNOW WHAT YOU ARE DOING!!!\n');
        await sleep(2500);
        console.log('5');
        await sleep();
        console.log('4');
        await sleep();
        console.log('3');
        await sleep();
        console.log('2');
        await sleep();
        console.log('1');
        await sleep();

        console.log('\nNO GOING BACK NOW!!!');
        await sleep();
        console.log('ALL DATA IS BEING ERASED!!!\n');
        await sleep();

        const modelsToDestroy = [];

        _.forEach(sails.models, (model, modelName) => {
            modelsToDestroy.push(modelName);
            modelsToDestroy.push(model.destroy({}));
        });

        for(let i = 0; i < modelsToDestroy.length; i = i + 2) {
            console.log(modelsToDestroy[i]);
            await modelsToDestroy[i + 1];
        }

        return exits.success('\nThe datastore(s) are clean.\n');
    }
};

async function sleep(napTime = 1000) {
    await new Promise(resolve => setTimeout(resolve, napTime));
}
