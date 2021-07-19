"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const plugins_1 = require("hardhat/plugins");
const Address_1 = require("../src/Address");
const address_1 = require("./data/address");
describe("Address", function () {
    const address = new Address_1.Address();
    describe("validate function", function () {
        it("should return address for valid address", function () {
            chai_1.expect(address.validate(address_1.ADDRESS_1)).to.equal(address_1.ADDRESS_1);
        });
        it("should return formatted address for lowercase address", function () {
            chai_1.expect(address.validate(address_1.ADDRESS_1_LOWERCASE)).to.equal(address_1.ADDRESS_1);
        });
        it("should return 0x prefixed address for address without 0x prefix", function () {
            chai_1.expect(address.validate(address_1.ADDRESS_1_NO_PREFIX)).to.equal(address_1.ADDRESS_1);
        });
        it("should throw an error for address containing invalid character", function () {
            chai_1.expect(function () {
                address.validate(address_1.ADDRESS_INVALID);
            }).to.throw(plugins_1.HardhatPluginError, "address 0xXYZ4c3967CFb58A5c55f1de4131d126B1eFA1EE0 is not a valid address");
        });
        it("should throw an error for zero address", function () {
            chai_1.expect(function () {
                address.validate(address_1.ADDRESS_ZERO);
            }).to.throw(plugins_1.HardhatPluginError, "address is a zero address");
        });
    });
    describe("isValid function", function () {
        it("should return true for valid address", function () {
            chai_1.expect(address.isValid(address_1.ADDRESS_1)).to.be.true;
        });
        it("should return true for lowercase address", function () {
            chai_1.expect(address.isValid(address_1.ADDRESS_1_LOWERCASE)).to.be.true;
        });
        it("should return true for address without 0x prefix", function () {
            chai_1.expect(address.isValid(address_1.ADDRESS_1_NO_PREFIX)).to.be.true;
        });
        it("should return false for address containing invalid character", function () {
            chai_1.expect(address.isValid(address_1.ADDRESS_INVALID)).to.be.false;
        });
        it("should return false for zero address", function () {
            chai_1.expect(address.isValid(address_1.ADDRESS_ZERO)).to.be.false;
        });
    });
    describe("equal function", function () {
        it("should return true for exactly the same addresses", function () {
            chai_1.expect(address.equal(address_1.ADDRESS_1, address_1.ADDRESS_1)).to.be.true;
        });
        it("should return true when one of the addresses is lowercase", function () {
            chai_1.expect(address.equal(address_1.ADDRESS_1_LOWERCASE, address_1.ADDRESS_1)).to.be.true;
        });
        it("should return true when one of the addresses is not 0x prefixed", function () {
            chai_1.expect(address.equal(address_1.ADDRESS_1_NO_PREFIX, address_1.ADDRESS_1)).to.be.true;
        });
        it("should return false when addresses are different", function () {
            chai_1.expect(address.equal(address_1.ADDRESS_1, address_1.ADDRESS_2)).to.be.false;
        });
        it("should throw an error for invalid address 1", function () {
            chai_1.expect(function () {
                address.equal(address_1.ADDRESS_INVALID, address_1.ADDRESS_1);
            }).to.throw(plugins_1.HardhatPluginError, "address 0xXYZ4c3967CFb58A5c55f1de4131d126B1eFA1EE0 is not a valid address");
        });
        it("should throw an error for invalid address 2", function () {
            chai_1.expect(function () {
                address.equal(address_1.ADDRESS_1, address_1.ADDRESS_INVALID);
            }).to.throw(plugins_1.HardhatPluginError, "address 0xXYZ4c3967CFb58A5c55f1de4131d126B1eFA1EE0 is not a valid address");
        });
        it("should throw an error for zero address 1", function () {
            chai_1.expect(function () {
                address.equal(address_1.ADDRESS_ZERO, address_1.ADDRESS_1);
            }).to.throw(plugins_1.HardhatPluginError, "address is a zero address");
        });
        it("should throw an error for zero address 2", function () {
            chai_1.expect(function () {
                address.equal(address_1.ADDRESS_1, address_1.ADDRESS_ZERO);
            }).to.throw(plugins_1.HardhatPluginError, "address is a zero address");
        });
    });
});
//# sourceMappingURL=Address.test.js.map