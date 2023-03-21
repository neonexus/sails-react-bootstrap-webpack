describe('isLoggedIn Policy', function(){
    let isLoggedInPolicy, newSession;

    before(async function() {
        isLoggedInPolicy = sails.registry.policies.isloggedin;

        newSession = await sails.models.session.create({
            id: 'c', // required, auto-generated
            user: testUtils.fixtures.user[0].id,
            data: {blah: true},
            csrfSecret: 'some garbage secret'
        }).fetch();

        newSession.id.should.be.a('string').and.a.uuid('v4');
        newSession.user.should.be.a('string').and.a.uuid('v4');
        newSession.data.blah.should.be.a('boolean').and.eq(true);
    });

    it('should default to calling .forbidden()', async function() {
        const res = {forbidden: chai.spy()};

        await isLoggedInPolicy({signedCookies: [], headers: []}, res);

        res.forbidden.should.have.been.called.once;
    });

    it('should load user from signed cookie', async function() {
        let req = {signedCookies: {}, method: 'GET'};
        const next = chai.spy();

        req.signedCookies[sails.config.session.name] = newSession.id;

        await isLoggedInPolicy(req, null, next);

        next.should.have.been.called.once;
        req.should.have.property('session');
        req.session.should.be.an('object');
        req.session.id.should.be.a('string').and.a.uuid('v4');
        req.session.user.should.be.an('object');
        req.session.user.id.should.be.a('string').and.a.uuid('v4').and.eq(testUtils.fixtures.user[0].id);
    });

    it('should load user from an API bearer token', async function() {
        const newToken = await sails.models.apitoken.create({
            id: 'c', // required, auto-generated
            user: testUtils.fixtures.user[0].id
        }).fetch();
        const req = {headers: {authorization: 'Bearer ' + newToken.id + ':' + newToken.token}, signedCookies: []};
        const next = chai.spy();

        await isLoggedInPolicy(req, null, next);

        next.should.have.been.called.once;
        req.should.have.property('session');
        req.session.should.be.an('object');
        req.session.id.should.be.a('string').and.a.uuid('v4');
        req.session.user.should.be.an('object');
        req.session.user.id.should.be.a('string').and.a.uuid('v4').and.eq(testUtils.fixtures.user[0].id);
        req.session.isAPIToken.should.be.a('boolean').and.eq(true);
    });
});
