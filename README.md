# gulp-magix-spmlog

[![NPM version](https://img.shields.io/badge/npm-v1.0.0-orange.svg)](https://www.npmjs.org/package/gulp-magix-spmlog)

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
            logkey: 'tblm.88.1',
            filter: [
                'mx-click="[^\\"]+"',
                'href="#![^\\"]+"'
            ]
        }))
        .pipe(gulp.dest('./app/views'));
});
```

## Options

- `logkey`
    
    其值为黄金令箭中的所属业务段（必填），业务段在令箭申请中心申请，用于令箭日志数据的订阅和分发，在后续扩展实时计算和展现的时候十分重要。

- `filter`
    
    需要埋点的元素过滤器（必填），只有满足相关过滤器的元素才会打点。支持正则。
