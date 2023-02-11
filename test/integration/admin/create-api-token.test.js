describe('Create API Token Controller', function() {
    it('should require an admin be logged in', function(done) {
        testUtils.postAsAnonymous({
            route: '/token',
            expectedStatus: 403,
            end: (err) => {
                if (err) {
                    return done(err);
                }

                testUtils.postAsUser({
                    route: '/token',
                    expectedStatus: 403,
                    end: done
                });
            }
        });
    });

    it('should create a token for an admin', function(done) {
        testUtils.postAsAdmin({
            route: '/token',
            expectedStatus: 201,
            end: async (err, res) => {
                if (err) {
                    return done(err);
                }

                res.body.token.should.be.a('string').and.have.lengthOf(64);

                const foundToken = await sails.models.apitoken.findOne({token: res.body.token});

                if (!foundToken) {
                    return done(new Error('Token wasn\'t created as expected.'));
                }

                done();
            }
        });
    });
});
