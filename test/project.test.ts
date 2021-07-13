import { expect } from "chai"

import { Address } from "../src/Address"

import { useEnvironment } from "./helpers"

const VALID_ADDRESS: string = "0xb894c3967CFb58A5c55f1de4131d126B1eFA1EE0"

describe("Hardhat Runtime Environment extension", function () {
  useEnvironment("hardhat-project")

  it("should add the helpers field", function () {
    expect(this.hre.helpers).not.to.be.null

    expect(this.hre.helpers).to.contain.all.keys(["address"])

    expect(this.hre.helpers.address).to.be.instanceOf(Address)
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
      expect(this.hre.helpers.address.equal(VALID_ADDRESS, VALID_ADDRESS)).to.be
        .true
    })
  })
})
