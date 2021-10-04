import { expect } from "chai"
import { useEnvironment } from "./helpers"

import type { BigNumber } from "ethers"
import type { HardhatTimeHelpers } from "./types"

describe("time helpers", function () {
  context("default hardhat project", function () {
    useEnvironment("hardhat-project")

    let timeHelpers: HardhatTimeHelpers
    beforeEach(function () {
      timeHelpers = this.hre.helpers.time
    })

    describe("lastBlockTime function", function () {
      it("should return a number grater than zero", async function () {
        expect(await timeHelpers.lastBlockTime()).to.be.gt(0)
      })
    })

    describe("increaseTime function", function () {
      const time: number = 145607
      let expectedTime: BigNumber
      let result: BigNumber

      beforeEach(async function () {
        expectedTime = this.hre.ethers.BigNumber.from(
          await timeHelpers.lastBlockTime()
        ).add(time)

        result = await timeHelpers.increaseTime(time)
      })

      it("should increase latest block timestamp", async function () {
        expect(await timeHelpers.lastBlockTime()).to.be.equal(
          expectedTime.toNumber()
        )
      })

      it("should return increased block timestamp", async function () {
        expect(result.toString()).to.eq(expectedTime.toString())
      })
    })

    describe("mineBlocks function", function () {
      it("should mine blocks", async function () {
        const blocksToMine = 23

        const currentBlockNumber = (
          await this.hre.ethers.provider.getBlock("latest")
        ).number
        const expectedBlockNumber = currentBlockNumber + blocksToMine

        await timeHelpers.mineBlocks(blocksToMine)

        expect(
          (await this.hre.ethers.provider.getBlock("latest")).number
        ).to.be.eq(expectedBlockNumber)
      })
    })
  })
})