import ethers from "ethers"
import { formatFixed } from "@ethersproject/bignumber"
import type { BigNumber } from "ethers"

export interface HardhatNumberHelpers {
  to1e18(n: any): BigNumber
  to1ePrecision(n: any, precision: number): BigNumber
  from1e18(n: any): string
  from1ePrecision(n: any, precision: number): string
}

export function to1e18(n: any): BigNumber {
  return to1ePrecision(n, 18)
}

export function to1ePrecision(n: any, precision: number): BigNumber {
  const decimalMultiplier = ethers.BigNumber.from(10).pow(precision)
  return ethers.BigNumber.from(n).mul(decimalMultiplier)
}

export function from1e18(n: any): string {
  return from1ePrecision(n, 18)
}

export function from1ePrecision(n: any, precision: number): string {
  const value: BigNumber = ethers.BigNumber.from(n)
  const decimalMultiplier: BigNumber = ethers.BigNumber.from(10).pow(precision)

  return value.gte(decimalMultiplier) && value.mod(decimalMultiplier).isZero()
    ? value.div(decimalMultiplier).toString()
    : formatFixed(n, precision)
}
