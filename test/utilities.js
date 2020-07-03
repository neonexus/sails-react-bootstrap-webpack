module.exports = function(sails, _){
    return {
        sendRequest: require('supertest')(sails.hooks.http.app) // setup our "browser" instance
    };
};
