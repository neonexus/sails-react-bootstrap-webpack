/**
 * This is the file that bootstraps needed tools for testing.
 * Everything starts in this file.
 */

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
global.chai = require('chai');

chai.use(require('chai-spies'));
chai.use(require('chai-uuid'));

// setup global should object, for things like "should.not.exist(someNullVariable)", which requires calling .should() on chai, to also setup "obj.should" syntax
global.should = chai.should();

// setup global testUtils object
global.testUtils = require('./utilities');

const TestSails = require('sails');

// simple database fixture handler for Sails
const Fixted = require('fixted');

const originalConsoleLog = console.log;

exports.mochaHooks = {
    // run once
    beforeAll: function(done) {
        // this.timeout(5000); //  this is set in our .mocharc.yml

        global.console = {
            log: () => {}, // this allows us to hide valid error messages during testing

            // keep native behaviour for other methods, use these in tests to log real issues
            error: console.error,
            warn: console.warn,
            info: console.info,
            debug: console.debug,
            table: console.table
        };

        // Try to get `rc` dependency
        let rc;
        try {
            rc = require('sails/accessible/rc');
        } catch (e0) {
            try {
                rc = require('sails/node_modules/rc');
            } catch (e1) {
                console.error('Could not find dependency: `rc`.');
                console.error('Your `.sailsrc` file(s) will be ignored.');
                console.error('To resolve this, run:');
                console.error('npm install rc --save');
                rc = function() {
                    return {};
                };
            }
        }

        // sanity check
        let err;
        try {
            // This should throw an error, since "sails" is undefined.
            should.not.exist(sails);
        } catch (e) {
            err = e;
        }
        err.toString().should.eq('ReferenceError: sails is not defined');

        // Required to make sure config/bootstrap.js doesn't stop us.
        process.env.NOT_FROM_SAILS_LIFT = 'true'; // Can't use booleans with environment variables... That's just silly!

        TestSails.lift(_.merge(rc('sails'), {
            log: {level: 'warn'},
            logSensitiveData: false,
            datastores: {
                default: {
                    database: 'testing'
                }
            },
            models: {
                dataEncryptionKeys: {
                    default: crypto.randomBytes(32).toString('base64')
                },
                migrate: 'drop'
            },
            globals: {
                sails: true,
                _,
                async: false,
                models: false
            },
            port: 1338, // to allow us to keep local instance running while we run tests
            session: {
                cookie: {
                    secure: false // can't have secure cookies when testing
                },
                secret: crypto.createHmac('sha256', crypto.randomBytes(42)).update(crypto.randomBytes(42) + new Date()).digest('hex')
            },
            security: {
                checkPwnedPasswords: true
            }
        }), function(err, sailsApp) {
            if (err) {
                return done(err);
            }

            // sanity checks
            should.exist(sails);
            sails.should.have.property('models');
            sails.should.have.property('helpers');
            sails.should.have.property('hooks');
            sails.should.have.property('registry');
            sails.registry.should.have.property('responses');
            sails.registry.should.have.property('policies');

            fs.readdir(path.join(__dirname, '../api/models'), (error, files) => {
                should.not.exist(error);

                Object.keys(sails.models).should.have.lengthOf(files.length - 1); // don't include the README
            });

            fs.readdir(path.join(__dirname, '../api/helpers'), (error, files) => {
                should.not.exist(error);

                Object.keys(sails.helpers).should.have.lengthOf(files.length - 1); // don't include the README
            });

            fs.readdir(path.join(__dirname, '../api/hooks'), (error, files) => {
                should.not.exist(error);

                Object.keys(sails.hooks).should.have.lengthOf(files.length + 15); // there are 16 built-in hooks, minus the README
            });

            fs.readdir(path.join(__dirname, '../api/responses'), (error, files) => {
                should.not.exist(error);

                Object.keys(sails.registry.responses).should.have.lengthOf(files.length); // although there is a README, 'negotiate', while deprecated, is still a built-in response
            });

            fs.readdir(path.join(__dirname, '../api/policies'), (error, files) => {
                should.not.exist(error);

                Object.keys(sails.registry.policies).should.have.lengthOf(files.length - 1); // don't include the README
            });

            // hand our testUtils a reference to the Sails instance
            global.testUtils = global.testUtils(sailsApp);

            // Load fixtures
            const fixted = new Fixted();

            // Populate the DB, forcing creation of users first
            fixted.populate([
                'user',
                'requestlog'
            ], () => {
                testUtils.fixtures = fixted.data;
                testUtils.ids = fixted.idMap;

                Object.entries(testUtils.ids).forEach((models) => {
                    const [model, ids] = models;

                    testUtils.fixtures[model].forEach((val, index) => {
                        testUtils.fixtures[model][index].id = ids[index];
                    });
                });

                // Kick-start our "browser" sessions
                testUtils.postAsUser({
                    route: '/login',
                    data: {
                        email: testUtils.fixtures.user[2].email,
                        password: testUtils.fixtures.user[2].password
                    },
                    end: (err, res) => {
                        if (err) {
                            return done(err);
                        }

                        res.body.success.should.be.a('boolean').and.eq(true);

                        testUtils.postAsAdmin({
                            route: '/login',
                            data: {
                                email: testUtils.fixtures.user[0].email,
                                password: testUtils.fixtures.user[0].password
                            },
                            end: (err, res) => {
                                if (err) {
                                    return done(err);
                                }

                                res.body.success.should.be.a('boolean').and.eq(true);

                                done();
                            }
                        });
                    }
                });
            });
        });
    },

    // run once
    afterAll: function(done) {
        // The timeout gives our app enough time to wrap up some database queries.
        // If we don't do this, our database connection pool will be closed before we are finished, and cause errors.
        setTimeout(() => {
            global.console = {
                log: originalConsoleLog, // restore original behavior

                // Keep native behaviour for other methods
                error: console.error,
                warn: console.warn,
                info: console.info,
                debug: console.debug,
                table: console.table
            };

            console.log(); // skip a line before lowering logs
            sails.lower(done);
        }, 5);
    }
};
