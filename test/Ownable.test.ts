import { HardhatPluginError } from "hardhat/plugins"

import { useEnvironment } from "./helpers"

import { Ownable } from "../src/Ownable"
import { FunctionType } from "./fixture-projects/hardhat-deploy-project/hardhat-deploy-mock/DeploymentsMock"

import chai from "chai"
chai.use(require("chai-as-promised"))
const { expect } = chai

import {
  ADDRESS_1 as oldOwnerAddress,
  ADDRESS_2 as newOwnerAddress,
  ADDRESS_3 as fromAddress,
  ADDRESS_ZERO,
} from "./data/address"

describe("Ownable", function () {
  useEnvironment("hardhat-deploy-project")

  const contractName: string = "TestContract"

  let ownable: Ownable
  beforeEach(function () {
    ownable = new Ownable(this.hre)
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
        options: { from: fromAddress },
        methodName: "owner",
        args: [],
      })

      expect(this.hre.deployments.calls[1]).to.deep.equal({
        functionType: FunctionType.Execute,
        contract: "TestContract",
        options: { from: fromAddress },
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
        options: { from: fromAddress },
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
