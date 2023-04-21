describe('createLog helper', function() {

    before(function() {
        sails.helpers.should.have.property('createLog');
        sails.helpers.createLog.should.be.a('function');
    });

    it('should require the data and description input', async function() {
        try {
            await sails.helpers.createLog();
        } catch (e) {
            e.code.should.eq('E_INVALID_ARGINS');
            e.problems.should.be.an('array');
            e.problems.length.should.eq(2);
            e.problems[0].should.eq('"data" is required, but it was not defined.');
            e.problems[1].should.eq('"description" is required, but it was not defined.');
        }
    });

    it('should create a basic log', async function() {
        const newLog = await sails.helpers.createLog.with({data: {boosh: true}, description: 'Testing'});

        newLog.should.be.an('object');
        newLog.id.should.be.a('string');
        newLog.id.should.be.a.uuid();

        const foundLog = await sails.models.log.findOne(newLog.id);

        foundLog.description.should.eq('Testing');
        foundLog.data.should.have.property('boosh');
        foundLog.data.boosh.should.eq(true);
        (foundLog.user === null).should.be.true;
        (foundLog.request === null).should.be.true;
    });

    it('should attach a user and an API request', async function() {
        const foundUser = await sails.models.user.find().limit(1);
        const foundReq = await sails.models.requestlog.find().limit(1);

        const newLog = await sails.helpers.createLog.with({
            data: {test2: true},
            description: 'Testing 2',
            req: {session: {user: foundUser[0]}, id: foundReq[0].id}
        });

        const foundLog = await sails.models.log.findOne(newLog.id).populate('user').populate('request');

        foundLog.description.should.be.a('string').and.eq('Testing 2');
        foundLog.data.should.be.an('object').and.have.property('test2');
        foundLog.data.test2.should.be.a('boolean').and.eq(true);

        foundLog.should.have.property('user');
        foundLog.user.should.be.an('object');
        foundLog.user.role.should.eq(foundUser[0].role);
        foundLog.user.email.should.eq(foundUser[0].email);
        foundLog.request.should.be.an('object');

        foundLog.should.have.property('request');
        foundLog.request.should.be.an('object');
        foundLog.request.direction.should.eq(foundReq[0].direction);
        foundLog.request.host.should.eq(foundReq[0].host);
        foundLog.request.path.should.eq(foundReq[0].path);
        foundLog.request.body.should.eq(foundReq[0].body);
    });
});
