import { expect } from "chai"
import { useEnvironment } from "./helpers"

import { HardhatPluginError } from "hardhat/plugins"
import type { HardhatForkingHelpers } from "../src/forking"
import { RequestArguments } from "hardhat/types"

describe("forking helpers", function () {
  describe("resetFork function", function () {
    const BLOCK_NUMBER: number = 13639200
    let forkingHelpers: HardhatForkingHelpers

    context("with default hardhat project", function () {
      useEnvironment("hardhat-project")

      beforeEach(function () {
        forkingHelpers = this.hre.helpers.forking
      })

      it("should throw an error", async function () {
        await expect(forkingHelpers.resetFork(BLOCK_NUMBER)).to.be.rejectedWith(
          HardhatPluginError,
          "network is not in the forking mode"
        )
      })
    })

    context("with forking hardhat project", function () {
      context("for hardhat network", function () {
        context("when forking env properties are not set", function () {
          useEnvironment("hardhat-forking-hardhat-network", () => {
            process.env.FORKING_URL = ""
          })

          beforeEach(function () {
            forkingHelpers = this.hre.helpers.forking
          })

          it("should throw an error", async function () {
            await expect(
              forkingHelpers.resetFork(BLOCK_NUMBER)
            ).to.be.rejectedWith(
              HardhatPluginError,
              "network is not in the forking mode"
            )
          })
        })

        context("when forking env properties are set", function () {
          const FORKING_URL: string = "https://mainnet.infura.io/v3/API_KEY"
          const calls: RequestArguments[] = []

          useEnvironment("hardhat-forking-hardhat-network", () => {
            process.env.FORKING_URL = FORKING_URL
          })

          beforeEach(function () {
            forkingHelpers = this.hre.helpers.forking

            this.hre.network.provider.request = async (
              args: RequestArguments
            ): Promise<unknown> => {
              return calls.push(args)
            }
          })

          it("should reset block number", async function () {
            await forkingHelpers.resetFork(BLOCK_NUMBER)

            expect(calls[calls.length - 1]).to.be.deep.equal({
              method: "hardhat_reset",
              params: [
                {
                  forking: {
                    jsonRpcUrl: FORKING_URL,
                    blockNumber: BLOCK_NUMBER,
                  },
                },
              ],
            })
          })
        })
      })

      context("for non-hardhat network", function () {
        useEnvironment("hardhat-forking-user-network")

        beforeEach(function () {
          forkingHelpers = this.hre.helpers.forking
        })

        it("should throw an error", async function () {
          await expect(forkingHelpers.resetFork(123)).to.be.rejectedWith(
            HardhatPluginError,
            "network is not in the forking mode"
          )
        })
      })
    })
  })
})
