import type { Address } from "./Address"
import type { Ownable } from "./Ownable"
import type { BigNumberish, BigNumber } from "ethers"

export interface HardhatHelpers {
  address: Address
  ownable: Ownable
  time: HardhatTimeHelpers
}

export interface HardhatTimeHelpers {
  /**
   * Returns timestamp of the latest block.
   * @return {number} Latest block timestamp.
   */
  lastBlockTime(): Promise<number>
  /**
   * Increases block timestamp by the specified time period.
   * @param {BigNumberish} time Time period that should pass to the next mined block.
   * @return {number} Timestamp of the next block.
   */
  increaseTime(time: BigNumberish): Promise<BigNumber>
  /**
   * Mines specific number of blocks.
   * @param {BigNumberish} blocks
   */
  mineBlocks(blocks: number): Promise<void>
}
