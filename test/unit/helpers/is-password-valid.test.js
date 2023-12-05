describe('isPasswordValid Helper', function() {
    before(function(){
        sails.helpers.should.have.property('isPasswordValid');
        sails.helpers.isPasswordValid.should.be.a('function');
    });

    it('should require passwords at least 7 characters long', async function() {
        const isValid = await sails.helpers.isPasswordValid('123As.', true);

        isValid.should.be.an('array');
        isValid.length.should.equal(1);
        isValid[0].should.equal('Password must be at least 7 characters.');
    });

    it('should not allow passwords longer than 70 characters', async function() {
        const isValid = await sails.helpers.isPasswordValid('6CTXn@KDszqsUCXJ7uZJdllAtf0aV3lOHEN32bGuhdicL6Ivukg2h1P0xQnei1GTlXGaS7a', true);

        isValid.should.be.an('array');
        isValid.length.should.equal(1);
        isValid[0].should.equal('WOW. Password length is TOO good. Max is 70 characters. Sorry.');
    });

    it('should not let more than 2 characters repeat', async function() {
        const isValid = await sails.helpers.isPasswordValid('1234Abd.aaa93', true);

        isValid.should.be.an('array');
        isValid.length.should.equal(1);
        isValid[0].should.equal('Password can not contain 3 or more repeated characters.');
    });

    it('should require at least 1 lowercase character', async function() {
        const isValid = await sails.helpers.isPasswordValid('1234ABCD.K', true);

        isValid.should.be.an('array');
        isValid.length.should.equal(1);
        isValid[0].should.equal('Password must have at least 1 lowercase character.');
    });

    it('should require at least 1 uppercase character', async function() {
        const isValid = await sails.helpers.isPasswordValid('1234abcd.k', true);

        isValid.should.be.an('array');
        isValid.length.should.equal(1);
        isValid[0].should.equal('Password must have at least 1 uppercase character.');
    });

    it('should require at least 1 digit', async function() {
        const isValid = await sails.helpers.isPasswordValid('AbcdEfg.k', true);

        isValid.should.be.an('array');
        isValid.length.should.equal(1);
        isValid[0].should.equal('Password must have at least 1 digit.');
    });

    it('should require at least 1 special character', async function() {
        const isValid = await sails.helpers.isPasswordValid('12345Abcd', true);

        isValid.should.be.an('array');
        isValid.length.should.equal(1);
        isValid[0].should.equal('Password must have at least 1 special character.');
    });

    it('should return true for valid password', async function() {
        const isValid = await sails.helpers.isPasswordValid('12345Abcd.k', true);

        isValid.should.be.a('boolean');
        isValid.should.equal(true);
    });

    it('should return true for valid passphrase', async function() {
        const isValid = await sails.helpers.isPasswordValid('I really like passphrases.', true);

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
            const isValid = await sails.helpers.isPasswordValid.with({
                password: '0987' + user.email + '1234A',
                user,
                skipPwned: true
            });

            isValid.should.be.an('array');
            isValid.length.should.equal(1);
            isValid[0].should.equal('Password can not contain your email address.');
        });

        it('should not allow first name in password', async function() {
            const isValid = await sails.helpers.isPasswordValid.with({
                password: 'I am the best Tester ever!',
                user,
                skipPwned: true
            });

            isValid.should.be.an('array');
            isValid.length.should.equal(1);
            isValid[0].should.equal('Password can not contain your first name.');
        });

        it('should not allow last name in password', async function() {
            const isValid = await sails.helpers.isPasswordValid.with({
                password: 'Hurray for the great, McUser!',
                user,
                skipPwned: true
            });

            isValid.should.be.an('array');
            isValid.length.should.equal(1);
            isValid[0].should.equal('Password can not contain your last name.');
        });
    });

    it.skip('should check with PwnedPasswords.com API', async function() {
        this.slow(350);
        this.timeout(3000);

        const isValid = await sails.helpers.isPasswordValid('Testing1234!');

        isValid.should.be.an('array').and.have.lengthOf(1);
        isValid[0].substring(0, 36).should.eq('Provided password has been found in ');

        let pass = 'CAPITAL_LETTERS' + sails.helpers.generateUuid();

        async function done(pass) {
            const isValid2 = await sails.helpers.isPasswordValid(pass);

            isValid2.should.be.a('boolean').and.eq(true);
        }

        (function findValidPass(inPass){
            // first, find a password that matches our requirements
            sails.helpers.isPasswordValid(pass, true).then((isPassValid) => {
                if (isPassValid !== true) {
                    findValidPass('CAPITAL_LETTERS' + sails.helpers.generateUuid());
                } else {
                    pass = inPass;

                    return done(pass);
                }
            });
        })(pass);
    });
});
