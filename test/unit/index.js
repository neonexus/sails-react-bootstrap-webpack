describe('Unit Tests', function() {
    require('fs').readdirSync(__dirname).forEach(function(file) {
        if (file !== 'index.js') {
            require(__dirname + '/' + file);
        }
    });
});
