import request from 'superagent';

let requester = null;

class api {
    constructor(baseUrl) {
        this.baseUrl = baseUrl || process.env.baseUrl; // process.env is coming from webpack

        this.baseUrl += '/api/v1';

        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
        this.put = this.put.bind(this);
        this.del = this.del.bind(this);

        requester = request.agent(); // cookie handler
    }

    static __buildRequestObj(thisReq, req) {
        if (sessionStorage.getItem('csrf')) {
            thisReq.set('x-csrf-token', sessionStorage.getItem('csrf'));
        }

        if (req.query) {
            thisReq.query(req.query);
        }

        if (req.headers) {
            thisReq.set(req.headers);
        }

        if (req.body) {
            thisReq.send(req.body);
        }

        thisReq.accept('json');

        return thisReq;
    }

    static __buildResponseWrapper(res, cb) {
        if (res.body._csrf) {
            sessionStorage.setItem('csrf', res.body._csrf);
            delete res.body._csrf; // don't expose CSRF token to underlying code
        }

        cb(res.body, res);
    }

    get(req, good, bad) {
        if (typeof req === 'string') {
            req = {url: req};
        }

        if (!bad) {
            bad = (err, body) => {
                console.error('API Error', req, body, err);
            };
        }

        const thisReq = api.__buildRequestObj(requester.get(this.baseUrl + req.url).withCredentials(), req);

        return thisReq.then((res) => api.__buildResponseWrapper(res, good), (err) => bad(err, err.response.body));
    }

    post(req, good, bad) {
        if (typeof req === 'string') {
            req = {url: req};
        }

        if (!bad) {
            bad = (err, body) => {
                console.error('API Error', req, body, err);
            };
        }

        const thisReq = api.__buildRequestObj(requester.post(this.baseUrl + req.url).withCredentials(), req);

        return thisReq.then((res) => api.__buildResponseWrapper(res, good), (err) => bad(err, err.response.body));
    }

    put(req, good, bad) {
        if (typeof req === 'string') {
            req = {url: req};
        }

        if (!bad) {
            bad = (err, body) => {
                console.error('API Error', req, body, err);
            };
        }

        const thisReq = api.__buildRequestObj(requester.put(this.baseUrl + req.url).withCredentials(), req);

        return thisReq.then((res) => api.__buildResponseWrapper(res, good), (err) => bad(err, err.response.body));
    }

    del(req, good, bad) {
        if (typeof req === 'string') {
            req = {url: req};
        }

        if (!bad) {
            bad = (err, body) => {
                console.error('API Error', req, body, err);
            };
        }

        const thisReq = api.__buildRequestObj(requester.del(this.baseUrl + req.url).withCredentials(), req);

        return thisReq.then((res) => api.__buildResponseWrapper(res, good), (err) => bad(err, err.response.body));
    }
}

export default api;
