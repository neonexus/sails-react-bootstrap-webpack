describe('Delete User Controller', function() {
    let userId = null;

    before(function(done) {
        testUtils.postAsAdmin({
            route: '/user',
            expectedStatus: 201,
            data: {
                firstName: 'User',
                lastName: 'Two',
                email: 'user@2.com',
                generatePassword: true
            },
            end: (err, res) => {
                if (err) {
                    return done(err);
                }

                res.body.user.id.should.be.a('string').and.a.uuid('v4');

                userId = res.body.user.id;

                done();
            }
        });
    });

    it('should require an admin be logged in', function(done) {
        testUtils.deleteAsAnonymous({
            route: '/user/' + userId,
            expectedStatus: 403,
            end: (err) => {
                if (err) {
                    return done(err);
                }

                testUtils.deleteAsUser({
                    route: '/user/' + userId,
                    expectedStatus: 403,
                    end: done
                });
            }
        });
    });

    it('should not allow one to delete one self', function(done) {
        testUtils.deleteAsAdmin({
            route: '/user/' + testUtils.fixtures.user[0].id,
            expectedStatus: 400,
            end: done
        });
    });

    it('should SOFT DELETE the user', function(done) {
        testUtils.deleteAsAdmin({
            route: '/user/' + userId,
            end: done
        });
    });
});
