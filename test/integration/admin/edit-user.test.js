describe('Edit User', function() {
    it('should be denied for a non-authenticated user', function(done) {
        testUtils.putAsAnonymous({
            route: '/user/some-user-uuid',
            data: {
                firstName: 'Updated',
                lastName: 'User',
                email: 'newly.updated@user.com',
                password: 'A super awesome passphrase, to appease the password gods.'
            },
            expectedStatus: 403, // forbidden
            end: async (err, res) => {
                if (err) {
                    console.debug(res.body);

                    return done(err);
                }

                return done();
            }
        });
    });

    it('should be denied for a non-admin user', function(done) {
        testUtils.putAsUser({
            route: '/user/some-user-uuid',
            data: {
                firstName: 'Updated',
                lastName: 'User',
                email: 'newly.updated@user.com',
                password: 'A super awesome passphrase, to appease the password gods.'
            },
            expectedStatus: 403, // forbidden
            end: async (err, res) => {
                if (err) {
                    console.debug(res.body);

                    return done(err);
                }

                return done();
            }
        });
    });

    it('should update a user correctly', function(done) {
        const firstName = 'Updated';
        const lastName = 'User';
        const email = 'newly.updated@user.com';
        const role = 'admin';

        testUtils.putAsAdmin({
            route: '/user/' + testUtils.fixtures.user[2].id,
            data: {
                firstName,
                lastName,
                email,
                role
            },
            expectedStatus: 200, // ok
            end: (err, res) => {
                if (err) {
                    console.debug(res.body);

                    return done(err);
                }

                should.exist(res.body.user);
                res.body.user.id.should.eq(testUtils.fixtures.user[2].id);
                res.body.user.firstName.should.not.eq(testUtils.fixtures.user[2].firstName);
                res.body.user.lastName.should.not.eq(testUtils.fixtures.user[2].lastName);
                res.body.user.email.should.not.eq(testUtils.fixtures.user[2].email);
                res.body.user.role.should.not.eq(testUtils.fixtures.user[2].role);

                res.body.user.firstName.should.eq(firstName);
                res.body.user.lastName.should.eq(lastName);
                res.body.user.email.should.eq(email);
                res.body.user.role.should.eq(role);

                // Reset the data
                testUtils.putAsAdmin({
                    route: '/user/' + testUtils.fixtures.user[2].id,
                    data: {
                        firstName: testUtils.fixtures.user[2].firstName,
                        lastName: testUtils.fixtures.user[2].lastName,
                        email: testUtils.fixtures.user[2].email,
                        role: testUtils.fixtures.user[2].role
                    },
                    expectedStatus: 200, // ok
                    end: (err2, res2) => {
                        if (err2) {
                            console.debug(res2.body);

                            return done(err2);
                        }

                        return done();
                    }
                });
            }
        });
    });

    it('should not allow edits to soft-deleted users', (done) => {
        testUtils.putAsAdmin({
            route: '/user/' + testUtils.fixtures.user[3].id,
            data: {
                firstName: 'Bob',
                lastName: 'Lobla',
                email: 'no@pe.come'
            },
            expectedStatus: 400, // bad request
            end: (err, res) => {
                if (err) {
                    console.debug(res.body);

                    return done(err);
                }

                res.body.should.haveOwnProperty('errorMessages');
                res.body.errorMessages.length.should.eq(1);
                res.body.errorMessages[0].should.eq('This user has been deleted, and can not be edited until reactivated.');

                return done();
            }
        });
    });
});
