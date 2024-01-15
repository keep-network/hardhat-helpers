import { useEnvironment } from "./helpers"
import { expect } from "chai"
import type { HardhatSnapshotHelpers } from "./snapshot"
import type { JsonRpcProvider } from "@ethersproject/providers"

describe("snapshot helpers", function () {
  useEnvironment("hardhat-project")

  let snapshotHelpers: HardhatSnapshotHelpers
  let provider: JsonRpcProvider

  beforeEach(function () {
    snapshotHelpers = this.hre.helpers.snapshot
    provider = this.hre.ethers.provider as unknown as JsonRpcProvider
  })

  it("should create and restore snapshots properly", async () => {
    const latestBlock = async () => (await provider.getBlock("latest")).number

    const mineBlocks = async (blocks: number) => {
      for (let i = 0; i < blocks; i++) {
        await provider.send("evm_mine", [])
      }
    }

    const startingBlock = await latestBlock()

    await mineBlocks(10)

    expect(await latestBlock()).to.be.equal(startingBlock + 10)

    await snapshotHelpers.createSnapshot()

    await mineBlocks(15)

    expect(await latestBlock()).to.be.equal(startingBlock + 25)

    await snapshotHelpers.createSnapshot()

    await mineBlocks(20)

    expect(await latestBlock()).to.be.equal(startingBlock + 45)

    await snapshotHelpers.restoreSnapshot()

    expect(await latestBlock()).to.be.equal(startingBlock + 25)

    await snapshotHelpers.restoreSnapshot()

    expect(await latestBlock()).to.be.equal(startingBlock + 10)
  })
})
