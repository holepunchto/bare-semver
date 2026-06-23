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
  const cases = [['1.2.3-456+abc', new Version(1, 2, 3, { prerelease: ['456'], build: ['abc'] })]]

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
    ['>1.10.0', new Range([[new Comparator(GT, new Version(1, 10, 0))]])],
    ['>= 1.2.3', new Range([[new Comparator(GTE, new Version(1, 2, 3))]])],
    ['< 1.2.3', new Range([[new Comparator(LT, new Version(1, 2, 3))]])],
    ['= 1.2.3', new Range([[new Comparator(EQ, new Version(1, 2, 3))]])]
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

test('parse caret range', (t) => {
  const cases = [
    [
      '^1.2.3',
      new Range([
        [
          new Comparator(GTE, new Version(1, 2, 3)),
          new Comparator(LT, new Version(2, 0, 0, { prerelease: ['0'] }))
        ]
      ])
    ],
    [
      '^0.2.3',
      new Range([
        [
          new Comparator(GTE, new Version(0, 2, 3)),
          new Comparator(LT, new Version(0, 3, 0, { prerelease: ['0'] }))
        ]
      ])
    ],
    [
      '^0.0.3',
      new Range([
        [
          new Comparator(GTE, new Version(0, 0, 3)),
          new Comparator(LT, new Version(0, 0, 4, { prerelease: ['0'] }))
        ]
      ])
    ],
    [
      '^1.2.3-beta.2',
      new Range([
        [
          new Comparator(GTE, new Version(1, 2, 3, { prerelease: ['beta', '2'] })),
          new Comparator(LT, new Version(2, 0, 0, { prerelease: ['0'] }))
        ]
      ])
    ],
    [
      '^1.2.x',
      new Range([
        [
          new Comparator(GTE, new Version(1, 2, 0)),
          new Comparator(LT, new Version(2, 0, 0, { prerelease: ['0'] }))
        ]
      ])
    ],
    [
      '^0.0.x',
      new Range([
        [
          new Comparator(GTE, new Version(0, 0, 0)),
          new Comparator(LT, new Version(0, 1, 0, { prerelease: ['0'] }))
        ]
      ])
    ],
    [
      '^1.x',
      new Range([
        [
          new Comparator(GTE, new Version(1, 0, 0)),
          new Comparator(LT, new Version(2, 0, 0, { prerelease: ['0'] }))
        ]
      ])
    ],
    [
      '^0.x',
      new Range([
        [
          new Comparator(GTE, new Version(0, 0, 0)),
          new Comparator(LT, new Version(1, 0, 0, { prerelease: ['0'] }))
        ]
      ])
    ],
    [
      '^1',
      new Range([
        [
          new Comparator(GTE, new Version(1, 0, 0)),
          new Comparator(LT, new Version(2, 0, 0, { prerelease: ['0'] }))
        ]
      ])
    ],
    [
      '^0',
      new Range([
        [
          new Comparator(GTE, new Version(0, 0, 0)),
          new Comparator(LT, new Version(1, 0, 0, { prerelease: ['0'] }))
        ]
      ])
    ]
  ]

  for (const [input, expected] of cases) {
    t.alike(Range.parse(input), expected, input)
  }
})

test('parse tilde range', (t) => {
  const cases = [
    [
      '~1.2.3',
      new Range([
        [
          new Comparator(GTE, new Version(1, 2, 3)),
          new Comparator(LT, new Version(1, 3, 0, { prerelease: ['0'] }))
        ]
      ])
    ],
    [
      '~1.2',
      new Range([
        [
          new Comparator(GTE, new Version(1, 2, 0)),
          new Comparator(LT, new Version(1, 3, 0, { prerelease: ['0'] }))
        ]
      ])
    ],
    [
      '~1',
      new Range([
        [
          new Comparator(GTE, new Version(1, 0, 0)),
          new Comparator(LT, new Version(2, 0, 0, { prerelease: ['0'] }))
        ]
      ])
    ],
    [
      '~0.2.3',
      new Range([
        [
          new Comparator(GTE, new Version(0, 2, 3)),
          new Comparator(LT, new Version(0, 3, 0, { prerelease: ['0'] }))
        ]
      ])
    ],
    [
      '~0',
      new Range([
        [
          new Comparator(GTE, new Version(0, 0, 0)),
          new Comparator(LT, new Version(1, 0, 0, { prerelease: ['0'] }))
        ]
      ])
    ],
    [
      '~>1.2.3',
      new Range([
        [
          new Comparator(GTE, new Version(1, 2, 3)),
          new Comparator(LT, new Version(1, 3, 0, { prerelease: ['0'] }))
        ]
      ])
    ]
  ]

  for (const [input, expected] of cases) {
    t.alike(Range.parse(input), expected, input)
  }
})

test('parse x-range', (t) => {
  const cases = [
    ['*', new Range([[new Comparator(GTE, new Version(0, 0, 0))]])],
    ['x', new Range([[new Comparator(GTE, new Version(0, 0, 0))]])],
    ['X', new Range([[new Comparator(GTE, new Version(0, 0, 0))]])],
    [
      '1.x',
      new Range([
        [
          new Comparator(GTE, new Version(1, 0, 0)),
          new Comparator(LT, new Version(2, 0, 0, { prerelease: ['0'] }))
        ]
      ])
    ],
    [
      '1.2.x',
      new Range([
        [
          new Comparator(GTE, new Version(1, 2, 0)),
          new Comparator(LT, new Version(1, 3, 0, { prerelease: ['0'] }))
        ]
      ])
    ],
    [
      '1',
      new Range([
        [
          new Comparator(GTE, new Version(1, 0, 0)),
          new Comparator(LT, new Version(2, 0, 0, { prerelease: ['0'] }))
        ]
      ])
    ],
    [
      '1.2',
      new Range([
        [
          new Comparator(GTE, new Version(1, 2, 0)),
          new Comparator(LT, new Version(1, 3, 0, { prerelease: ['0'] }))
        ]
      ])
    ]
  ]

  for (const [input, expected] of cases) {
    t.alike(Range.parse(input), expected, input)
  }
})

