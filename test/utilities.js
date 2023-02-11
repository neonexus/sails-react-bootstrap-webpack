const st = require('supertest');

module.exports = function(sails) {
    // Login handling is dealt with in startTests.js
    const sendRequestAsAnon = st(sails.hooks.http.app); // anon browser
    const sendRequestAsUser = st.agent(sails.hooks.http.app); // browser with cookies
    const sendRequestAsAdmin = st.agent(sails.hooks.http.app);

    sendRequestAsUser._csrf = 'none';
    sendRequestAsAdmin._csrf = 'none';

    function sendRequest(requestAs, config) {
        config = _.merge({
            end: function () {
                console.error('config', config);
                throw new Error('No end function supplied');
            },
            expectedStatus: 200,
            query: {},
            data: {}
        }, config);

        const apiPrefix = '/api/v1';

        switch (config.method) {
            case 'GET':
                requestAs
                    .get(apiPrefix + config.route)
                    .query(config.query)
                    .expect(config.expectedStatus)
                    .expect((res) => {
                        if (typeof config.expect === 'function') {
                            config.expect(res);
                        }
                    })
                    .end(config.end);
                break;
            case 'POST':
                if (requestAs._csrf) {
                    requestAs.set('X-CSRF-TOKEN', requestAs._csrf);
                }

                requestAs
                    .post(apiPrefix + config.route)
                    .query(config.query)
                    .send(config.data)
                    .expect(config.expectedStatus)
                    .expect((res) => {
                        if (res.body._csrf) {
                            requestAs._csrf = res.body._csrf;
                        }

                        if (typeof config.expect === 'function') {
                            config.expect(res);
                        }
                    })
                    .end(config.end);
                break;
            case 'PUT':
                if (requestAs._csrf) {
                    requestAs.set('X-CSRF-TOKEN', requestAs._csrf);
                }

                requestAs
                    .put(apiPrefix + config.route)
                    .query(config.query)
                    .send(config.data)
                    .expect(config.expectedStatus)
                    .expect((res) => {
                        if (res.body._csrf) {
                            requestAs._csrf = res.body._csrf;
                        }

                        if (typeof config.expect === 'function') {
                            config.expect(res);
                        }
                    })
                    .end(config.end);
                break;
            case 'DELETE':
                if (requestAs._csrf) {
                    requestAs.set('X-CSRF-TOKEN', requestAs._csrf);
                }

                requestAs
                    .delete(apiPrefix + config.route)
                    .query(config.query)
                    .send(config.data)
                    .expect(config.expectedStatus)
                    .expect((res) => {
                        if (res.body._csrf) {
                            requestAs._csrf = res.body._csrf;
                        }

                        if (typeof config.expect === 'function') {
                            config.expect(res);
                        }
                    })
                    .end(config.end);
                break;
            default:
                throw new Error('Invalid method: ' + config.method);
        }
    }

    return {
        getAsAnonymous: (config) => sendRequest(sendRequestAsAnon, _.merge({}, config, {method: 'GET'})),
        getAsUser: (config) => sendRequest(sendRequestAsUser, _.merge({}, config, {method: 'GET'})),
        getAsAdmin: (config) => sendRequest(sendRequestAsAdmin, _.merge({}, config, {method: 'GET'})),

        postAsAnonymous: (config) => sendRequest(sendRequestAsAnon, _.merge({}, config, {method: 'POST'})),
        postAsUser: (config) => sendRequest(sendRequestAsUser, _.merge({}, config, {method: 'POST'})),
        postAsAdmin: (config) => sendRequest(sendRequestAsAdmin, _.merge({}, config, {method: 'POST'})),

        putAsAnonymous: (config) => sendRequest(sendRequestAsAnon, _.merge({}, config, {method: 'PUT'})),
        putAsUser: (config) => sendRequest(sendRequestAsUser, _.merge({}, config, {method: 'PUT'})),
        putAsAdmin: (config) => sendRequest(sendRequestAsAdmin, _.merge({}, config, {method: 'PUT'})),

        deleteAsAnonymous: (config) => sendRequest(sendRequestAsAnon, _.merge({}, config, {method: 'DELETE'})),
        deleteAsUser: (config) => sendRequest(sendRequestAsUser, _.merge({}, config, {method: 'DELETE'})),
        deleteAsAdmin: (config) => sendRequest(sendRequestAsAdmin, _.merge({}, config, {method: 'DELETE'}))
    };
};
