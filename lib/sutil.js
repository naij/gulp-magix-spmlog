var crypto = require('crypto');

module.exports = {
    genRandom: function() {
        var buf = crypto.randomBytes(16);
        return buf.toString('hex');
    },
    RegExpEscape: function (str) {
        return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
}