describe('isPasswordValid Helper', function() {
    before(function(){
        sails.helpers.should.have.property('isPasswordValid');
        sails.helpers.isPasswordValid.should.be.a('function');
    });

    it('should require passwords at least 7 characters long', async function() {
        const isValid = sails.helpers.isPasswordValid('123As.');

        isValid.should.be.an('array');
        isValid.length.should.equal(1);
        isValid[0].should.equal('Password must be at least 7 characters');
    });

    it('should not allow passwords longer than 70 characters', async function() {
        const isValid = sails.helpers.isPasswordValid('6CTXn4KDszqsUCXJ7uZJdllAtf0aV3lOHEN32bGuhdicL6Ivukg2h1P0xQnei1GTlXGaS7a');

        isValid.should.be.an('array');
        isValid.length.should.equal(1);
        isValid[0].should.equal('WOW. Password length is TOO good. Max is 70 characters. Sorry.');
    });

    it('should not let more than 2 characters repeat', async function() {
        const isValid = sails.helpers.isPasswordValid('1234Abd.aaa93');

        isValid.should.be.an('array');
        isValid.length.should.equal(1);
        isValid[0].should.equal('Password can not contain 3 or more repeated characters');
    });

    it('should require at least 1 lowercase character', async function() {
        const isValid = sails.helpers.isPasswordValid('1234ABCD.K');

        isValid.should.be.an('array');
        isValid.length.should.equal(1);
        isValid[0].should.equal('Password must have at least 1 lowercase character');
    });

    it('should require at least 1 uppercase character', async function() {
        const isValid = sails.helpers.isPasswordValid('1234abcd.k');

        isValid.should.be.an('array');
        isValid.length.should.equal(1);
        isValid[0].should.equal('Password must have at least 1 uppercase character');
    });

    it('should require at least 1 digit', async function() {
        const isValid = sails.helpers.isPasswordValid('AbcdEfg.k');

        isValid.should.be.an('array');
        isValid.length.should.equal(1);
        isValid[0].should.equal('Password must have at least 1 digit');
    });

    it('should require at least 1 special character', async function() {
        const isValid = sails.helpers.isPasswordValid('12345Abcd');

        isValid.should.be.an('array');
        isValid.length.should.equal(1);
        isValid[0].should.equal('Password must have at least 1 special character');
    });

    it('should return true for valid password', async function() {
        const isValid = sails.helpers.isPasswordValid('12345Abcd.k');

        isValid.should.be.a('boolean');
        isValid.should.equal(true);
    });

    it('should return true for valid passphrase', async function() {
        const isValid = sails.helpers.isPasswordValid('I really like passphrases.');

        isValid.should.be.a('boolean');
        isValid.should.equal(true);
    });

    describe('should not allow user parts', function() {
        const user = {
            email: 'test@domain.com',
            firstName: 'Tester',
            lastName: 'McUser'
        };

        it('should not allow email in password', async function() {
            const isValid = sails.helpers.isPasswordValid.with({
                password: '123test@domain.com321',
                user: user
            });

            isValid.should.be.an('array');
            isValid.length.should.equal(1);
            isValid[0].should.equal('Password can not contain your email address');
        });

        it('should not allow first name in password', async function() {
            const isValid = sails.helpers.isPasswordValid.with({
                password: 'I am the best Tester ever!',
                user: user
            });

            isValid.should.be.an('array');
            isValid.length.should.equal(1);
            isValid[0].should.equal('Password can not contain your first name');
        });

        it('should not allow last name in password', async function() {
            const isValid = sails.helpers.isPasswordValid.with({
                password: 'Hurray for the great, McUser!',
                user: user
            });

            isValid.should.be.an('array');
            isValid.length.should.equal(1);
            isValid[0].should.equal('Password can not contain your last name');
        });
    });
});
