describe('Generate and verify CSRF tokens', function() {
    let token, secret;

    before(function() {
        sails.helpers.should.have.property('generateCsrfTokenAndSecret');
        sails.helpers.generateCsrfTokenAndSecret.should.be.a('function');

        sails.helpers.should.have.property('verifyCsrfToken');
        sails.helpers.verifyCsrfToken.should.be.a('function');
    });

    it('should generate token and secret without options', async function() {
        const csrf = sails.helpers.generateCsrfTokenAndSecret();

        csrf.should.have.property('token');
        csrf.should.have.property('secret');
        csrf.token.length.should.equal(36);
        csrf.secret.length.should.equal(24);

        token = csrf.token;
        secret = csrf.secret;
    });

    it('should reject invalid CSRF secret', async function() {
        const isValid = sails.helpers.verifyCsrfToken.with({token, secret: 'blahblahFailblah'});

        isValid.should.be.a('boolean');
        isValid.should.equal(false);
    });

    it('should reject invalid CSRF token', async function() {
        const isValid = sails.helpers.verifyCsrfToken.with({token: 'blahblahFailblah', secret});

        isValid.should.be.a('boolean');
        isValid.should.equal(false);
    });

    it('should verify CSRF token and secret', async function() {
        const isValid = sails.helpers.verifyCsrfToken.with({token, secret});

        isValid.should.be.a('boolean');
        isValid.should.equal(true);
    });

    it('should generate token and secret with bigger salt and secret lengths', async function() {
        const csrf = sails.helpers.generateCsrfTokenAndSecret(128, 143);

        csrf.should.have.property('token');
        csrf.should.have.property('secret');
        csrf.token.length.should.equal(156);
        csrf.secret.length.should.equal(191);

        csrf.token.should.not.equal(token);
        csrf.secret.should.not.equal(secret);

        token = csrf.token;
        secret = csrf.secret;
    });

    it('should verify CSRF token and secret with bigger salt and secret', async function() {
        const isValid = sails.helpers.verifyCsrfToken.with({token, secret});

        isValid.should.be.a('boolean');
        isValid.should.equal(true);
    });

    it('should not allow a salt length smaller than 8 characters', function(done) {
        try {
            sails.helpers.generateCsrfTokenAndSecret.with({saltLength: 7}); // this should fail
        } catch (e) {
            e.should.have.property('name');
            e.name.should.equal('UsageError');

            return done();
        }
    });

    it('should not allow a secret length smaller than 18 bytes', function(done) {
        try {
            sails.helpers.generateCsrfTokenAndSecret.with({secretLength: 17}); // this should fail
        } catch (e) {
            e.should.have.property('name');
            e.name.should.equal('UsageError');

            return done();
        }
    });
});
