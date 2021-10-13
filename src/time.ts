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
  const lastBlock: number = await lastBlockTime(provider)
  const expectedTime: BigNumber = ethers.BigNumber.from(lastBlock).add(time)

  await provider.send("evm_setNextBlockTimestamp", [expectedTime.toHexString()])
  await provider.send("evm_mine", [])

  return expectedTime
}

/**
 * Mines specific number of blocks.
 * @param {JsonRpcProvider} provider Ethers provider
 * @param {number} blocks
 * @return {number} Latest block number.
 */
export async function mineBlocks(
  provider: JsonRpcProvider,
  blocks: number
): Promise<number> {
  for (let i = 0; i < blocks; i++) {
    await provider.send("evm_mine", [])
  }

  return (await provider.getBlock("latest")).number
}

/**
 * Mines blocks to get to the specific target block number.
 * @param {JsonRpcProvider} provider Ethers provider
 * @param {number} targetBlock
 * @return {number} Latest block number.
 * @throws Will throw an error if target block already passed.
 */
export async function mineBlocksTo(
  provider: JsonRpcProvider,
  targetBlock: number
): Promise<number> {
  const lastBlockNumber: number = (await provider.getBlock("latest")).number

  if (targetBlock < lastBlockNumber)
    throw new Error(
      `target block number already passed; latest block number is [${lastBlockNumber}]`
    )

  const blocksToMine = targetBlock - lastBlockNumber

  for (let i = 0; i < blocksToMine; i++) {
    await provider.send("evm_mine", [])
  }

  return (await provider.getBlock("latest")).number
}

export default function (hre: HardhatRuntimeEnvironment): HardhatTimeHelpers {
  const provider = hre.ethers.provider

  return {
    lastBlockTime: () => lastBlockTime(provider),
    increaseTime: (time: BigNumberish) => increaseTime(provider, time),
    mineBlocks: (blocks: number) => mineBlocks(provider, blocks),
    mineBlocksTo: (targetBlock: number) => mineBlocksTo(provider, targetBlock),
  }
}
