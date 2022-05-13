import type { HardhatRuntimeEnvironment } from "hardhat/types"
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

type NamedSigners = {
  [name: string]: SignerWithAddress
}

export interface HardhatSignersHelpers {
  getNamedSigners(): Promise<NamedSigners>
  getUnnamedSigners(): Promise<SignerWithAddress[]>
}

async function getNamedSigners(
  hre: HardhatRuntimeEnvironment
): Promise<NamedSigners> {
  const namedSigners: { [name: string]: SignerWithAddress } = {}

  await Promise.all(
    Object.entries(await hre.getNamedAccounts()).map(
      async ([name, address]) => {
        namedSigners[name] = await hre.ethers.getSigner(address)
      }
    )
  )

  return namedSigners
}

async function getUnnamedSigners(
  hre: HardhatRuntimeEnvironment
): Promise<SignerWithAddress[]> {
  const unnamedSigners: SignerWithAddress[] = []

  await Promise.all(
    (
      await hre.getUnnamedAccounts()
    ).map(async (address) => {
      unnamedSigners.push(await hre.ethers.getSigner(address))
    })
  )

  return unnamedSigners
}

export default function (
  hre: HardhatRuntimeEnvironment
): HardhatSignersHelpers {
  return {
    getNamedSigners: () => getNamedSigners(hre),
    getUnnamedSigners: () => getUnnamedSigners(hre),
  }
}
