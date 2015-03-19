var crypto = require('crypto');

module.exports = {
    genRandom: function() {
        var buf = crypto.randomBytes(16);
        return buf.toString('hex');
    },
    regExpEscape: function (str) {
        return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
}