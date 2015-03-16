var fs        = require('fs');
var path      = require("path");
var util      = require('util');
var Stream    = require('stream');
var jsdom     = require('jsdom');
var jquery    = require('jquery');
var crypto    = require('crypto');
var gutil     = require('gulp-util');
var through2  = require('through2');
var Error     = gutil.PluginError;
var env       = jsdom.env;

function spmlog(options) {
    var logkey = options.logkey;
    var sizzle = options.sizzle;

    return through2.obj(function(file, enc, cb) {

        if (!logkey) {
            return cb(Error('spmlog', '缺少黄金令箭埋点串字段:logkey'));
        }

        if (!sizzle || !util.isArray(sizzle)) {
            return cb(Error('spmlog', '缺少元素筛选规则字段:sizzle'));
        }

        var html = file.contents.toString('utf8');
        var filename = file.relative;
        var spmStr = 'gostr=/' + logkey + ';locaid=d';

        env(html, function (errors, window) {
            var $ = jquery(window);
            var elements = [];

            // 根据筛选规则找出所有满足条件的元素
            sizzle.forEach(function (item, index) {
                $(item).each(function () {
                    elements.push($(this));
                });
            });

            // 循环所有元素根据filename+csspath+index生成唯一locaid
            elements.forEach(function (item, index) {
                var element = item;
                console.log(element);
                var cssPath = getCssPath(element);
                var locaid = md5(filename + cssPath + index).substring(0, 8);
                element.attr('data-spm-click', spmStr + locaid);
            });

            if (elements.length > 0) {
                file.contents = new Buffer($('body').html());
            }
            
            cb(null, file);
        });
    })
}

/**
 * 获取元素的完整css路径
 */
function getCssPath(element) {
    var paths = [];
    var element = element[0];
    var regexp = /\d+/g;

    for (; element && element.nodeType == 1; element = element.parentNode) {
        var selector = element.tagName.toLowerCase();
        var className = element.className || "";
        var classList = className.split(" ");
        if (classList && classList.length > 0) {
            if (!regexp.test(classList[0])) {
                selector += "." + classList[0];
            }
        }
        paths.splice(0, 0, selector);
        if (selector.indexOf("#") == 0) {
            break;
        }
    }

    return paths.length ? paths.join(" ") : null;
}

/**
 * md5加密
 */
function md5(str) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
}

module.exports = spmlog;