# gulp-magix-spmlog

[![NPM version](https://img.shields.io/badge/npm-v1.0.1-orange.svg)](https://www.npmjs.org/package/gulp-magix-spmlog)

## Installation

```sh
npm install --save-dev gulp-magix-spmlog
```

## Usage

```javascript
var gulp    = require('gulp');
var spmlog  = require('gulp-magix-spmlog');

gulp.task('spmlog', function () {
    gulp.src('./app/views/*/*.html')
        .pipe(spmlog({
            logkey: 'mylogkey',
            filter: [
                '[mx-click]',
                '[href^="#!"]'
            ]
        }))
        .pipe(gulp.dest('./app/views'));
});
```

## Options

- `logkey`
    
    其值为黄金令箭中的所属业务段（必填），业务段在令箭申请中心申请，用于令箭日志数据的订阅和分发，在后续扩展实时计算和展现的时候十分重要。

    * 如果模板里面已经存在logkey，并且与当前要设置的logkey不相同，则会被替换为设置的logkey *

- `filter`
    
    需要埋点的元素过滤器（必填），只有满足相关过滤器的元素才会打点。

    目前支持：

    * id选择器
    * class选择器
    * attr选择器

    各个选择器格式：

    * id选择器： 
        * '#main' 匹配`id`值为`main`的元素
    * class选择器：
        * '.content' 匹配`class`值为`content`的所有元素
    * attr选择器：
        * '[mx-click]' 匹配带有 `mx-click` 属性的所有元素
        * '[href="#"]' 匹配带有 `href` 属性并且属性值为`#`的所有元素
        * '[href^="#!"]' 匹配带有 `href` 属性并且属性值以`#!`开头的所有元素
        * '[src$="jpg"]' 匹配带有 `href` 属性并且属性值以`jpg`结尾的所有元素
        * '[custom*="value"]' 匹配带有 `custom` 属性并且属性值包含`value`的所有元素
