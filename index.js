var fs        = require('fs');
var path      = require("path");
var util      = require('util');
var gutil     = require('gulp-util');
var through2  = require('through2');
var sutil     = require('./lib/sutil');
var Error     = gutil.PluginError;

function spmlog(options) {
    var logkey = options.logkey;
    var filter = options.filter;

    return through2.obj(function(file, enc, cb) {

        if (!logkey) {
            return cb(Error('spmlog', '缺少黄金令箭埋点串字段:logkey'));
        }

        if (!filter || !util.isArray(filter)) {
            return cb(Error('spmlog', '缺少元素筛选规则字段:filter'));
        }

        var html = file.contents.toString('utf8');
        var filename = file.relative;
        var clickStr = 'gostr=/' + logkey + ';locaid=d';

        // 如果已经生成过data-spm-click属性的节点需要跳过
        filter.forEach(function (item) {
            var matchExpr = new RegExp('(' + item + '(?!\\s*data-spm-click="[^\\"]+"))', 'g');
            html = html.replace(matchExpr, function (m, $1) {
                var locaid = sutil.genRandom().substring(0, 8);
                return $1 + ' data-spm-click="' + clickStr + locaid + '"';
            });
        });

        file.contents = new Buffer(html);

        cb(null, file);
    });
}

module.exports = spmlog;