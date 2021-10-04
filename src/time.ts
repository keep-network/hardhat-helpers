import type { Provider, JsonRpcProvider } from "@ethersproject/providers"
import type { BigNumberish, BigNumber } from "ethers"
import type { HardhatRuntimeEnvironment } from "hardhat/types"
import type { HardhatTimeHelpers } from "./types"

import "@nomiclabs/hardhat-ethers"

import { ethers } from "ethers"

/**
 * Returns timestamp of the latest block.
 * @param {Provider} provider Ethers provider
 * @return {number} Latest block timestamp.
 */
export async function lastBlockTime(provider: Provider): Promise<number> {
  return (await provider.getBlock("latest")).timestamp
}

/**
 * Increases block timestamp by the specified time period.
 * @param {Provider} provider Ethers provider
 * @param {BigNumberish} time Time period that should pass to the next mined block.
 * @return {number} Timestamp of the next block.
 */
export async function increaseTime(
  provider: JsonRpcProvider,
  time: BigNumberish
): Promise<BigNumber> {
  // const ethers: ethers = require("ethers")

  const lastBlock: number = await lastBlockTime(provider)
  const expectedTime: BigNumber = ethers.BigNumber.from(lastBlock).add(time)

  await provider.send("evm_setNextBlockTimestamp", [expectedTime.toHexString()])
  await provider.send("evm_mine", [])

  return expectedTime
}

/**
 * Mines specific number of blocks.
 * @param {JsonRpcProvider} provider Ethers provider
 * @param {BigNumberish} blocks
 */
export async function mineBlocks(
  provider: JsonRpcProvider,
  blocks: number
): Promise<void> {
  for (let i = 0; i < blocks; i++) {
    await provider.send("evm_mine", [])
  }
}

export default function (hre: HardhatRuntimeEnvironment): HardhatTimeHelpers {
  const provider = hre.ethers.provider

  return {
    lastBlockTime: () => lastBlockTime(provider),
    increaseTime: (time: BigNumberish) => increaseTime(provider, time),
    mineBlocks: (blocks: number) => mineBlocks(provider, blocks),
  }
}
