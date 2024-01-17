import { formatFixed } from "@ethersproject/bignumber"
import { BigNumberish } from "ethers"

export interface HardhatNumberHelpers {
  to1e18(n: BigNumberish): bigint
  to1ePrecision(n: BigNumberish, precision: number): bigint
  from1e18(n: BigNumberish): string
  from1ePrecision(n: BigNumberish, precision: number): string
}

export function to1e18(n: BigNumberish): bigint {
  return to1ePrecision(n, 18)
}

export function to1ePrecision(n: BigNumberish, precision: number): bigint {
  const decimalMultiplier = 10n ** BigInt(precision)
  return BigInt(n) * decimalMultiplier
}

export function from1e18(n: BigNumberish): string {
  return from1ePrecision(n, 18)
}

export function from1ePrecision(n: BigNumberish, precision: number): string {
  const value = BigInt(n)
  const decimalMultiplier = 10n ** BigInt(precision)

  return value >= decimalMultiplier && value % decimalMultiplier === 0n
    ? (value / decimalMultiplier).toString()
    : formatFixed(n, precision)
}
