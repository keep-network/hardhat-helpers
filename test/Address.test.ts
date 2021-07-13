import { expect } from "chai"
import { HardhatPluginError } from "hardhat/plugins"

import { Address } from "../src/Address"

const ADDRESS_LOWERCASE: string = "0xb894c3967cfb58a5c55f1de4131d126b1efa1ee0"
const ADDRESS_FORMATTED: string = "0xb894c3967CFb58A5c55f1de4131d126B1eFA1EE0"
const ADDRESS_NO_PREFIX: string = "b894c3967CFb58A5c55f1de4131d126B1eFA1EE0"
const ADDRESS_INVALID: string = "0xXYZ4c3967CFb58A5c55f1de4131d126B1eFA1EE0"
const ADDRESS_ZERO: string = "0x0000000000000000000000000000000000000000"

describe("Address", function () {
  const address = new Address()

  describe("validate function", function () {
    it("should return address for valid address", function () {
      expect(address.validate(ADDRESS_FORMATTED)).to.equal(ADDRESS_FORMATTED)
    })

    it("should return formatted address for lowercase address", function () {
      expect(address.validate(ADDRESS_LOWERCASE)).to.equal(ADDRESS_FORMATTED)
    })

    it("should return 0x prefixed address for address without 0x prefix", function () {
      expect(address.validate(ADDRESS_NO_PREFIX)).to.equal(ADDRESS_FORMATTED)
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
      expect(address.isValid(ADDRESS_FORMATTED)).to.be.true
    })

    it("should return true for lowercase address", function () {
      expect(address.isValid(ADDRESS_LOWERCASE)).to.be.true
    })

    it("should return true for address without 0x prefix", function () {
      expect(address.isValid(ADDRESS_NO_PREFIX)).to.be.true
    })

    it("should return false for address containing invalid character", function () {
      expect(address.isValid(ADDRESS_INVALID)).to.be.false
    })

    it("should return false for zero address", function () {
      expect(address.isValid(ADDRESS_ZERO)).to.be.false
    })
  })

  describe("match function", function () {
    it("should return true for exactly the same addresses", function () {
      expect(address.match(ADDRESS_FORMATTED, ADDRESS_FORMATTED)).to.be.true
    })

    it("should return true when one of the addresses is lowercase", function () {
      expect(address.match(ADDRESS_LOWERCASE, ADDRESS_FORMATTED)).to.be.true
    })

    it("should return true when one of the addresses is not 0x prefixed", function () {
      expect(address.match(ADDRESS_NO_PREFIX, ADDRESS_FORMATTED)).to.be.true
    })

    it("should return false when addresses are different", function () {
      expect(
        address.match(
          ADDRESS_FORMATTED,
          "0x7Be8076f4EA4A4AD08075C2508e481d6C946D12b"
        )
      ).to.be.false
    })

    it("should throw an error for invalid address 1", function () {
      expect(function () {
        address.match(ADDRESS_INVALID, ADDRESS_FORMATTED)
      }).to.throw(
        HardhatPluginError,
        "address 0xXYZ4c3967CFb58A5c55f1de4131d126B1eFA1EE0 is not a valid address"
      )
    })

    it("should throw an error for invalid address 2", function () {
      expect(function () {
        address.match(ADDRESS_FORMATTED, ADDRESS_INVALID)
      }).to.throw(
        HardhatPluginError,
        "address 0xXYZ4c3967CFb58A5c55f1de4131d126B1eFA1EE0 is not a valid address"
      )
    })

    it("should throw an error for zero address 1", function () {
      expect(function () {
        address.match(ADDRESS_ZERO, ADDRESS_FORMATTED)
      }).to.throw(HardhatPluginError, "address is a zero address")
    })

    it("should throw an error for zero address 2", function () {
      expect(function () {
        address.match(ADDRESS_FORMATTED, ADDRESS_ZERO)
      }).to.throw(HardhatPluginError, "address is a zero address")
    })
  })
})
