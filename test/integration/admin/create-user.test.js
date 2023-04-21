describe('Create User Controller', function() {
    it('should fail to create user if not admin', function(done) {
        testUtils.postAsUser({
            route: '/user',
            expectedStatus: 403,
            end: (err) => {
                if (err) {
                    return done(err);
                }

                testUtils.postAsAnonymous({
                    route: '/user',
                    expectedStatus: 403,
                    end: done
                });
            }
        });
    });

    it('should fail if password is lame', function(done) {
        testUtils.postAsAdmin({
            route: '/user',
            data: {
                firstName: 'New',
                lastName: 'User',
                email: 'new@user.com',
                password: 'Password'
            },
            expectedStatus: 400,
            end: done
        });
    });

    it('should fail if email is already in-use', function(done) {
        testUtils.postAsAdmin({
            route: '/user',
            data: {
                firstName: 'New',
                lastName: 'User',
                email: testUtils.fixtures.user[2].email,
                password: testUtils.fixtures.user[2].password
            },
            expectedStatus: 400,
            end: done
        });
    });

    it('should create user if admin', function(done) {
        testUtils.postAsAdmin({
            route: '/user',
            data: {
                firstName: 'New',
                lastName: 'User',
                email: 'new@user.com',
                password: 'A super awesome passphrase, to appease the password gods.'
            },
            expectedStatus: 201, // created
            end: async (err, res) => {
                if (err) {
                    console.debug(res.body);

                    return done(err);
                }

                res.body.user.id.should.be.a('string').and.a.uuid('v4');
                res.body.user.firstName.should.be.a('string').and.eq('New');
                res.body.user.lastName.should.be.a('string').and.eq('User');
                res.body.user.email.should.be.a('string').and.eq('new@user.com');

                const foundUser = await sails.models.user.findOne(res.body.user.id);

                if (!foundUser) {
                    return done(new Error('User was not created as expected.'));
                }

                return done();
            }
        });
    });
});
