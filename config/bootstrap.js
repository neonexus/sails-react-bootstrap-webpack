/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

// Use this for headers: http://patorjk.com/software/taag/#p=display&c=c&f=ANSI%20Shadow&t=Sails
// Use this for subheaders: http://patorjk.com/software/taag/#p=display&c=c&f=Calvin%20S&t=Woot

module.exports.bootstrap = function(next) {
    // Check if we need to validate our schema
    if (sails.config.models.validateOnBootstrap && sails.config.models.migrate === 'safe') { // aka PRODUCTION
        let waitingToFinish = 0;

        _.forEach(sails.models, (model, modelName) => {
            if (model.tableName !== 'archive') {
                waitingToFinish++;

                sails.sendNativeQuery('SHOW COLUMNS FROM `' + model.tableName + '`', (err, columns) => {
                    if (err) {
                        console.error(err);

                        return console.error('Table "' + model.tableName + '" does not seem to exist.');
                    }

                    let i; // we use this to make sure there aren't too many columns in the database
                    let continueOn = true;

                    function notWhatWasExpected(column, foundAt, expected) {
                        continueOn = false;
                        console.error('Column "' + column + '" for "' + modelName + '" is type "' + columns.rows[foundAt].Type + '", expected it to be a(n) ' + expected);
                    }

                    // check if the model field exists in the database
                    for (let column in model.schema) {
                        // verify this isn't a special/magical property or a collection
                        // eslint-disable-next-line no-prototype-builtins
                        if (model.schema.hasOwnProperty(column) && !model.schema[column].collection) {
                            let foundAt = null;

                            for (i = 0; i < columns.rows.length; i++) {
                                if (columns.rows[i].Field === column) {
                                    foundAt = i;
                                    break;
                                }
                            }

                            /***
                             *    ┌─┐┌─┐┬  ┬ ┬┌┬┐┌┐┌  ┬┌─┐  ┌┬┐┬┌─┐┌─┐┬┌┐┌┌─┐
                             *    │  │ ││  │ │││││││  │└─┐  ││││└─┐└─┐│││││ ┬
                             *    └─┘└─┘┴─┘└─┘┴ ┴┘└┘  ┴└─┘  ┴ ┴┴└─┘└─┘┴┘└┘└─┘
                             */
                            if (foundAt === null) {
                                console.error('Column "' + column + '" does not exist in database for "' + modelName + '"');
                                continueOn = false;

                                break;
                            }

                            // validate the types of columns are correct in the database
                            switch (model.schema[column].type) {
                                /***
                                 *    ┌┐┌┬ ┬┌┬┐┌┐ ┌─┐┬─┐
                                 *    ││││ ││││├┴┐├┤ ├┬┘
                                 *    ┘└┘└─┘┴ ┴└─┘└─┘┴└─
                                 */
                                case 'number':
                                    if (model.schema[column].autoMigrations.columnType === '_numberkey') {
                                        /***
                                         *    ┬┌─┐  ┬┌┬┐  ┬ ┬┌┐┌┌─┐┬┌─┐┌┐┌┌─┐┌┬┐┌─┐
                                         *    │└─┐  │ │   │ ││││└─┐││ ┬│││├┤  ││ ┌┘
                                         *    ┴└─┘  ┴ ┴   └─┘┘└┘└─┘┴└─┘┘└┘└─┘─┴┘ o
                                         */
                                        if (columns.rows[foundAt].Type !== 'int(11) unsigned') {
                                            notWhatWasExpected(column, foundAt, 'int(11) unsigned');
                                        }

                                        /***
                                         *    ┌┬┐┌─┐┌─┐┌─┐  ┬┌┬┐  ┬┌┐┌┌─┐┬─┐┌─┐┌┬┐┌─┐┌┐┌┌┬┐┌─┐
                                         *     │││ │├┤ └─┐  │ │   │││││  ├┬┘├┤ │││├┤ │││ │  ┌┘
                                         *    ─┴┘└─┘└─┘└─┘  ┴ ┴   ┴┘└┘└─┘┴└─└─┘┴ ┴└─┘┘└┘ ┴  o
                                         */
                                        if (model.schema[column].autoMigrations.autoIncrement && columns.rows[foundAt].Extra !== 'auto_increment') {
                                            notWhatWasExpected(column, foundAt, 'int(11) unsigned (auto_increment)');
                                        }
                                    } else {
                                        /***
                                         *    ┌┬┐┌─┐┌┬┐┌─┐┬    ┬┌─┐  ┌┬┐┬┌─┐┌─┐┬┌┐┌┌─┐  ┌─┐┌─┐┬  ┬ ┬┌┬┐┌┐┌  ┌┬┐┬ ┬┌─┐┌─┐
                                         *    ││││ │ ││├┤ │    │└─┐  ││││└─┐└─┐│││││ ┬  │  │ ││  │ │││││││   │ └┬┘├─┘├┤
                                         *    ┴ ┴└─┘─┴┘└─┘┴─┘  ┴└─┘  ┴ ┴┴└─┘└─┘┴┘└┘└─┘  └─┘└─┘┴─┘└─┘┴ ┴┘└┘   ┴  ┴ ┴  └─┘
                                         */
                                        if (model.schema[column].autoMigrations.columnType === '_number') {
                                            notWhatWasExpected(column, foundAt, 'MODEL IS MISSING COLUMN TYPE');
                                        }

                                        /***
                                         *    ┌┬┐┌─┐  ┌┬┐┬ ┬┌─┐┌─┐┌─┐  ┌┬┐┌─┐┌┬┐┌─┐┬ ┬┌─┐
                                         *     │││ │   │ └┬┘├─┘├┤ └─┐  │││├─┤ │ │  ├─┤ ┌┘
                                         *    ─┴┘└─┘   ┴  ┴ ┴  └─┘└─┘  ┴ ┴┴ ┴ ┴ └─┘┴ ┴ o
                                         */
                                        if (model.schema[column].autoMigrations.columnType !== '_number' && model.schema[column].autoMigrations.columnType !== columns.rows[foundAt].Type) {
                                            notWhatWasExpected(column, foundAt, model.schema[column].autoMigrations.columnType);
                                        }
                                    }

                                    break;
                                /***
                                 *    ┌─┐┌┬┐┬─┐┬┌┐┌┌─┐
                                 *    └─┐ │ ├┬┘│││││ ┬
                                 *    └─┘ ┴ ┴└─┴┘└┘└─┘
                                 */
                                case 'string':
                                    /***
                                     *    ┬┌─┐  ┌┬┐┌─┐┌─┐┌─┐┬ ┬┬ ┌┬┐  ┌─┐┌┬┐┬─┐┬┌┐┌┌─┐  ┌─┐┬┌─┐┌─┐┌─┐
                                     *    │└─┐   ││├┤ ├┤ ├─┤│ ││  │   └─┐ │ ├┬┘│││││ ┬  └─┐│┌─┘├┤  ┌┘
                                     *    ┴└─┘  ─┴┘└─┘└  ┴ ┴└─┘┴─┘┴   └─┘ ┴ ┴└─┴┘└┘└─┘  └─┘┴└─┘└─┘ o
                                     */
                                    if (model.schema[column].autoMigrations.columnType === '_string' && columns.rows[foundAt].Type !== 'varchar(191)') {
                                        notWhatWasExpected(column, foundAt, 'varchar(191)');
                                    }

                                    /***
                                     *    ┌┬┐┌─┐  ┌┬┐┬ ┬┌─┐┌─┐┌─┐  ┌┬┐┌─┐┌┬┐┌─┐┬ ┬┌─┐
                                     *     │││ │   │ └┬┘├─┘├┤ └─┐  │││├─┤ │ │  ├─┤ ┌┘
                                     *    ─┴┘└─┘   ┴  ┴ ┴  └─┘└─┘  ┴ ┴┴ ┴ ┴ └─┘┴ ┴ o
                                     */
                                    if (model.schema[column].autoMigrations.columnType.substr(0, 7) === 'varchar' && model.schema[column].autoMigrations.columnType !== columns.rows[foundAt].Type) {
                                        notWhatWasExpected(column, foundAt, model.schema[column].autoMigrations.columnType);
                                    }

                                    /***
                                     *    ┬┌─┐  ┌┬┐┌─┐┌┬┐┌─┐┌┬┐┬┌┬┐┌─┐┌─┐
                                     *    │└─┐   ││├─┤ │ ├┤  │ ││││├┤  ┌┘
                                     *    ┴└─┘  ─┴┘┴ ┴ ┴ └─┘ ┴ ┴┴ ┴└─┘ o
                                     */
                                    if (model.schema[column].autoMigrations.columnType === 'datetime' && columns.rows[foundAt].Type !== 'datetime') {
                                        notWhatWasExpected(column, foundAt, 'datetime');
                                    }

                                    /***
                                     *    ┬┌─┐  ┌┬┐┌─┐┌┬┐┌─┐┌─┐
                                     *    │└─┐   ││├─┤ │ ├┤  ┌┘
                                     *    ┴└─┘  ─┴┘┴ ┴ ┴ └─┘ o
                                     */
                                    if (model.schema[column].autoMigrations.columnType === 'date' && columns.rows[foundAt].Type !== 'date') {
                                        notWhatWasExpected(column, foundAt, 'date');
                                    }

                                    /***
                                     *    ┬┌─┐  ┌┬┐┬┌┬┐┌─┐┌─┐
                                     *    │└─┐   │ ││││├┤  ┌┘
                                     *    ┴└─┘   ┴ ┴┴ ┴└─┘ o
                                     */
                                    if (model.schema[column].autoMigrations.columnType === 'time' && columns.rows[foundAt].Type !== 'time') {
                                        notWhatWasExpected(column, foundAt, 'time');
                                    }

                                    break;
                                /***
                                 *    ┌┐ ┌─┐┌─┐┬  ┌─┐┌─┐┌┐┌
                                 *    ├┴┐│ ││ ││  ├┤ ├─┤│││
                                 *    └─┘└─┘└─┘┴─┘└─┘┴ ┴┘└┘
                                 */
                                case 'boolean':
                                    if (columns.rows[foundAt].Type !== 'tinyint(1)') {
                                        notWhatWasExpected(column, foundAt, 'boolean (tinyint)');
                                    }

                                    break;
                                /***
                                 *     ┬┌─┐┌─┐┌┐┌
                                 *     │└─┐│ ││││
                                 *    └┘└─┘└─┘┘└┘
                                 */
                                case 'json':
                                    if (columns.rows[foundAt].Type !== 'longtext') {
                                        notWhatWasExpected(column, foundAt, 'json (longtext)');
                                    }

                                    break;
                                /***
                                 *    ┬─┐┌─┐┌─┐
                                 *    ├┬┘├┤ ├┤
                                 *    ┴└─└─┘└
                                 */
                                case 'ref':
                                    if (model.schema[column].autoMigrations.columnType !== columns.rows[foundAt].Type) {
                                        notWhatWasExpected(column, foundAt, model.schema[column].autoMigrations.columnType);
                                    }

                                    break;
                                /***
                                 *    ┬ ┬┌┐┌┬┌─┌┐┌┌─┐┬ ┬┌┐┌
                                 *    │ ││││├┴┐││││ │││││││
                                 *    └─┘┘└┘┴ ┴┘└┘└─┘└┴┘┘└┘
                                 */
                                default:
                                    continueOn = false;
                                    console.error('Column definition type "' + model.schema[column].type + '" does not have any safety checks! HALTING EXECUTION FOR SAFETY!');
                                    break;
                            }

                            /***
                             *    ┬┌─┐  ┬┌┬┐  ┬ ┬┌┐┌┬┌─┐ ┬ ┬┌─┐┌─┐
                             *    │└─┐  │ │   │ ││││││─┼┐│ │├┤  ┌┘
                             *    ┴└─┘  ┴ ┴   └─┘┘└┘┴└─┘└└─┘└─┘ o
                             */
                            if (model.schema[column].autoMigrations.unique === true && columns.rows[foundAt].Key !== 'UNI' && columns.rows[foundAt].Key !== 'PRI') {
                                console.error('Column "' + column + '" is not marked as "unique" in database schema for "' + modelName + '"');
                                continueOn = false;
                            }

                            /***
                             *    ┬┌─┐  ┬┌┬┐  ┌─┐┬─┐┬┌┬┐┌─┐┬─┐┬ ┬┌─┐
                             *    │└─┐  │ │   ├─┘├┬┘││││├─┤├┬┘└┬┘ ┌┘
                             *    ┴└─┘  ┴ ┴   ┴  ┴└─┴┴ ┴┴ ┴┴└─ ┴  o
                             */
                            if (column === model.primaryKey && columns.rows[foundAt].Key !== 'PRI') {
                                console.error('Column "' + column + '" is not marked as the "primary key" in database schema for "' + modelName + '"');
                                continueOn = false;
                            }
                        }
                    }

                    /***
                     *    ┌┬┐┌─┐┌─┐  ┌┬┐┌─┐┌┐┌┬ ┬  ┌─┐┌─┐┬  ┬ ┬┌┬┐┌┐┌┌─┐  ┬┌┐┌  ┌┬┐┌┐┌─┐
                     *     │ │ ││ │  │││├─┤│││└┬┘  │  │ ││  │ │││││││└─┐  ││││   ││├┴┐┌┘
                     *     ┴ └─┘└─┘  ┴ ┴┴ ┴┘└┘ ┴   └─┘└─┘┴─┘└─┘┴ ┴┘└┘└─┘  ┴┘└┘  ─┴┘└─┘o
                     */
                    for (i = 0; i < columns.rows.length; i++) {
                        if (!model.schema[columns.rows[i].Field]) {
                            console.error('Extra column "' + columns.rows[i].Field + '" found for ' + modelName);
                            continueOn = false;
                        }
                    }

                    if (continueOn) {
                        waitingToFinish--;
                    }
                });
            }
        });

        let movedOn = false;

        (function waitForSchemaChecks() {
            setTimeout(() => {
                if (waitingToFinish === 0 && movedOn === false) {
                    // everything has finished, no red flags yet, move on...
                    validateIndexes();
                    movedOn = true;
                } else if (movedOn !== true) {
                    waitForSchemaChecks();
                }
            }, 20);
        })();

        // something is taking WAY too long... assume the worst... BAIL!
        setTimeout(() => {
            if (waitingToFinish > 0) {
                console.error('The database schema does not appear to match the model definitions.');
                process.exit(1);
            }
        }, 5000);
    } else {
        /***
         *    ┌┐┌┌─┐┌┬┐  ┌─┐┬─┐┌─┐┌┬┐┬ ┬┌─┐┌┬┐┬┌─┐┌┐┌
         *    ││││ │ │   ├─┘├┬┘│ │ │││ ││   │ ││ ││││
         *    ┘└┘└─┘ ┴   ┴  ┴└─└─┘─┴┘└─┘└─┘ ┴ ┴└─┘┘└┘
         */

        // no safety requirement for database modifications, bypass safeties
        return next();
    }

    function validateIndexes() {
        let waitingToFinish = 0;

        _.forEach(sails.models, (model, modelName) => {
            if (model.tableName !== 'archive' && model.associations && model.associations.length) {
                model.associations.map((association) => {
                    waitingToFinish++;

                    // make sure this isn't a collection
                    if (!association.collection) {
                        /***
                         *    ┌─┐┌─┐┌┬┐  ┌─┐┌─┐┬─┐┌─┐┬┌─┐┌┐┌  ┬┌─┌─┐┬ ┬┌─┐
                         *    │ ┬├┤  │   ├┤ │ │├┬┘├┤ ││ ┬│││  ├┴┐├┤ └┬┘└─┐
                         *    └─┘└─┘ ┴   └  └─┘┴└─└─┘┴└─┘┘└┘  ┴ ┴└─┘ ┴ └─┘
                         */
                        sails.sendNativeQuery(
                            'SELECT * FROM `information_schema`.`KEY_COLUMN_USAGE` WHERE `TABLE_NAME` = \'' + model.tableName
                            + '\' AND `COLUMN_NAME` = \'' + association.alias
                            + '\' AND `REFERENCED_TABLE_NAME` = \'' + sails.models[association.model].tableName
                            + '\'',
                            (err, foundKeys) => {
                                if (err) {
                                    console.error(err);

                                    console.error('I can\'t seem to read the required relationship data. HALTING!');

                                    return process.exit(1);
                                }

                                if (!foundKeys.rows[0] || !foundKeys.rows[0]['REFERENCED_COLUMN_NAME'] || foundKeys.rows[0]['REFERENCED_COLUMN_NAME'] !== sails.models[association.model].primaryKey) {
                                    /***
                                     *    ┌┐┌┌─┐  ┬─┐┌─┐┬  ┌─┐┌┬┐┬┌─┐┌┐┌┌─┐┬ ┬┬┌─┐  ┌─┐┌─┐┬ ┬┌┐┌┌┬┐
                                     *    ││││ │  ├┬┘├┤ │  ├─┤ │ ││ ││││└─┐├─┤│├─┘  ├┤ │ ││ ││││ ││
                                     *    ┘└┘└─┘  ┴└─└─┘┴─┘┴ ┴ ┴ ┴└─┘┘└┘└─┘┴ ┴┴┴    └  └─┘└─┘┘└┘─┴┘
                                     */
                                    console.error('Column "' + association.alias + '" for "' + modelName + '" does not have a relationship setup');
                                } else {
                                    /***
                                     *    ┬─┐┌─┐┬  ┌─┐┌┬┐┬┌─┐┌┐┌┌─┐┬ ┬┬┌─┐  ┌─┐┌─┐┬ ┬┌┐┌┌┬┐
                                     *    ├┬┘├┤ │  ├─┤ │ ││ ││││└─┐├─┤│├─┘  ├┤ │ ││ ││││ ││
                                     *    ┴└─└─┘┴─┘┴ ┴ ┴ ┴└─┘┘└┘└─┘┴ ┴┴┴    └  └─┘└─┘┘└┘─┴┘
                                     */
                                    waitingToFinish--;
                                }
                            }
                        );
                    } else {
                        /***
                         *    ┬ ┬┌─┐┌─┐  ┌─┐┌─┐┬  ┬  ┌─┐┌─┐┌┬┐┬┌─┐┌┐┌
                         *    │││├─┤└─┐  │  │ ││  │  ├┤ │   │ ││ ││││
                         *    └┴┘┴ ┴└─┘  └─┘└─┘┴─┘┴─┘└─┘└─┘ ┴ ┴└─┘┘└┘
                         */
                        waitingToFinish--;
                    }
                });
            }
        });

        (function waitForIndexChecks() {
            setTimeout(() => {
                if (waitingToFinish === 0) {
                    return next();
                } else {
                    waitForIndexChecks();
                }
            }, 10);
        })();

        setTimeout(() => {
            if (waitingToFinish > 0) {
                console.error('The database schema is missing foreign key indexes.');
                process.exit(1);
            }
        }, 3000);
    }
};
