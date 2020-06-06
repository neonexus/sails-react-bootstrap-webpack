module.exports = {
    sync: true, // this is a synchronous helper

    friendlyName: 'Object For Each',

    description: 'Run a cb() on every item in an object.',

    inputs: {
        obj: {
            type: 'ref',
            required: true
        },
        cb: {
            type: 'ref',
            required: true
        },
        context: {
            type: 'ref'
        }
    },

    exits: {},

    fn: function(inputs){
        for (let item in inputs.obj) {
            // eslint-disable-next-line no-prototype-builtins
            if (inputs.obj.hasOwnProperty(item)) {
                if (!inputs.context) {
                    inputs.cb(inputs.obj[item], item);
                } else {
                    inputs.cb.call(inputs.context, inputs.obj[item], item);
                }
            }
        }
    }
};

