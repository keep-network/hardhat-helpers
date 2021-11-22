import { expect } from "chai"
import { useEnvironment } from "./helpers"

import type { BigNumber } from "ethers"
import type { HardhatTimeHelpers } from "./time"

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
      const blocksToMine = 23
      let expectedBlockNumber: number
      let result: number

      beforeEach(async function () {
        const currentBlockNumber = (
          await this.hre.ethers.provider.getBlock("latest")
        ).number
        expectedBlockNumber = currentBlockNumber + blocksToMine

        result = await timeHelpers.mineBlocks(blocksToMine)
      })

      it("should mine blocks", async function () {
        expect(
          (await this.hre.ethers.provider.getBlock("latest")).number
        ).to.be.eq(expectedBlockNumber)
      })

      it("should return increased block number", async function () {
        expect(result).to.eq(expectedBlockNumber)
      })
    })

    describe("mineBlocksTo function", function () {
      let currentBlockNumber: number

      beforeEach(async function () {
        currentBlockNumber = (await this.hre.ethers.provider.getBlock("latest"))
          .number
      })

      it("should complete if target blcok number is greater than the latest block number", async function () {
        const targetBlock = currentBlockNumber + 20

        const result = await timeHelpers.mineBlocksTo(targetBlock)

        expect(
          result,
          "returned block number is not target block number"
        ).to.eq(targetBlock)

        expect(
          (await this.hre.ethers.provider.getBlock("latest")).number,
          "latest block number is not target block number"
        ).to.be.eq(targetBlock)
      })

      it("should complete if target block number is equal the latest block number", async function () {
        const targetBlock = currentBlockNumber

        const result = await timeHelpers.mineBlocksTo(targetBlock)

        expect(
          result,
          "returned block number is not target block number"
        ).to.eq(targetBlock)

        expect(
          (await this.hre.ethers.provider.getBlock("latest")).number,
          "latest block number is not target block number"
        ).to.be.eq(targetBlock)
      })

      it("should fail if target block number already passed", async function () {
        const targetBlock = currentBlockNumber - 1

        expect(timeHelpers.mineBlocksTo(targetBlock)).to.be.rejectedWith(
          `target block number [${targetBlock}] already passed; latest block number is [${currentBlockNumber}]`
        )
      })
    })
  })
})
