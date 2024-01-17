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

export default function (): HardhatTimeHelpers {
  return {
    lastBlockNumber: () => lastBlockNumber(),
    lastBlockTime: () => lastBlockTime(),
    increaseTime: (time: number) => increaseTime(time),
    mineBlocks: (blocks: number) => mineBlocks(blocks),
    mineBlocksTo: (targetBlock: number) => mineBlocksTo(targetBlock),
  }
}
