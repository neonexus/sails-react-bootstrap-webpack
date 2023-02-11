describe('Logout Controller',  function() {
    before( function(done) {
        // clear all sessions
        sails.models.session.destroy({}).exec((err) => {
            if (err) {
                return done(err);
            }

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

            testUtils.getAsUser({
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
