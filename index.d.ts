/** An object containing the comparison operator constants. */
export const constants: { EQ: 1; LT: 2; LTE: 3; GT: 4; GTE: 5 }

declare class SemVerError extends Error {
  /**
   * @param msg - The error message.
   * @param fn - Optional function to omit from the top of the generated stack trace, passed to
   * `Error.captureStackTrace`.
   * @returns A `SemVerError` with `code` set to `'INVALID_VERSION'`, for the caller to throw.
   */
  static INVALID_VERSION(msg: string, fn?: Function): SemVerError

  /**
   * @param msg - The error message.
   * @param fn - Optional function to omit from the top of the generated stack trace, passed to
   * `Error.captureStackTrace`.
   * @returns A `SemVerError` with `code` set to `'INVALID_RANGE'`, for the caller to throw.
   */
  static INVALID_RANGE(msg: string, fn?: Function): SemVerError
}

export { SemVerError as errors }

/**
 * Test whether `version` satisfies `range`. Both `version` and `range` may be strings, in which
 * case they will be parsed.
 * @param version - The version to test, or a version string to parse.
 * @param range - The range to test against, or a range string to parse.
 * @returns `true` if `version` matches `range`, `false` otherwise.
 * @throws {INVALID_VERSION} `version` or `range` is a string that fails to parse.
 */
export function satisfies(version: Version, range: Range): boolean

export class Version {
  /**
   * @param major - The major version number.
   * @param minor - The minor version number.
   * @param patch - The patch version number.
   * @param opts - Optional `prerelease` and `build` tag arrays; each defaults to an empty array.
   */
  constructor(
    major: number,
    minor: number,
    patch: number,
    opts?: { prerelease?: string[]; build?: string[] }
  )

  /** The major version number. */
  major: number
  /** The minor version number. */
  minor: number
  /** The patch version number. */
  patch: number
  /** An array of prerelease tags. */
  prerelease: string[]
  /** An array of build metadata tags. */
  build: string[]

  /**
   * Compare `version` with `other`, returning `1` if `version` is greater, `-1` if less, or `0` if
   * equal. Comparison follows the Semantic Versioning 2.0.0 specification, including prerelease
   * precedence rules.
   * @param version - The version to compare against.
   */
  compare(version: Version): boolean

  /** Return the string representation of `version`. */
  toString(): string
}

/** Create a new version with the given `major`, `minor`, and `patch` components. */
export namespace Version {
  /**
   * Parse a semantic version string into a `Version` instance.
   * @param input - The version string to parse.
   * @throws {INVALID_VERSION} `input` is not a valid version string.
   */
  export function parse(input: string): Version

  export function compare(a: Version, b: Version): number
}

export class Comparator {
  /**
   * @param operator - One of the `constants` operator values (`EQ`, `LT`, `LTE`, `GT`, `GTE`).
   * @param version - The version the comparator matches against.
   */
  constructor(operator: number, version: Version)

  /** The comparison operator constant. */
  operator: number
  /** The `Version` instance to compare against. */
  version: Version

  /**
   * @param version - The version to test against the comparator.
   * @returns `true` if `version` satisfies the comparator's operator and version, `false`
   * otherwise.
   */
  test(version: Version): boolean

  /**
   * Return the string representation of the comparator (operator and version), for example
   * `>=1.2.3`.
   */
  toString(): string
}

export class Range {
  /**
   * @param comparators - Two-dimensional array of comparator sets: the outer array is a union (OR)
   * of inner arrays, each an intersection (AND); defaults to an empty range that matches nothing.
   */
  constructor(comparators?: Comparator[][])

  /** The two-dimensional array of `Comparator` instances. */
  comparators: Comparator[][]

  /**
   * Test whether `version` satisfies the range.
   * @param version - The version to test against the range.
   * @returns `true` if `version` satisfies any comparator set in the range, `false` otherwise.
   */
  test(version: Version): boolean

  /** Return the string representation of the range, for example `>=1.2.3 <2.0.0`. */
  toString(): string
}

/**
 * Create a new range from a two-dimensional array of `Comparator` instances. Each inner array
 * represents a set of comparators joined by intersection, and the outer array represents the union
 * of those sets.
 */
export namespace Range {
  /**
   * Parse a range string into a `Range` instance. Supports comparison operators (`<`, `<=`, `>`,
   * `>=`, `=`), partial versions, and logical OR (`||`).
   * @param input - The range string to parse.
   * @throws {INVALID_VERSION} `input` is not valid range syntax (reported via the `INVALID_VERSION`
   * code — `INVALID_RANGE` is not currently thrown by the parser).
   */
  export function parse(input: string): Range
}
