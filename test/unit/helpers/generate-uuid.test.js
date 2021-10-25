const {validate: validateUuid} = require('uuid');

describe('generateUuid Helper', function() {
    let uuid;

    before(function(){
        sails.helpers.should.have.property('generateUuid');
        sails.helpers.generateUuid.should.be.a('function');
    });

    it('should generate a new UUID', async function() {
        uuid = sails.helpers.generateUuid();

        const isValid = validateUuid(uuid);
        isValid.should.be.a('boolean');
        isValid.should.equal(true);
    });

    it('should should not repeat itself', async function() {
        const thisUuid = sails.helpers.generateUuid();

        thisUuid.should.not.equal(uuid);
    });
});
