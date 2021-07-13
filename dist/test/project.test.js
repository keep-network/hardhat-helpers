"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Address_1 = require("../src/Address");
const helpers_1 = require("./helpers");
const VALID_ADDRESS = "0xb894c3967CFb58A5c55f1de4131d126B1eFA1EE0";
describe("Hardhat Runtime Environment extension", function () {
    helpers_1.useEnvironment("hardhat-project");
    it("should add the helpers field", function () {
        chai_1.expect(this.hre.helpers).not.to.be.null;
        chai_1.expect(this.hre.helpers).to.contain.all.keys(["address"]);
        chai_1.expect(this.hre.helpers.address).to.be.instanceOf(Address_1.Address);
    });
    describe("address helpers", function () {
        it("validate function should return an address", function () {
            chai_1.expect(this.hre.helpers.address.validate(VALID_ADDRESS)).to.equal(VALID_ADDRESS);
        });
        it("isValid function should return true", function () {
            chai_1.expect(this.hre.helpers.address.isValid(VALID_ADDRESS)).to.be.true;
        });
        it("equal function should return true", function () {
            chai_1.expect(this.hre.helpers.address.equal(VALID_ADDRESS, VALID_ADDRESS)).to.be
                .true;
        });
    });
});
//# sourceMappingURL=project.test.js.map