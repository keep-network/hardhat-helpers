import { expect } from "chai"
import { HardhatPluginError } from "hardhat/plugins"
import { useEnvironment } from "./helpers"

import * as address from "../src/address"

import {
  ADDRESS_1,
  ADDRESS_1_LOWERCASE,
  ADDRESS_1_NO_PREFIX,
  ADDRESS_2,
  ADDRESS_INVALID,
  ADDRESS_ZERO,
} from "./data/address"

describe("Address", function () {
  useEnvironment("hardhat-project")

  describe("validate function", function () {
    it("should return address for valid address", function () {
      expect(address.validate(ADDRESS_1)).to.equal(ADDRESS_1)
    })

    it("should return formatted address for lowercase address", function () {
      expect(address.validate(ADDRESS_1_LOWERCASE)).to.equal(ADDRESS_1)
    })

    it("should return 0x prefixed address for address without 0x prefix", function () {
      expect(address.validate(ADDRESS_1_NO_PREFIX)).to.equal(ADDRESS_1)
    })

    it("should throw an error for address containing invalid character", function () {
      expect(function () {
        address.validate(ADDRESS_INVALID)
      }).to.throw(
        HardhatPluginError,
        "address 0xXYZ4c3967CFb58A5c55f1de4131d126B1eFA1EE0 is not a valid address"
      )
    })

    it("should throw an error for zero address", function () {
      expect(function () {
        address.validate(ADDRESS_ZERO)
      }).to.throw(HardhatPluginError, "address is a zero address")
    })
  })

  describe("isValid function", function () {
    it("should return true for valid address", function () {
      expect(address.isValid(ADDRESS_1)).to.be.true
    })

    it("should return true for lowercase address", function () {
      expect(address.isValid(ADDRESS_1_LOWERCASE)).to.be.true
    })

    it("should return true for address without 0x prefix", function () {
      expect(address.isValid(ADDRESS_1_NO_PREFIX)).to.be.true
    })

    it("should return false for address containing invalid character", function () {
      expect(address.isValid(ADDRESS_INVALID)).to.be.false
    })

    it("should return false for zero address", function () {
      expect(address.isValid(ADDRESS_ZERO)).to.be.false
    })
  })

  describe("equal function", function () {
    it("should return true for exactly the same addresses", function () {
      expect(address.equal(ADDRESS_1, ADDRESS_1)).to.be.true
    })

    it("should return true when one of the addresses is lowercase", function () {
      expect(address.equal(ADDRESS_1_LOWERCASE, ADDRESS_1)).to.be.true
    })

    it("should return true when one of the addresses is not 0x prefixed", function () {
      expect(address.equal(ADDRESS_1_NO_PREFIX, ADDRESS_1)).to.be.true
    })

    it("should return false when addresses are different", function () {
      expect(address.equal(ADDRESS_1, ADDRESS_2)).to.be.false
    })

    it("should throw an error for invalid address 1", function () {
      expect(function () {
        address.equal(ADDRESS_INVALID, ADDRESS_1)
      }).to.throw(
        HardhatPluginError,
        "address 0xXYZ4c3967CFb58A5c55f1de4131d126B1eFA1EE0 is not a valid address"
      )
    })

    it("should throw an error for invalid address 2", function () {
      expect(function () {
        address.equal(ADDRESS_1, ADDRESS_INVALID)
      }).to.throw(
        HardhatPluginError,
        "address 0xXYZ4c3967CFb58A5c55f1de4131d126B1eFA1EE0 is not a valid address"
      )
    })

    it("should throw an error for zero address 1", function () {
      expect(function () {
        address.equal(ADDRESS_ZERO, ADDRESS_1)
      }).to.throw(HardhatPluginError, "address is a zero address")
    })

    it("should throw an error for zero address 2", function () {
      expect(function () {
        address.equal(ADDRESS_1, ADDRESS_ZERO)
      }).to.throw(HardhatPluginError, "address is a zero address")
    })
  })
})
