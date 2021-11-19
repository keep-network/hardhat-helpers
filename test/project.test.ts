import { expect } from "chai"

import { ADDRESS_2, ADDRESS_3 } from "./data/address"

import { useEnvironment } from "./helpers"

const VALID_ADDRESS: string = "0xb894c3967CFb58A5c55f1de4131d126B1eFA1EE0"

describe("Hardhat Runtime Environment extension", function () {
  context("default hardhat project", function () {
    useEnvironment("hardhat-project")

    it("should add the helpers field", function () {
      expect(this.hre.helpers).not.to.be.null
    })

    describe("address helpers", function () {
      it("validate function should return an address", function () {
        expect(this.hre.helpers.address.validate(VALID_ADDRESS)).to.equal(
          VALID_ADDRESS
        )
      })

      it("isValid function should return true", function () {
        expect(this.hre.helpers.address.isValid(VALID_ADDRESS)).to.be.true
      })

      it("equal function should return true", function () {
        expect(
          this.hre.helpers.address.equal(VALID_ADDRESS, VALID_ADDRESS)
        ).to.be.true
      })
    })
  })

  context("project using hardhat-deploy", function () {
    useEnvironment("hardhat-deploy-project")

    describe("ownable helpers", function () {
      it("transferOwnership function is available", async function () {
        await this.hre.helpers.ownable.transferOwnership(
          "TestContract",
          ADDRESS_2,
          ADDRESS_3
        )
      })
    })
  })
})
