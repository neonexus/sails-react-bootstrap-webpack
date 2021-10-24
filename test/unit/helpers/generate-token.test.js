describe('generateToken Helper', function() {
    let token;

    before(function(){
        sails.helpers.should.have.property('generateToken');
        sails.helpers.generateToken.should.be.a('function');
    });

    it('should generate a random 64 character token', async function() {
        token = sails.helpers.generateToken();

        token.should.be.a('string');
        token.length.should.equal(64);
    });

    it('should not return the same token in multiple calls', async function() {
        const thisToken = sails.helpers.generateToken();

        thisToken.should.not.equal(token);
        thisToken.length.should.equal(64);
    });
});
