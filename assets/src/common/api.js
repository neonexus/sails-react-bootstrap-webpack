import request from 'superagent';

class api {
    constructor(baseUrl) {
        this.baseUrl = baseUrl || process.env.baseUrl;
        this.request = request.agent(); // cookie handler
        this.queue = [];
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

        const thisReq = api.__buildRequestObj(this.request.get(this.baseUrl + req.url), req);

        thisReq.then((res) => api.__buildResponseWrapper(res, good), bad);
    }

    post(req, good, bad) {
        if (typeof req === 'string') {
            req = {url: req};
        }

        const thisReq = api.__buildRequestObj(this.request.post(this.baseUrl + req.url), req);

        thisReq.then((res) => api.__buildResponseWrapper(res, good), bad);
    }

    put(req, good, bad) {
        if (typeof req === 'string') {
            req = {url: req};
        }

        const thisReq = api.__buildRequestObj(this.request.put(this.baseUrl + req.url), req);

        thisReq.then((res) => api.__buildResponseWrapper(res, good), bad);
    }

    del(req, good, bad) {
        if (typeof req === 'string') {
            req = {url: req};
        }

        const thisReq = api.__buildRequestObj(this.request.del(this.baseUrl + req.url), req);

        thisReq.then((res) => api.__buildResponseWrapper(res, good), bad);
    }
}

export default api;
