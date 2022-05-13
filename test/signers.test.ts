/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from "chai"
import { useEnvironment } from "./helpers"

import type { HardhatSignersHelpers } from "./signers"
import type { HardhatEthersHelpers } from "@nomiclabs/hardhat-ethers/types"
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

      expect(ethers.utils.isAddress(deployer.address)).to.be.true

      expect(deployer.address).to.be.not.equal(ethers.constants.AddressZero)

      expect(ethers.utils.isAddress(governance.address)).to.be.true

      expect(governance.address).to.be.not.equal(ethers.constants.AddressZero)

      expect(governance.address).to.be.not.equal(deployer.address)
    })
  })

  describe("getUnnamedSigners", () => {
    it("should return unnamed signers", async () => {
      const namedSigners = await signers.getNamedSigners()
      const unnamedSigners = await signers.getUnnamedSigners()

      expect(unnamedSigners).to.have.length(22)

      // eslint-disable-next-line no-restricted-syntax
      for (const namedSigner of Object.values(namedSigners)) {
        expect(unnamedSigners).to.not.contain(namedSigner.address)
      }
    })
  })
})
