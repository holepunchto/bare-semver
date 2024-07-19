const test = require('brittle')
const { Version } = require('.')

test('parse version', (t) => {
  const cases = [
    ['0.0.0', new Version(0, 0, 0)],
    ['1.2.3', new Version(1, 2, 3)],
    ['12.345.6789', new Version(12, 345, 6789)]
  ]

  for (const [input, expected] of cases) {
    t.alike(Version.parse(input), expected, input)
  }
})

test('parse invalid version', (t) => {
  const cases = [
    '01.2.3',
    '1.02.3',
    '1.2.03'
  ]

  for (const input of cases) {
    t.exception(() => Version.parse(input), /INVALID_VERSION/, input)
  }
})
