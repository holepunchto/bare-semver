const test = require('brittle')
const { Version, Range, Comparator, constants } = require('.')

const { EQ, LT, LTE, GT, GTE } = constants

test('parse version', (t) => {
  const cases = [
    ['0.0.0', new Version(0, 0, 0)],
    ['1.2.3', new Version(1, 2, 3)],
    ['12.345.6789', new Version(12, 345, 6789)],
    ['10.100.1000', new Version(10, 100, 1000)]
  ]

  for (const [input, expected] of cases) {
    t.alike(Version.parse(input), expected, input)
  }
})

test('parse version with prerelease', (t) => {
  const cases = [
    ['1.2.3-0', new Version(1, 2, 3, { prerelease: ['0'] })],
    ['1.2.3-456', new Version(1, 2, 3, { prerelease: ['456'] })],
    ['1.2.3-0abc', new Version(1, 2, 3, { prerelease: ['0abc'] })],
    ['1.2.3-456abc', new Version(1, 2, 3, { prerelease: ['456abc'] })],
    ['1.2.3-abc', new Version(1, 2, 3, { prerelease: ['abc'] })],

    ['1.2.3-abc.def', new Version(1, 2, 3, { prerelease: ['abc', 'def'] })]
  ]

  for (const [input, expected] of cases) {
    t.alike(Version.parse(input), expected, input)
  }
})

test('parse version with build', (t) => {
  const cases = [
    ['1.2.3+0', new Version(1, 2, 3, { build: ['0'] })],
    ['1.2.3+01', new Version(1, 2, 3, { build: ['01'] })],
    ['1.2.3+456', new Version(1, 2, 3, { build: ['456'] })],
    ['1.2.3+0abc', new Version(1, 2, 3, { build: ['0abc'] })],
    ['1.2.3+456abc', new Version(1, 2, 3, { build: ['456abc'] })],
    ['1.2.3+abc', new Version(1, 2, 3, { build: ['abc'] })],

    ['1.2.3+abc.def', new Version(1, 2, 3, { build: ['abc', 'def'] })]
  ]

  for (const [input, expected] of cases) {
    t.alike(Version.parse(input), expected, input)
  }
})

test('parse version with prerelease and build', (t) => {
  const cases = [
    [
      '1.2.3-456+abc',
      new Version(1, 2, 3, { prerelease: ['456'], build: ['abc'] })
    ]
  ]

  for (const [input, expected] of cases) {
    t.alike(Version.parse(input), expected, input)
  }
})

test('parse invalid version', (t) => {
  const cases = ['01.2.3', '1.02.3', '1.2.03', '1.2.3-', '1.2.3-01']

  for (const input of cases) {
    try {
      Version.parse(input)
      t.fail(input)
    } catch (err) {
      t.comment(err.message)
      t.pass(input)
    }
  }
})

test('parse range', (t) => {
  const cases = [
    ['1.2.3', new Range([[new Comparator(EQ, new Version(1, 2, 3))]])],
    ['=1.2.3', new Range([[new Comparator(EQ, new Version(1, 2, 3))]])],
    ['<1.2.3', new Range([[new Comparator(LT, new Version(1, 2, 3))]])],
    ['<=1.2.3', new Range([[new Comparator(LTE, new Version(1, 2, 3))]])],
    ['>1.2.3', new Range([[new Comparator(GT, new Version(1, 2, 3))]])],
    ['>=1.2.3', new Range([[new Comparator(GTE, new Version(1, 2, 3))]])],
    ['>1.10.0', new Range([[new Comparator(GT, new Version(1, 10, 0))]])]
  ]

  for (const [input, expected] of cases) {
    t.alike(Range.parse(input), expected, input)
  }
})

test('parse partial range', (t) => {
  const cases = [
    ['>=1', new Range([[new Comparator(GTE, new Version(1, 0, 0))]])],
    ['>=1.2', new Range([[new Comparator(GTE, new Version(1, 2, 0))]])],
    ['>=1.2.3', new Range([[new Comparator(GTE, new Version(1, 2, 3))]])]
  ]

  for (const [input, expected] of cases) {
    t.alike(Range.parse(input), expected, input)
  }
})

test('parse range set', (t) => {
  const cases = [
    [
      '1.2.0 || 1.2.3',
      new Range([
        [new Comparator(EQ, new Version(1, 2, 0))],
        [new Comparator(EQ, new Version(1, 2, 3))]
      ])
    ]
  ]

  for (const [input, expected] of cases) {
    t.alike(Range.parse(input), expected, input)
  }
})

test('parse range comparator set', (t) => {
  const cases = [
    [
      '>1.2.0 <1.2.3',
      new Range([
        [
          new Comparator(GT, new Version(1, 2, 0)),
          new Comparator(LT, new Version(1, 2, 3))
        ]
      ])
    ]
  ]

  for (const [input, expected] of cases) {
    t.alike(Range.parse(input), expected, input)
  }
})

test('compare version', (t) => {
  const cases = [
    [new Version(1, 2, 3), new Version(1, 2, 3), 0],

    [new Version(1, 2, 4), new Version(1, 2, 3), 1],
    [new Version(1, 2, 3), new Version(1, 2, 4), -1],

    [new Version(1, 2, 3), new Version(1, 1, 3), 1],
    [new Version(1, 1, 3), new Version(1, 2, 3), -1],

    [new Version(1, 2, 3), new Version(0, 2, 3), 1],
    [new Version(0, 2, 3), new Version(1, 2, 3), -1]
  ]

  for (const [a, b, expected] of cases) {
    t.alike(Version.compare(a, b), expected, `${a}, ${b}`)
  }
})

test('compare version with prerelease', (t) => {
  const cases = [
    [
      new Version(1, 2, 3, { prerelease: ['a'] }),
      new Version(1, 2, 3, { prerelease: ['a'] }),
      0
    ],

    [new Version(1, 2, 3), new Version(1, 2, 3, { prerelease: ['a'] }), 1],
    [new Version(1, 2, 3, { prerelease: ['a'] }), new Version(1, 2, 3), -1],

    [
      new Version(1, 2, 3, { prerelease: ['a'] }),
      new Version(1, 2, 3, { prerelease: ['1'] }),
      1
    ],
    [
      new Version(1, 2, 3, { prerelease: ['1'] }),
      new Version(1, 2, 3, { prerelease: ['a'] }),
      -1
    ],

    [
      new Version(1, 2, 3, { prerelease: ['a.b'] }),
      new Version(1, 2, 3, { prerelease: ['a'] }),
      1
    ],
    [
      new Version(1, 2, 3, { prerelease: ['a'] }),
      new Version(1, 2, 3, { prerelease: ['a.b'] }),
      -1
    ]
  ]

  for (const [a, b, expected] of cases) {
    t.alike(Version.compare(a, b), expected, `${a}, ${b}`)
  }
})

test('test range', (t) => {
  const cases = [
    [
      new Range([[new Comparator(LT, new Version(1, 2, 3))]]),
      [
        [new Version(1, 2, 2), true],
        [new Version(1, 2, 3), false],
        [new Version(1, 2, 4), false]
      ]
    ]
  ]

  for (const [range, versions] of cases) {
    t.comment(`${range}`)

    for (const [version, expected] of versions) {
      t.is(range.test(version), expected, `${version}, ${expected}`)
    }
  }
})
