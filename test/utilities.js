module.exports = function(sails, _){
    return {
        sendRequest: require('supertest')(sails.hooks.http.app) // set up our "browser" instance
    };
};
