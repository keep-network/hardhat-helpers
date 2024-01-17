/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from "chai"
import { useEnvironment } from "./helpers"

import type { HardhatSignersHelpers } from "./signers"
import type { HardhatEthersHelpers } from "@nomicfoundation/hardhat-ethers/types"
import type { ethers as ethersT } from "ethers"

describe("signers", () => {
  useEnvironment("hardhat-deploy")

  let signers: HardhatSignersHelpers
  let ethers: typeof ethersT & HardhatEthersHelpers

  beforeEach(function () {
    signers = this.hre.helpers.signers
    ethers = this.hre.ethers
  })

  describe("getNamedSigners", () => {
    it("should return named signers", async () => {
      const { deployer, governance } = await signers.getNamedSigners()
      const deployerAddress = await deployer.getAddress()
      const governanceAddress = await governance.getAddress()

      expect(ethers.isAddress(deployerAddress)).to.be.true

      expect(deployerAddress).to.be.not.equal(ethers.ZeroAddress)

      expect(ethers.isAddress(governanceAddress)).to.be.true

      expect(governanceAddress).to.be.not.equal(ethers.ZeroAddress)

      expect(governanceAddress).to.be.not.equal(deployerAddress)
    })
  })

  describe("getUnnamedSigners", () => {
    it("should return unnamed signers", async () => {
      const namedSigners = await signers.getNamedSigners()
      const unnamedSigners = await signers.getUnnamedSigners()

      expect(unnamedSigners).to.have.length(22)

      // eslint-disable-next-line no-restricted-syntax
      for (const namedSigner of Object.values(namedSigners)) {
        expect(unnamedSigners).to.not.contain(await namedSigner.getAddress())
      }
    })
  })
})
