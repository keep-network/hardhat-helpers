"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const plugins_1 = require("hardhat/plugins");
const Address_1 = require("../src/Address");
const ADDRESS_LOWERCASE = "0xb894c3967cfb58a5c55f1de4131d126b1efa1ee0";
const ADDRESS_FORMATTED = "0xb894c3967CFb58A5c55f1de4131d126B1eFA1EE0";
const ADDRESS_NO_PREFIX = "b894c3967CFb58A5c55f1de4131d126B1eFA1EE0";
const ADDRESS_INVALID = "0xXYZ4c3967CFb58A5c55f1de4131d126B1eFA1EE0";
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
describe("Address", function () {
    const address = new Address_1.Address();
    describe("validate function", function () {
        it("should return address for valid address", function () {
            chai_1.expect(address.validate(ADDRESS_FORMATTED)).to.equal(ADDRESS_FORMATTED);
        });
        it("should return formatted address for lowercase address", function () {
            chai_1.expect(address.validate(ADDRESS_LOWERCASE)).to.equal(ADDRESS_FORMATTED);
        });
        it("should return 0x prefixed address for address without 0x prefix", function () {
            chai_1.expect(address.validate(ADDRESS_NO_PREFIX)).to.equal(ADDRESS_FORMATTED);
        });
        it("should throw an error for address containing invalid character", function () {
            chai_1.expect(function () {
                address.validate(ADDRESS_INVALID);
            }).to.throw(plugins_1.HardhatPluginError, "address 0xXYZ4c3967CFb58A5c55f1de4131d126B1eFA1EE0 is not a valid address");
        });
        it("should throw an error for zero address", function () {
            chai_1.expect(function () {
                address.validate(ADDRESS_ZERO);
            }).to.throw(plugins_1.HardhatPluginError, "address is a zero address");
        });
    });
    describe("isValid function", function () {
        it("should return true for valid address", function () {
            chai_1.expect(address.isValid(ADDRESS_FORMATTED)).to.be.true;
        });
        it("should return true for lowercase address", function () {
            chai_1.expect(address.isValid(ADDRESS_LOWERCASE)).to.be.true;
        });
        it("should return true for address without 0x prefix", function () {
            chai_1.expect(address.isValid(ADDRESS_NO_PREFIX)).to.be.true;
        });
        it("should return false for address containing invalid character", function () {
            chai_1.expect(address.isValid(ADDRESS_INVALID)).to.be.false;
        });
        it("should return false for zero address", function () {
            chai_1.expect(address.isValid(ADDRESS_ZERO)).to.be.false;
        });
    });
    describe("equal function", function () {
        it("should return true for exactly the same addresses", function () {
            chai_1.expect(address.equal(ADDRESS_FORMATTED, ADDRESS_FORMATTED)).to.be.true;
        });
        it("should return true when one of the addresses is lowercase", function () {
            chai_1.expect(address.equal(ADDRESS_LOWERCASE, ADDRESS_FORMATTED)).to.be.true;
        });
        it("should return true when one of the addresses is not 0x prefixed", function () {
            chai_1.expect(address.equal(ADDRESS_NO_PREFIX, ADDRESS_FORMATTED)).to.be.true;
        });
        it("should return false when addresses are different", function () {
            chai_1.expect(address.equal(ADDRESS_FORMATTED, "0x7Be8076f4EA4A4AD08075C2508e481d6C946D12b")).to.be.false;
        });
        it("should throw an error for invalid address 1", function () {
            chai_1.expect(function () {
                address.equal(ADDRESS_INVALID, ADDRESS_FORMATTED);
            }).to.throw(plugins_1.HardhatPluginError, "address 0xXYZ4c3967CFb58A5c55f1de4131d126B1eFA1EE0 is not a valid address");
        });
        it("should throw an error for invalid address 2", function () {
            chai_1.expect(function () {
                address.equal(ADDRESS_FORMATTED, ADDRESS_INVALID);
            }).to.throw(plugins_1.HardhatPluginError, "address 0xXYZ4c3967CFb58A5c55f1de4131d126B1eFA1EE0 is not a valid address");
        });
        it("should throw an error for zero address 1", function () {
            chai_1.expect(function () {
                address.equal(ADDRESS_ZERO, ADDRESS_FORMATTED);
            }).to.throw(plugins_1.HardhatPluginError, "address is a zero address");
        });
        it("should throw an error for zero address 2", function () {
            chai_1.expect(function () {
                address.equal(ADDRESS_FORMATTED, ADDRESS_ZERO);
            }).to.throw(plugins_1.HardhatPluginError, "address is a zero address");
        });
    });
});
//# sourceMappingURL=Address.test.js.map