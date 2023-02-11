describe('Login Controller',  function() {
    it('should require email and password', function(done) {
        testUtils.postAsAnonymous({
            route: '/login',
            expectedStatus: 400,
            end: (err, res) => {
                if (err) {
                    return done(err);
                }

                res.body.errors.problems.should.be.an('array').and.have.lengthOf(2);
                res.body.errors.problems[0].should.be.a('string').and.eq('"email" is required, but it was not defined.');
                res.body.errors.problems[1].should.be.a('string').and.eq('"password" is required, but it was not defined.');

                done();
            }
        });
    });

    it('should return the user when valid', function(done) {
        testUtils.postAsAnonymous({
            route: '/login',
            data: {
                email: testUtils.fixtures.user[2].email,
                password: testUtils.fixtures.user[2].password
            },
            end: (err, res) => {
                if (err) {
                    return done(err);
                }

                res.body.success.should.be.a('boolean').and.eq(true);
                res.body.user.id.should.be.a('string').and.eq(testUtils.fixtures.user[2].id);

                done();
            }
        });
    });

    it('should return badRequest if already logged in', function(done) {
        testUtils.postAsUser({
            route: '/login',
            expectedStatus: 400,
            data: {
                email: 'nope@test.com',
                password: 'nope'
            },
            end: (err, res) => {
                if (err) {
                    return done(err);
                }

                res.body.errorMessages.should.be.an('array').and.have.lengthOf(1);
                res.body.errorMessages[0].should.be.a('string').and.eq('Already logged in.');

                done();
            }
        });
    });
});
