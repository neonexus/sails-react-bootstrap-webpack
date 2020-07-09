const userFixtures = require('../../fixtures/User.js');

describe('User Model', function() {
    before(function() {
        // sanity checks
        should.exist(sails);
        sails.models.should.have.property('user');
    });

    describe('.find()', function() {
        it('should return all user fixtures', async function() {
            const foundUsers = await sails.models.user.find({});
            foundUsers.should.be.an('array');
            foundUsers.should.have.lengthOf(userFixtures.length);

            // make sure the passwords aren't being stored in plain-text
            for (let i = 0; i < foundUsers.length; ++i) {
                foundUsers[i].should.have.property('password');
                foundUsers[i].password.substr(0, 8).should.equal('c2NyeXB0'); // "scrypt" in base 64
            }
        });
    });

    describe('.toJSON()', function() {
        it('should not expose sensitive information to the outside world', async function() {
            const foundUsers = await sails.models.user.find({});
            foundUsers.should.be.an('array');

            // make sure password is never exposed to the outside world
            const userJson = foundUsers[0].toJSON();
            userJson.should.not.have.property('password');
            userJson.should.not.have.property('verificationKey');
        });
    });
});
