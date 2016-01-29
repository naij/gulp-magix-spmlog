/**
 * 借鉴了jQuery Sizzle 选择器中的部分功能
 * 目前实现了:
 *  1、id选择器
 *  2、class选择器
 *  3、attr部分选择器（= ^= *= $=）
 **/

// http://www.w3.org/TR/css3-selectors/#whitespace
var whitespace = "[\\x20\\t\\r\\n\\f]"

// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
var identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+"

// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
var attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
    // Operator (capture 2)
    "*([*^$|!~]?=)" + whitespace +
    // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
    "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
    "*\\]"


// attr选择器正则
var rattr = new RegExp('^' + attributes )

// id|tag|class选择器正则
var rquick = new RegExp('^(?:#([\\w-]+)|(\\w+)|\\.([\\w-]+))$')

function attrPreFilter(match) {
  match[3] = ( match[3] || match[4] || match[5] || "" )

  if ( match[2] === "~=" ) {
    match[3] = " " + match[3] + " "
  }

  return match.slice( 0, 4 )
}

module.exports = function sizzle(selector) {
  var match, m

  if (match = rquick.exec(selector)) {
    // id选择器
    if ( m = match[1] ) {
      return [
        'id="([^\\"]+)"',
        '(^|' + whitespace + ')' + m + '(' + whitespace + '|$)'
      ]
    // tag选择器
    } else if ( m = match[2] ) {
      return [
        '<([^<>\\x20\\t\\r\\n\\f]+)',
        '^' + m.toLowerCase() + '$'
      ]
    // class选择器
    } else if ( m = match[3] ) {
      return [
        'class="([^\\"]+)"',
        '(^|' + whitespace + ')' + m + '(' + whitespace + '|$)'
      ]
    }
  // attr选择器
  } else if (match = rattr.exec(selector)) {
    m = attrPreFilter(match)

    if (!m[2]) {
      return [
        m[1] + '="([^\\"]+)"',
        '[^\\"]+'
      ]
    } else if (m[2] == '=') {
      return [
        m[1] + '="([^\\"]+)"',
        '^' + whitespace + '*' + m[3] + whitespace + '*'
      ]
    } else if (m[2] == '*=') {
      return [
        m[1] + '="([^\\"]+)"',
        whitespace + '*' + m[3] + whitespace + '*'
      ]
    } else if (m[2] == '^=') {
      return [
        m[1] + '="([^\\"]+)"',
        '^' + whitespace + '*' + m[3] + whitespace + '*'
      ]
    } else if (m[2] == '$=') {
      return [
        m[1] + '="([^\\"]+)"',
        whitespace + '*' + m[3] + whitespace + '*' + '$'
      ]
    } else {
      return null
    }
  } else {
    return null
  }
}