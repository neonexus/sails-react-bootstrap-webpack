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
            end: (err, res) => {
                if (err) {
                    return done(err);
                }

                res.body.token.should.be.a('string').and.have.lengthOf(165);

                const [id, token] = res.body.token.split(':');

                sails.models.apitoken.findOne(id).exec((err, foundToken) => {
                    if (err) {
                        return done(err);
                    }

                    if (!foundToken) {
                        return done('Token wasn\'t created as expected.');
                    }

                    // Make sure the token was encrypted.
                    foundToken.token.should.be.a('string').and.not.eq(token);

                    sails.models.apitoken.findOne(id).decrypt().exec((err, foundToken) => {
                        if (err) {
                            return done(err);
                        }

                        // Make sure we can decrypt it.
                        foundToken.token.should.be.a('string').and.eq(token);

                        done();
                    });
                });
            }
        });
    });
});
