describe('Request Logger', function() {
    const bleep = '*******';

    let logger;
    let hook;
    let expectedRequestLogCount = 0;

    async function getRequestLogCount() {
        return await sails.models.requestlog.count();
    }

    before(async function() {
        // sanity checks
        sails.hooks.should.have.property('request-logger');
        sails.models.should.have.property('requestlog');

        logger = sails.hooks['request-logger'];

        hook = logger.routes.before['*'];
        hook.should.be.a('function');

        const requestLogCount = await getRequestLogCount();
        requestLogCount.should.eq(expectedRequestLogCount);
    });

    describe('Initializer', function() {
        it('Should call the passed callback function', async function() {
            const cb = chai.spy();

            logger.initialize(cb);

            cb.should.have.been.called();
        });
    });

    describe('Request logging should ignore...', function() {
        before(async function() {
            const requestLogCount = await getRequestLogCount();
            requestLogCount.should.eq(expectedRequestLogCount);
        });

        it('HEAD requests', function(done) {
            const req = {
                method: 'HEAD',
                path: '/awesome'
            };

            hook(req, {}, async function() {
                const requestLogCount = await getRequestLogCount();
                requestLogCount.should.eq(0);

                done();
            });
        });

        it('/__getcookie requests', function(done) {
            const req = {
                method: 'GET',
                path: '/__getcookie'
            };

            hook(req, {}, async function() {
                const requestLogCount = await getRequestLogCount();
                requestLogCount.should.eq(expectedRequestLogCount);

                done();
            });
        });

        it('/ requests', function(done) {
            const req = {
                method: 'GET',
                path: '/'
            };

            hook(req, {}, async function() {
                const requestLogCount = await getRequestLogCount();
                requestLogCount.should.eq(expectedRequestLogCount);

                done();
            });
        });
    });

    describe('Request logging should...', function() {
        const defaultReq = {
            method: 'GET',
            path: '/testpath',
            hostname: 'localtest',
            body: {
                password: 'password1',
                password2: 'password2',
                currentPassword: 'currentPassword',
                newPassword: 'newPassword',
                newPassword2: 'newPassword2',
                pass: 'lamepassword',
                username: 'blah@doom.boom',
                mySpecialText: 'This is just a test comment.'
            },
            query: {
                securityToken: 'somelongsecuritytoken'
            },
            headers: {
                securityToken: 'somelongsecuritytokenintheheaders'
            }
        };
        const defaultRes = {};

        before(function() {
            // force this, just in-case
            sails.config.logSensitiveData = false;
        });

        it('Not log sensitive information', function(done) {
            const thisReq = _.merge({}, defaultReq);

            hook(thisReq, defaultRes, async function() {
                ++expectedRequestLogCount;
                const requestLogCount = await getRequestLogCount();
                requestLogCount.should.eq(expectedRequestLogCount);

                // validate the hook modified the request object
                thisReq.should.have.property('requestId');
                thisReq.should.have.property('_customStartTime');

                thisReq.should.have.property('body');

                // verify the request wasn't modified, controllers still need those values
                thisReq.body.password.should.eq(defaultReq.body.password);
                thisReq.body.password2.should.eq(defaultReq.body.password2);
                thisReq.body.currentPassword.should.eq(defaultReq.body.currentPassword);
                thisReq.body.newPassword.should.eq(defaultReq.body.newPassword);
                thisReq.body.newPassword2.should.eq(defaultReq.body.newPassword2);
                thisReq.body.pass.should.eq(defaultReq.body.pass);

                const foundLog = await sails.models.requestlog.findOne({id: thisReq.requestId});

                should.exist(foundLog);

                foundLog.should.have.property('body');
                foundLog.should.have.property('getParams');
                foundLog.should.have.property('headers');

                foundLog.body.should.be.a('string');
                foundLog.getParams.should.be.an('object');
                foundLog.headers.should.be.an('object');

                const parsedLogBody = JSON.parse(foundLog.body);

                // verify nothing sensitive was logged to the database
                parsedLogBody.should.have.property('password');
                parsedLogBody.password.should.eq(bleep);
                parsedLogBody.password2.should.eq(bleep);
                parsedLogBody.currentPassword.should.eq(bleep);
                parsedLogBody.newPassword.should.eq(bleep);
                parsedLogBody.newPassword2.should.eq(bleep);
                parsedLogBody.pass.should.eq(bleep);

                foundLog.getParams.securityToken.should.eq(bleep);

                foundLog.headers.securityToken.should.eq(bleep);

                done();
            });
        });

        it('Not "bleep" out other data points', function(done) {
            const thisReq = _.merge({}, defaultReq);

            hook(thisReq, defaultRes, async function() {
                ++expectedRequestLogCount;
                const requestLogCount = await getRequestLogCount();
                requestLogCount.should.eq(expectedRequestLogCount);

                thisReq.should.have.property('requestId');
                thisReq.should.have.property('_customStartTime');

                thisReq.should.have.property('body');

                // verify the request wasn't modified
                thisReq.body.username.should.eq(defaultReq.body.username);
                thisReq.body.mySpecialText.should.eq(defaultReq.body.mySpecialText);

                const foundLog = await sails.models.requestlog.findOne({id: thisReq.requestId});

                should.exist(foundLog);

                foundLog.should.have.property('body');
                foundLog.body.should.be.a('string');

                const parsedLogBody = JSON.parse(foundLog.body);

                parsedLogBody.username.should.eq(defaultReq.body.username);
                parsedLogBody.mySpecialText.should.eq(defaultReq.body.mySpecialText);

                done();
            });
        });

        it('Not block a request on database error', function(done) {
            const thisReq = _.merge({}, defaultReq, {
                method: 'FAIL'
            });

            hook(thisReq, defaultRes, () => {
                // this function getting called is a test in it self, because we should have gotten an error
                done();
            });
        });
    });
});
