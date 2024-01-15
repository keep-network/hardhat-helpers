import type { Provider, JsonRpcProvider } from "@ethersproject/providers"
import type { HardhatRuntimeEnvironment } from "hardhat/types"

export interface HardhatTimeHelpers {
  /**
   * Returns number of the latest block.
   * @return {number} Latest block number.
   */
  lastBlockNumber(): Promise<number>
  /**
   * Returns timestamp of the latest block.
   * @return {number} Latest block timestamp.
   */
  lastBlockTime(): Promise<number>
  /**
   * Increases block timestamp by the specified time period.
   * @param {bigint} time Time period that should pass to the next mined block.
   * @return {number} Timestamp of the next block.
   */
  increaseTime(time: number): Promise<number>
  /**
   * Mines specific number of blocks.
   * @param {number} blocks
   */
  mineBlocks(blocks: number): Promise<number>
  /**
   * Mines blocks to get to a specific block number.
   * @param {number} blocks
   */
  mineBlocksTo(blocks: number): Promise<number>
}

/**
 * Returns number of the latest block.
 * @param {Provider} provider Ethers provider
 * @return {number} Latest block number.
 */
async function lastBlockNumber(provider: Provider): Promise<number> {
  return (await provider.getBlock("latest")).number
}

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
 * @param {number} time Time period that should pass to the next mined block.
 * @return {number} Timestamp of the next block.
 */
export async function increaseTime(
  provider: JsonRpcProvider,
  time: number
): Promise<number> {
  const lastBlock: number = await lastBlockTime(provider)
  const expectedTime = lastBlock + time

  await provider.send("evm_setNextBlockTimestamp", [expectedTime])
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
  const provider = hre.ethers.provider as unknown as JsonRpcProvider

  return {
    lastBlockNumber: () => lastBlockNumber(provider),
    lastBlockTime: () => lastBlockTime(provider),
    increaseTime: (time: number) => increaseTime(provider, time),
    mineBlocks: (blocks: number) => mineBlocks(provider, blocks),
    mineBlocksTo: (targetBlock: number) => mineBlocksTo(provider, targetBlock),
  }
}
