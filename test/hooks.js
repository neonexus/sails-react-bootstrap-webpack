/**
 * This is the file that bootstraps needed tools for testing.
 * Everything starts in this file.
 */

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
global.chai = require('chai');

chai.use(require('chai-spies'));

// setup global should object, for things like "should.not.exist(someNullVariable)", which requires calling .should() on chai, to also setup "obj.should" syntax
global.should = chai.should(); // WebStorm doesn't like this, but it works...

// not the global "sails" variable, this is internal uppercase "Sails"
const Sails = require('sails');

// simple database fixture handler
const Fixted = require('fixted');

exports.mochaHooks = {
    // run once
    beforeAll: function(done) {
        this.timeout(5000);

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
                rc = function(){ return {}; };
            }
        }

        Sails.lift(_.merge(rc('sails'), {
            log: { level: 'warn' },
            datastores: {
                default: {
                    database: 'testing'
                }
            },
            models: {
                migrate: 'drop'
            },
            globals: {
                sails: true,
                _,
                async: false,
                models: false
            }
        }), function(err, sailsApp){
            if (err) {
                return done(err);
            }

            // sanity checks
            should.exist(sails);
            sails.should.have.property('models');

            fs.readdir( path.join(__dirname, '../api/models'), (error, files) => {
                should.not.exist(error);

                Object.keys(sails.models).should.have.lengthOf(files.length + 1); // add 1 for the built-in archive model
            });

            // Load fixtures
            const fixted = new Fixted();

            // Populate the DB, forcing creation of users first
            fixted.populate([
                'user'
            ], done);
        });
    },

    // run once
    afterAll: function(done){
        // here you can clear fixtures, etc.
        console.log(); // skip a line before lowering logs
        sails.lower(done);
    }
};
