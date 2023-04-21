describe('Logout Controller',  function() {
    beforeEach( function(done) {
        // clear all sessions
        sails.models.session.destroy({}).exec((err) => {
            if (err) {
                return done(err);
            }

            testUtils.postAsAdmin({
                route: '/login',
                data: {
                    email: testUtils.fixtures.user[0].email,
                    password: testUtils.fixtures.user[0].password
                },
                end: (err) => {
                    if (err) {
                        return done(err);
                    }

                    done();
                }
            });
        });
    });

    it('should destroy the session data', function(done) {
        sails.models.session.find().exec((err, sess) => {
            if (err) {
                return done(err);
            }

            if (!sess.length) {
                return done(new Error('The test session wasn\'t found.'));
            }

            testUtils.getAsAdmin({
                route: '/logout',
                end: (err) => {
                    if (err) {
                        return done(err);
                    }

                    sails.models.session.findOne(sess[0].id).exec((err, foundSession) => {
                        if (err) {
                            return done(err);
                        }

                        if (foundSession) {
                            console.debug(foundSession[0]);

                            return done(new Error('The session wasn\'t destroyed as expected.'));
                        }

                        done();
                    });
                }
            });
        });
    });

    it('should destroy an API key', function(done) {
        testUtils.postAsAdmin({
            route: '/token',
            expectedStatus: 201,
            end: (err, res) => {
                if (err) {
                    return done(err);
                }

                const [tokenId] = res.body.token.split(':');
                const fullToken = res.body.token;

                testUtils.getAsAdmin({
                    route: '/logout',
                    end: (err) => {
                        if (err) {
                            return done(err);
                        }

                        testUtils.getAsAnonymous({
                            route: '/me',
                            headers: {
                                // With 'Bearer '
                                Authorization: 'Bearer ' + fullToken
                            },
                            end: (err, res) => {
                                if (err) {
                                    return done(err);
                                }

                                res.body.should.have.property('user');
                                res.body.user.should.have.property('id');
                                res.body.user.id.should.be.a('string').and.uuid('v4');

                                testUtils.getAsAdmin({
                                    route: '/logout',
                                    headers: {
                                        // Without 'Bearer '
                                        Authorization: fullToken
                                    },
                                    end: async (err) => {
                                        if (err) {
                                            return done(err);
                                        }

                                        const foundToken = await sails.models.apitoken.findOne(tokenId);

                                        if (foundToken) {
                                            return done(new Error('The API token wasn\'t deleted as expected.'));
                                        }

                                        return done();
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });

    after(function(done) {
        // rebuild sessions for other tests
        testUtils.postAsUser({
            route: '/login',
            data: {
                email: testUtils.fixtures.user[2].email,
                password: testUtils.fixtures.user[2].password
            },
            end: (err) => {
                if (err) {
                    return done(err);
                }

                testUtils.postAsAdmin({
                    route: '/login',
                    data: {
                        email: testUtils.fixtures.user[0].email,
                        password: testUtils.fixtures.user[0].password
                    },
                    end: (err) => {
                        if (err) {
                            return done(err);
                        }

                        done();
                    }
                });
            }
        });
    });
});
