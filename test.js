const test = require('brittle')
const { Version } = require('.')

test('parse version', (t) => {
  const cases = [
    ['0.0.0', new Version(0, 0, 0)],
    ['1.2.3', new Version(1, 2, 3)],
    ['12.345.6789', new Version(12, 345, 6789)],

    ['1.2.3-0', new Version(1, 2, 3, { prerelease: '0' })],
    ['1.2.3-456', new Version(1, 2, 3, { prerelease: '456' })],
    ['1.2.3-0abc', new Version(1, 2, 3, { prerelease: '0abc' })],
    ['1.2.3-456abc', new Version(1, 2, 3, { prerelease: '456abc' })],
    ['1.2.3-abc', new Version(1, 2, 3, { prerelease: 'abc' })],

    ['1.2.3+0', new Version(1, 2, 3, { build: '0' })],
    ['1.2.3+01', new Version(1, 2, 3, { build: '01' })],
    ['1.2.3+456', new Version(1, 2, 3, { build: '456' })],
    ['1.2.3+0abc', new Version(1, 2, 3, { build: '0abc' })],
    ['1.2.3+456abc', new Version(1, 2, 3, { build: '456abc' })],
    ['1.2.3+abc', new Version(1, 2, 3, { build: 'abc' })],

    ['1.2.3-456+abc', new Version(1, 2, 3, { prerelease: '456', build: 'abc' })]
  ]

  for (const [input, expected] of cases) {
    t.alike(Version.parse(input), expected, input)
  }
})

test('parse invalid version', (t) => {
  const cases = [
    '01.2.3',
    '1.02.3',
    '1.2.03',

    '1.2.3-',
    '1.2.3-01'
  ]

  for (const input of cases) {
    t.exception(() => Version.parse(input), /INVALID_VERSION/, input)
  }
})
