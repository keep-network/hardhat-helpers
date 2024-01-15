import { formatFixed } from "@ethersproject/bignumber"

export interface HardhatNumberHelpers {
  to1e18(n: any): bigint
  to1ePrecision(n: any, precision: number): bigint
  from1e18(n: any): string
  from1ePrecision(n: any, precision: number): string
}

export function to1e18(n: any): bigint {
  return to1ePrecision(n, 18)
}

export function to1ePrecision(n: bigint, precision: number): bigint {
  const decimalMultiplier = 10n ** BigInt(precision)
  return n * decimalMultiplier
}

export function from1e18(n: any): string {
  return from1ePrecision(n, 18)
}

export function from1ePrecision(n: any, precision: number): string {
  const value = BigInt(n)
  const decimalMultiplier = 10n ** BigInt(precision)

  return value >= decimalMultiplier && value % decimalMultiplier === 0n
    ? (value / decimalMultiplier).toString()
    : formatFixed(n, precision)
}
