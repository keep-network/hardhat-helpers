import { HardhatRuntimeEnvironment } from "hardhat/types"
import {
  mine,
  mineUpTo,
  time as timeHelpers,
} from "@nomicfoundation/hardhat-network-helpers"
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

  waitForTransaction(txHash: string, confirmations?: number): Promise<boolean>
}

/**
 * Returns number of the latest block.
 * @return {number} Latest block number.
 */
async function lastBlockNumber(): Promise<number> {
  return await timeHelpers.latestBlock()
}

/**
 * Returns timestamp of the latest block.
 * @return {number} Latest block timestamp.
 */
export async function lastBlockTime(): Promise<number> {
  return await timeHelpers.latest()
}

/**
 * Increases block timestamp by the specified time period.
 * @param {number} time Time period that should pass to the next mined block.
 * @return {number} Timestamp of the next block.
 */
export async function increaseTime(time: number): Promise<number> {
  return await timeHelpers.increase(time)
}

/**
 * Mines specific number of blocks.
 * @param {number} blocks
 * @return {number} Latest block number.
 */
export async function mineBlocks(blocks: number): Promise<number> {
  await mine(blocks)

  return await timeHelpers.latestBlock()
}

/**
 * Mines blocks to get to the specific target block number.
 * @param {number} targetBlock
 * @return {number} Latest block number.
 * @throws Will throw an error if target block already passed.
 */
export async function mineBlocksTo(targetBlock: number): Promise<number> {
  const latest = await timeHelpers.latestBlock()

  if (targetBlock === latest) {
    return latest
  }

  await mineUpTo(targetBlock)

  return await timeHelpers.latestBlock()
}

export async function waitForTransaction(
  hre: HardhatRuntimeEnvironment,
  txHash: string,
  confirmations?: number = 1
): Promise<boolean> {
  if (hre.network.name === "hardhat") {
    return true
  }

  const { provider } = hre.ethers
  const transaction = await provider.getTransaction(txHash)
  if (!transaction) {
    throw new Error(`Transaction ${txHash} not found`)
  }

  let currentConfirmations = await transaction.confirmations()
  while (currentConfirmations < confirmations) {
    // wait 1s between each check to save API compute units
    // eslint-disable-next-line no-await-in-loop, no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // eslint-disable-next-line no-await-in-loop
    currentConfirmations = await transaction.confirmations()
  }

  return true
}

export default function (hre: HardhatRuntimeEnvironment): HardhatTimeHelpers {
  return {
    lastBlockNumber: () => lastBlockNumber(),
    lastBlockTime: () => lastBlockTime(),
    increaseTime: (time: number) => increaseTime(time),
    mineBlocks: (blocks: number) => mineBlocks(blocks),
    mineBlocksTo: (targetBlock: number) => mineBlocksTo(targetBlock),
    waitForTransaction: (txHash: string, confirmations?: number) =>
      waitForTransaction(hre, txHash, confirmations),
  }
}
