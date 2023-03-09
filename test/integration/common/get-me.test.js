describe('Get-Me Controller', function() {
    it('should require a login', function(done) {
        testUtils.getAsAnonymous({
            route: '/me',
            expectedStatus: 403,
            end: (err, res) => {
                if (err) {
                    return done(err);
                }

                res.body.success.should.be.a('boolean').and.eq(false);
                res.body.errorMessages.should.be.an('array').and.have.lengthOf(1);
                res.body.errorMessages[0].should.be.a('string').and.eq('You are not logged in');

                done();
            }
        });
    });

    it('should return the current user', function(done) {
        testUtils.getAsUser({
            route: '/me',
            end: (err, res) => {
                if (err) {
                    return done(err);
                }

                res.body.user.should.be.an('object');
                res.body.user.id.should.be.a('string').and.eq(testUtils.fixtures.user[2].id);
                res.body.user.email.should.be.a('string').and.eq(testUtils.fixtures.user[2].email);
                res.body.user.firstName.should.be.a('string').and.eq(testUtils.fixtures.user[2].firstName);
                res.body.user.lastName.should.be.a('string').and.eq(testUtils.fixtures.user[2].lastName);
                should.not.exist(res.body.user.password);
                should.not.exist(res.body.user.verificationKey);

                done();
            }
        });
    });
});
