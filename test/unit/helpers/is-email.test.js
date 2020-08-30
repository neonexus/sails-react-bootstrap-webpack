describe('isEmail Helper', function() {
    before(function() {
        sails.helpers.should.have.property('isEmail');
        sails.helpers.isEmail.should.be.a('function');
    });

    it('should validate emails correctly', async function() {
        const isValid = sails.helpers.isEmail('test@domain.com');

        isValid.should.be.a('boolean');
        isValid.should.equal(true);
    });

    it('should reject emails correctly', async function() {
        const isValid = sails.helpers.isEmail('test@domain');

        isValid.should.be.a('boolean');
        isValid.should.equal(false);
    });
});
