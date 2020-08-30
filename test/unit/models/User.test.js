const userFixtures = require('../../fixtures/User.js');

describe('User Model', function() {
    before(function() {
        // sanity checks
        should.exist(sails);
        sails.models.should.have.property('user');
    });

    it('.find() should return all user fixtures', async function() {
        const foundUsers = await sails.models.user.find({});
        foundUsers.should.be.an('array');
        foundUsers.should.have.lengthOf(userFixtures.length);

        // make sure the passwords aren't being stored in plain-text
        for (let i = 0; i < foundUsers.length; ++i) {
            foundUsers[i].id.should.be.a.uuid();
            foundUsers[i].should.have.property('password');
            foundUsers[i].password.substr(0, 8).should.equal('c2NyeXB0'); // "scrypt" in base 64
        }
    });

    it('.toJSON() should not expose sensitive information to the outside world', async function() {
        const foundUsers = await sails.models.user.find({}).limit(1);
        foundUsers.should.be.an('array');

        // make sure password is never exposed to the outside world
        const userJson = foundUsers[0].toJSON();
        userJson.should.not.have.property('password');
        userJson.should.not.have.property('verificationKey');
    });

    it('.fullName() should return given user\'s full name', async function() {
        const foundUser = await sails.models.user.find({}).limit(1);

        const fullName = sails.models.user.fullName(foundUser[0]);

        fullName.should.eq(foundUser[0].firstName + ' ' + foundUser[0].lastName);
    });

    it('.doPasswordsMatch() should compare passwords correctly', async function() {
        const foundUser = await sails.models.user.findOne({email: userFixtures[0].email});

        foundUser.password.substr(0, 8).should.equal('c2NyeXB0'); // "scrypt" in base 64
        userFixtures[0].password.should.not.equal(foundUser.password);

        const isAMatch = await sails.models.user.doPasswordsMatch(userFixtures[0].password, foundUser.password);

        isAMatch.should.be.a('boolean');
        isAMatch.should.eq(true);

        const cbTest = chai.spy();

        try {
            await sails.models.user.doPasswordsMatch(userFixtures[0].password); // should throw error
        } catch (e) {
            e.should.be.an('error');
            cbTest();
        }

        cbTest.should.have.been.called();
    });
});