test('parse hyphen range', (t) => {
  const cases = [
    [
      '1.2.3 - 2.3.4',
      new Range([
        [new Comparator(GTE, new Version(1, 2, 3)), new Comparator(LTE, new Version(2, 3, 4))]
      ])
    ],
    [
      '1.2 - 2.3.4',
      new Range([
        [new Comparator(GTE, new Version(1, 2, 0)), new Comparator(LTE, new Version(2, 3, 4))]
      ])
    ],
    [
      '1.2.3 - 2.3',
      new Range([
        [
          new Comparator(GTE, new Version(1, 2, 3)),
          new Comparator(LT, new Version(2, 4, 0, { prerelease: ['0'] }))
        ]
      ])
    ],
    [
      '1.2.3 - 2',
      new Range([
        [
          new Comparator(GTE, new Version(1, 2, 3)),
          new Comparator(LT, new Version(3, 0, 0, { prerelease: ['0'] }))
        ]
      ])
    ]
  ]

  for (const [input, expected] of cases) {
    t.alike(Range.parse(input), expected, input)
  }
})

test('test shorthand range', (t) => {
  const cases = [
    [
      '^1.2.3',
      [
        [new Version(1, 2, 2), false],
        [new Version(1, 2, 3), true],
        [new Version(1, 9, 9), true],
        [new Version(2, 0, 0), false],
        [new Version(2, 0, 0, { prerelease: ['rc', '1'] }), false]
      ]
    ],
    [
      '~1.2.3',
      [
        [new Version(1, 2, 3), true],
        [new Version(1, 2, 9), true],
        [new Version(1, 3, 0), false]
      ]
    ],
    [
      '1.2.x',
      [
        [new Version(1, 1, 9), false],
        [new Version(1, 2, 0), true],
        [new Version(1, 2, 5), true],
        [new Version(1, 3, 0), false]
      ]
    ],
    [
      '1.2.3 - 2.3.4',
      [
        [new Version(1, 2, 2), false],
        [new Version(1, 2, 3), true],
        [new Version(2, 3, 4), true],
        [new Version(2, 3, 5), false]
      ]
    ]
  ]

  for (const [input, versions] of cases) {
    const range = Range.parse(input)

    t.comment(`${range}`)

    for (const [version, expected] of versions) {
      t.is(range.test(version), expected, `${version}, ${expected}`)
    }
  }
})

test('test range with prerelease', (t) => {
  const cases = [
    [
      '~1.2.3-beta.2',
      [
        // A prerelease of the opted-into version is allowed if it is greater
        // than or equal to the comparator's prerelease.
        [new Version(1, 2, 3, { prerelease: ['beta', '2'] }), true],
        [new Version(1, 2, 3, { prerelease: ['beta', '4'] }), true],
        [new Version(1, 2, 3, { prerelease: ['beta', '1'] }), false],
        // A prerelease of a different version is never allowed, even when it
        // falls within the range numerically.
        [new Version(1, 2, 4, { prerelease: ['beta', '2'] }), false],
        // Stable versions within the range are allowed as usual.
        [new Version(1, 2, 3), true],
        [new Version(1, 2, 9), true]
      ]
    ],
    [
      '^1.2.3',
      [
        // The range opts into no prereleases, so none are allowed.
        [new Version(1, 5, 0, { prerelease: ['beta'] }), false],
        [new Version(2, 0, 0, { prerelease: ['rc', '1'] }), false],
        [new Version(1, 5, 0), true]
      ]
    ]
  ]

  for (const [input, versions] of cases) {
    const range = Range.parse(input)

    t.comment(`${range}`)

    for (const [version, expected] of versions) {
      t.is(range.test(version), expected, `${version}, ${expected}`)
    }
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
        [new Comparator(GT, new Version(1, 2, 0)), new Comparator(LT, new Version(1, 2, 3))]
      ])
    ],
    [
      '> 1.2.0 < 1.2.3',
      new Range([
        [new Comparator(GT, new Version(1, 2, 0)), new Comparator(LT, new Version(1, 2, 3))]
      ])
    ]
  ]

  for (const [input, expected] of cases) {
    t.alike(Range.parse(input), expected, input)
  }
})

test('parse partial range comparator set', (t) => {
  const cases = [
    [
      '>1 <1.2',
      new Range([
        [new Comparator(GT, new Version(1, 0, 0)), new Comparator(LT, new Version(1, 2, 0))]
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
    [new Version(1, 2, 3, { prerelease: ['a'] }), new Version(1, 2, 3, { prerelease: ['a'] }), 0],

    [new Version(1, 2, 3), new Version(1, 2, 3, { prerelease: ['a'] }), 1],
    [new Version(1, 2, 3, { prerelease: ['a'] }), new Version(1, 2, 3), -1],

    [new Version(1, 2, 3, { prerelease: ['a'] }), new Version(1, 2, 3, { prerelease: ['1'] }), 1],
    [new Version(1, 2, 3, { prerelease: ['1'] }), new Version(1, 2, 3, { prerelease: ['a'] }), -1],

    [new Version(1, 2, 3, { prerelease: ['a.b'] }), new Version(1, 2, 3, { prerelease: ['a'] }), 1],
    [new Version(1, 2, 3, { prerelease: ['a'] }), new Version(1, 2, 3, { prerelease: ['a.b'] }), -1]
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
