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

                res.body.id.should.be.uuid('v4');
                res.body.token.should.be.a('string').and.have.lengthOf(128);

                const foundToken = await sails.models.apitoken.findOne(res.body.id);

                if (!foundToken) {
                    return done(new Error('Token wasn\'t created as expected.'));
                }

                // Make sure the token was encrypted.
                foundToken.token.should.be.a('string').and.not.eq(res.body.token);

                const foundToken2 = await sails.models.apitoken.findOne(res.body.id).decrypt();

                // Make sure we can decrypt it.
                foundToken2.token.should.be.a('string').and.eq(res.body.token);

                done();
            }
        });
    });
});
