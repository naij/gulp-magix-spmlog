'use strict';

var fs = require('fs')
var path = require('path')
var should = require('should')
var Vinyl = require('vinyl')
var gutil = require('gulp-util')
var spmlog = require('../')

function createVinyl(fileName, contents) {
  var base = path.join(__dirname, 'fixtures')
  var filePath = path.join(base, fileName)

  return new gutil.File({
    cwd: __dirname,
    base: base,
    path: filePath,
    contents: contents || fs.readFileSync(filePath)
  })
}

function parse(fileContent) {
  fileContent = fileContent.replace(/locaid=(\w{9})/, function(m, $1) {
    return 'locaid=*'
  })

  return fileContent
}

describe('gulp-magix-spmlog', function() {
  it('filter是id的测试', function(done) {
    var testFile = createVinyl('id.html')
    var stream = spmlog({
      logkey: '*.*.*',
      filter: [
        '#block'
      ]
    })
    stream.on('data', function(file) {
      should.exist(file)
      should.exist(file.path)
      should.exist(file.relative)
      should.exist(file.contents)
      let contents = parse(String(file.contents))
      contents.should.equal(
        fs.readFileSync(path.join(__dirname, 'expected/id.html'), 'utf8')
      )
      done()
    })
    stream.write(testFile)
  })

  it('filter是class的测试', function(done) {
    var testFile = createVinyl('class.html')
    var stream = spmlog({
      logkey: '*.*.*',
      filter: [
        '.block'
      ]
    })
    stream.on('data', function(file) {
      should.exist(file)
      should.exist(file.path)
      should.exist(file.relative)
      should.exist(file.contents)
      let contents = parse(String(file.contents))
      contents.should.equal(
        fs.readFileSync(path.join(__dirname, 'expected/class.html'), 'utf8')
      )
      done()
    })
    stream.write(testFile)
  })

  it('filter是属性等于一个值的测试', function(done) {
    var testFile = createVinyl('attr_equal_value.html')
    var stream = spmlog({
      logkey: '*.*.*',
      filter: [
        '[mx-click]'
      ]
    })
    stream.on('data', function(file) {
      should.exist(file)
      should.exist(file.path)
      should.exist(file.relative)
      should.exist(file.contents)
      let contents = parse(String(file.contents))
      contents.should.equal(
        fs.readFileSync(path.join(__dirname, 'expected/attr_equal_value.html'), 'utf8')
      )
      done()
    })
    stream.write(testFile)
  })

  it('filter是属性以一个值开头的测试', function(done) {
    var testFile = createVinyl('attr_begin_with_value.html')
    var stream = spmlog({
      logkey: '*.*.*',
      filter: [
        '[href^="#!"]'
      ]
    })
    stream.on('data', function(file) {
      should.exist(file)
      should.exist(file.path)
      should.exist(file.relative)
      should.exist(file.contents)
      let contents = parse(String(file.contents))
      contents.should.equal(
        fs.readFileSync(path.join(__dirname, 'expected/attr_begin_with_value.html'), 'utf8')
      )
      done()
    })
    stream.write(testFile)
  })

  it('filter是属性包含一个值的测试', function(done) {
    var testFile = createVinyl('attr_contains_with_value.html')
    var stream = spmlog({
      logkey: '*.*.*',
      filter: [
        '[href*="api.test.com"]'
      ]
    })
    stream.on('data', function(file) {
      should.exist(file)
      should.exist(file.path)
      should.exist(file.relative)
      should.exist(file.contents)
      let contents = parse(String(file.contents))
      contents.should.equal(
        fs.readFileSync(path.join(__dirname, 'expected/attr_contains_with_value.html'), 'utf8')
      )
      done()
    })
    stream.write(testFile)
  })

  it('filter是属性以一个值结尾的测试', function(done) {
    var testFile = createVinyl('attr_end_with_value.html')
    var stream = spmlog({
      logkey: '*.*.*',
      filter: [
        '[href$="json"]'
      ]
    })
    stream.on('data', function(file) {
      should.exist(file)
      should.exist(file.path)
      should.exist(file.relative)
      should.exist(file.contents)
      let contents = parse(String(file.contents))
      contents.should.equal(
        fs.readFileSync(path.join(__dirname, 'expected/attr_end_with_value.html'), 'utf8')
      )
      done()
    })
    stream.write(testFile)
  })

  it('filter是自定义属性的测试', function(done) {
    var testFile = createVinyl('custom_attr.html')
    var stream = spmlog({
      logkey: '*.*.*',
      filter: [
        '[goldclick]'
      ]
    })
    stream.on('data', function(file) {
      should.exist(file)
      should.exist(file.path)
      should.exist(file.relative)
      should.exist(file.contents)
      let contents = parse(String(file.contents))
      contents.should.equal(
        fs.readFileSync(path.join(__dirname, 'expected/custom_attr.html'), 'utf8')
      )
      done()
    })
    stream.write(testFile)
  })

  it('更新logkey的测试', function(done) {
    var testFile = createVinyl('update_logkey.html')
    var stream = spmlog({
      logkey: '1.2.3'
    })
    stream.on('data', function(file) {
      should.exist(file)
      should.exist(file.path)
      should.exist(file.relative)
      should.exist(file.contents)
      let contents = parse(String(file.contents))
      contents.should.equal(
        fs.readFileSync(path.join(__dirname, 'expected/update_logkey.html'), 'utf8')
      )
      done()
    })
    stream.write(testFile)
  })
})