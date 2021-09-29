import "@nomiclabs/hardhat-ethers"
import { ethers } from "hardhat"

export class TestUtils {
  /**
   * Returns timestamp of the latest block
   *
   * @return {Promise<number>} Timestamp of the latest block
   */
  public async lastBlockTime(): Promise<number> {
    return (await ethers.provider.getBlock("latest")).timestamp
  }

  /**
   * Increases time in unit tests by the given number of seconds
   *
   * @param {number} time Number of seconds to be added to current time
   */
  public async increaseTime(time: number): Promise<void> {
    const now = await this.lastBlockTime()
    await ethers.provider.send("evm_setNextBlockTimestamp", [now + time])
    await ethers.provider.send("evm_mine", [])
  }
}
