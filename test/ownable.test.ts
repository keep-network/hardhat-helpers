import { HardhatPluginError } from "hardhat/plugins"
import { useEnvironment } from "./helpers"
import { FunctionType } from "./fixture-projects/hardhat-deploy-mocked/hardhat-deploy-mock/DeploymentsMock"
import {
  ADDRESS_1 as oldOwnerAddress,
  ADDRESS_2 as newOwnerAddress,
  ADDRESS_3 as fromAddress,
  ADDRESS_ZERO,
} from "./data/address"
import type { HardhatOwnableHelpers } from "../src/ownable"

import "./fixture-projects/hardhat-deploy-mocked/hardhat-deploy-mock/type-extensions"

import chai from "chai"
chai.use(require("chai-as-promised"))
const { expect } = chai

describe("Ownable", function () {
  useEnvironment("hardhat-deploy-mocked")

  const contractName: string = "TestContract"

  let ownable: HardhatOwnableHelpers
  beforeEach(function () {
    ownable = this.hre.helpers.ownable
    this.hre.deployments.currentOwner = oldOwnerAddress
  })

  describe("transferOwnership", function () {
    it("does not transfer ownership when new owner is the same as current owner", async function () {
      await ownable.transferOwnership(
        contractName,
        oldOwnerAddress,
        fromAddress
      )

      expect(this.hre.deployments.calls).to.have.lengthOf(1)

      expect(this.hre.deployments.calls[0]).to.deep.equal({
        functionType: FunctionType.Read,
        contract: "TestContract",
        options: { from: fromAddress },
        methodName: "owner",
        args: [],
      })
    })

    it("transfers ownership when current owner is not set", async function () {
      this.hre.deployments.currentOwner = ""

      await ownable.transferOwnership(
        contractName,
        newOwnerAddress,
        fromAddress
      )

      expect(this.hre.deployments.calls).to.have.lengthOf(2)

      expect(this.hre.deployments.calls[0]).to.deep.equal({
        functionType: FunctionType.Read,
        contract: "TestContract",
        options: {
          from: fromAddress,
        },
        methodName: "owner",
        args: [],
      })

      expect(this.hre.deployments.calls[1]).to.deep.equal({
        functionType: FunctionType.Execute,
        contract: "TestContract",
        options: { from: fromAddress, log: true, waitConfirmations: 1 },
        methodName: "transferOwnership",
        args: [newOwnerAddress],
      })
    })

    it("transfers ownership when new owner is different than current owner", async function () {
      await ownable.transferOwnership(
        contractName,
        newOwnerAddress,
        fromAddress
      )

      expect(this.hre.deployments.calls).to.have.lengthOf(2)

      expect(this.hre.deployments.calls[0]).to.deep.equal({
        functionType: FunctionType.Read,
        contract: "TestContract",
        options: { from: fromAddress },
        methodName: "owner",
        args: [],
      })

      expect(this.hre.deployments.calls[1]).to.deep.equal({
        functionType: FunctionType.Execute,
        contract: "TestContract",
        options: { from: fromAddress, log: true, waitConfirmations: 1 },
        methodName: "transferOwnership",
        args: [newOwnerAddress],
      })
    })

    it("should throw an error if new owner address is zero address", async function () {
      await expect(
        ownable.transferOwnership(contractName, ADDRESS_ZERO, fromAddress)
      ).to.be.rejectedWith(HardhatPluginError, "address is a zero address")
    })
  })
})
