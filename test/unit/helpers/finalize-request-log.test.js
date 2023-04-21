describe('finalizeRequestLog helper', function() {
    it('should fail when required inputs aren\'t set', async function() {
        try {
            await sails.helpers.finalizeRequestLog();
        } catch (e) {
            e.code.should.eq('E_INVALID_ARGINS');
            e.problems.should.be.an('array').and.have.lengthOf(3);
            e.problems[0].should.eq('"req" is required, but it was not defined.');
            e.problems[1].should.eq('"res" is required, but it was not defined.');
            e.problems[2].should.eq('"body" is required, but it was not defined.');
        }
    });

    it('should not interrupt flow if requestId is undefined', async function() {
        const resp = await sails.helpers.finalizeRequestLog({}, {}, {});

        should.not.exist(resp);
    });

    it('should update the request log', async function() {
        const bleep = '*******';

        let foundLog = await sails.models.requestlog.find({path: '/testpath'}).limit(1);

        /* eslint-disable */
        const resp = await sails.helpers.finalizeRequestLog({
            id: foundLog[0].id,
            _requestStartTime: process.hrtime.bigint()
        }, {
            getHeaders: () => ({testing: true}),
            statusCode: 200
        }, {
            _csrf: 'blah',
            token: 'test',
            access_token: 'atoken',
            refresh_token: 'rtoken'
        });

        should.not.exist(resp);

        const foundLog2 = await sails.models.requestlog.findOne(foundLog[0].id);

        foundLog2.responseBody.should.be.a('string').and.eq(JSON.stringify({_csrf: bleep, token: bleep, access_token: bleep, refresh_token: bleep}));
        /* eslint-enable */
        foundLog2.responseCode.should.be.a('number').and.eq(200);
        foundLog2.responseHeaders.should.be.a('string').and.eq(JSON.stringify({testing: true}));
        foundLog2.responseTime.replace('ms', '').should.not.be.NaN;
    });
});
