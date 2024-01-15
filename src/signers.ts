import { Signer } from "ethers"
import type { HardhatRuntimeEnvironment } from "hardhat/types"

type NamedSigners = {
  [name: string]: Signer
}

export interface HardhatSignersHelpers {
  getNamedSigners(): Promise<NamedSigners>
  getUnnamedSigners(): Promise<Signer[]>
}

async function getNamedSigners(
  hre: HardhatRuntimeEnvironment
): Promise<NamedSigners> {
  const namedSigners: { [name: string]: Signer } = {}

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
): Promise<Signer[]> {
  const unnamedSigners: Signer[] = []

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
