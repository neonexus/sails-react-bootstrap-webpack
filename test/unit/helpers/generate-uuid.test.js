describe('generateUuid Helper', function() {
    let uuid;

    before(function(){
        sails.helpers.should.have.property('generateUuid');
        sails.helpers.generateUuid.should.be.a('function');
    });

    it('should generate a new UUID', async function() {
        uuid = sails.helpers.generateUuid();

        uuid.should.be.a.uuid();
    });

    it('should should not repeat itself', async function() {
        const thisUuid = sails.helpers.generateUuid();

        thisUuid.should.not.equal(uuid);
    });
});
