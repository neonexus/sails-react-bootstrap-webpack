const requestLogger = require('../../../api/hooks/request-logger');

describe('Request Logger', function() {
    let logger;
    let hook;

    before( function() {
        logger = requestLogger(sails);

        // sanity check
        sails.models.should.have.property('requestlog');

        hook = logger.routes.before['*'];
        hook.should.be.a('function');
    });

    describe('Initializer', function() {
        it('Should call the passed callback function', async function() {
            const cb = chai.spy();

            logger.initialize(cb);

            cb.should.have.been.called();
        });
    });

    describe('Request logging should ignore...', function() {
        let requestCreate;

        before(function() {
            sails.models.requestlog.create.should.be.a('function');
            requestCreate = chai.spy(sails.models.requestlog.create);
        });

        it('HEAD requests', async function() {
            const req = {
                method: 'HEAD',
                path: '/awesome'
            };
            const cb = chai.spy();

            hook(req, {}, cb);

            requestCreate.should.not.have.been.called();
            cb.should.have.been.called();
        });

        it('/__getcookie requests', async function() {
            const req = {
                method: 'GET',
                path: '/__getcookie'
            };
            const cb = chai.spy();

            hook(req, {}, cb);

            requestCreate.should.not.have.been.called();
            cb.should.have.been.called();
        });

        it('/ requests', async function() {
            const req = {
                method: 'GET',
                path: '/'
            };
            const cb = chai.spy();

            hook(req, {}, cb);

            requestCreate.should.not.have.been.called();
            cb.should.have.been.called();
        });
    });

    describe('Request logging should...', function() {
        const defaultReq = {
            method: 'GET',
            path: '/',
            hostname: 'localtest',
            body: {
                password: 'password1',
                password2: 'password2',
                currentPassword: 'currentPassword',
                newPassword: 'newPassword',
                newPassword2: 'newPassword2',
                pass: 'lamepassword'
            },
            query: {
                securityToken: 'somelongsecuritytoken'
            },
            headers: {
                securityToken: 'somelongsecuritytokenintheheaders'
            }
        };
        const defaultRes = {};
        const defaultCb = chai.spy();

        before(function() {
            // force this, just in-case
            sails.config.logSensitiveData = false;
        });

        it('Not log sensitive information', function() {
            let thisReq = _.merge({}, defaultReq);

            hook = hook.bind(this);
            hook(thisReq, defaultRes, defaultCb);

            defaultCb.should.have.been.called();

            thisReq.should.have.property('requestId');
            thisReq.should.have.property('_customStartTime');
        });
    });
});
