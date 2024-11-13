const errors = require('./errors')

const Version = module.exports = exports = class Version {
  constructor (major, minor, patch, opts = {}) {
    const {
      prerelease = null,
      build = null
    } = opts

    this.major = major
    this.minor = minor
    this.patch = patch
    this.prerelease = prerelease
    this.build = build
  }
}

exports.parse = function parse (input) {
  let i = 0
  let c

  const unexpected = (expected) => {
    let msg

    if (i >= input.length) {
      msg = `Unexpected end of input in ${input}`
    } else {
      msg = `Unexpected token '${input[i]}' in ${input} at position ${i}`
    }

    if (expected) msg += `, ${expected}`

    throw errors.INVALID_VERSION(msg, unexpected)
  }

  const components = []

  while (components.length < 3) {
    c = input[i]

    if (components.length > 0) {
      if (c === '.') c = input[++i]
      else unexpected('expected \'.\'')
    }

    if (c === '0') {
      components.push(0)

      i++
    } else if (c >= '1' && c <= '9') {
      let j = 0
      do c = input[i + ++j]
      while (c >= '1' && c <= '9')

      components.push(parseInt(input.substring(i, i + j)))

      i += j
    } else unexpected('expected [0-9]')
  }

  let prerelease = null

  if (input[i] === '-') {
    c = input[++i]

    prerelease = ''

    let j = 0

    while (c >= '0' && c <= '9') c = input[i + ++j]

    let isNumeric = false

    if (j) {
      prerelease += input.substring(i, i + j)

      c = input[i += j]

      isNumeric = prerelease[0] !== '0' || prerelease.length === 1
    }

    j = 0

    while ((c >= '0' && c <= '9') || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '-') c = input[i + ++j]

    if (j) {
      prerelease += input.substring(i, i + j)

      i += j
    } else if (!isNumeric) unexpected('expected [a-zA-Z-]')
  }

  let build = null

  if (input[i] === '+') {
    c = input[++i]

    build = ''

    let j = 0

    while ((c >= '0' && c <= '9') || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '-') c = input[i + ++j]

    if (j) {
      build += input.substring(i, i + j)

      i += j
    } else unexpected('expected [0-9a-zA-Z-]')
  }

  if (i < input.length) unexpected('expected end of input')

  return new Version(...components, { prerelease, build })
}
