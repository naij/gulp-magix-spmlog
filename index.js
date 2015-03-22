var fs        = require('fs');
var path      = require("path");
var util      = require('util');
var gutil     = require('gulp-util');
var through2  = require('through2');
var sutil     = require('./lib/sutil');
var sizzle    = require('./lib/sizzle');
var Error     = gutil.PluginError;


/**
 * 给满足筛选条件的节点添加data-spm-click属性
 * 对于已经生成过data-spm-click属性的节点，直接跳过
 * 因为data-spm-click属性需要保持固定，只初始化生成一次
 * 如果需要重新生成，可以把原来的属性删除掉
 */ 

function spmlog(options) {
    var logkey = options.logkey;
    var filter = options.filter;

    return through2.obj(function(file, enc, cb) {

        if (!logkey) {
            return cb(new Error('spmlog', '缺少黄金令箭埋点串字段：logkey'));
        }

        if (!filter || !util.isArray(filter)) {
            return cb(new Error('spmlog', '缺少元素过滤规则字段：filter'));
        }

        var html = file.contents.toString('utf8');
        var filename = file.relative;
        var clickStr = 'gostr=/' + logkey + ';locaid=d';

        filter.forEach(function (item) {
            var pattern = sizzle(item);

            if (!pattern || !util.isArray(pattern)) {
                return cb(new Error('spmlog', 'spmlog暂不支持此元素过滤器：' + item));
            }

            var rmatch = new RegExp('(' + pattern[0] + '(?!\\s*data-spm-click="[^\\"]+"))', 'g');
            var rvalue = new RegExp(pattern[1]);
            
            html = html.replace(rmatch, function (m, $1, $2) {
                if (rvalue.test($2)) {
                    var locaid = sutil.genRandom().substring(0, 8);
                    return $1 + ' ' + 'data-spm-click="' + clickStr + locaid + '"';
                } else {
                    return $1;
                }
            });
        });

        file.contents = new Buffer(html);

        cb(null, file);
    });
}

module.exports = spmlog;