# bare-semver

Minimal semantic versioning library for Bare.

```
npm i bare-semver
```

## Usage

```js
const semver = require('bare-semver')

const version = semver.Version.parse('1.2.3-alpha.1+build.42')

console.log(version.major) // 1
console.log(version.minor) // 2
console.log(version.patch) // 3

const satisfied = semver.satisfies('1.2.3', '>=1.0.0 <2.0.0')

console.log(satisfied) // true
```

## API

See the [`bare-semver` reference](https://docs.pears.com/reference/bare/modules/bare-semver).

## License

Apache-2.0
