/**
 * This is the file that bootstraps needed tools for testing.
 * Everything starts in this file.
 */

const _ = require('lodash');
global.should = require('chai').should();

const Sails = require('sails');
const Fixted = require('fixted');

exports.mochaHooks = {
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
                models: true
            }
        }), function(err){
            if (err) {
                return done(err);
            }

            // Load fixtures
            const fixted = new Fixted();

            // Populate the DB, forcing creation of accounts and users first
            fixted.populate([
                'user'
            ], done);
        });
    },

    afterAll: function(done){
        // here you can clear fixtures, etc.
        console.log(); // skip a line before lowering logs
        sails.lower(done);
        // done();
    }
};
