describe('Session Model', function() {
    before(function() {
        // sanity checks
        should.exist(sails);
        sails.models.should.have.property('user');
        sails.models.should.have.property('session');
    });

    it('should have a session already in database', async function() { // loaded by our model fixtures
        const foundSessions = await sails.models.session.find({});

        foundSessions.length.should.equal(1);
        foundSessions[0].data.should.have.property('isLoggedIn');
        foundSessions[0].data.isLoggedIn.should.equal(true);
        foundSessions[0].createdAt.should.be.a('date');
        foundSessions[0].updatedAt.should.be.a('date');
    });

    it('should auto generate a UUID', async function() {
        const foundUser = await sails.models.user.find({}).limit(1);

        foundUser.should.be.an('array');
        foundUser.length.should.equal(1);
        foundUser[0].id.should.be.a.uuid();

        const newSession = await sails.models.session.create({
            id: 'c', // required, but still handled by the model
            user: foundUser[0].id,
            data: {
                isValidData: true
            }
        }).fetch();

        newSession.should.have.property('id');
        newSession.id.should.be.a.uuid();
    });
});
