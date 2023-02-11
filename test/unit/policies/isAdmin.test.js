describe('isAdmin Policy', function() {
    it('should call next() if valid role', async function() {
        const req = {
            session: {
                user: {
                    role: 'admin'
                }
            }
        };
        const next = chai.spy();

        sails.registry.policies.isadmin(req, {}, next);

        next.should.have.been.called.once;
    });

    it('should call res.forbidden() if role is not valid', async function(){
        const req = {
            session: {
                user: {
                    role: 'notadmin'
                }
            }
        };
        const res = {
            forbidden: chai.spy()
        };

        sails.registry.policies.isadmin(req, res);

        res.forbidden.should.have.been.called.once;
    });

    it('should call res.forbidden() if role is empty', async function(){
        const req = {};
        const res = {
            forbidden: chai.spy()
        };

        sails.registry.policies.isadmin(req, res);

        res.forbidden.should.have.been.called.once;
    });
});
