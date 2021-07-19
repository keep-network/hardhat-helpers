"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plugins_1 = require("hardhat/plugins");
const helpers_1 = require("./helpers");
const Ownable_1 = require("../src/Ownable");
const DeploymentsMock_1 = require("./fixture-projects/hardhat-deploy-project/hardhat-deploy-mock/DeploymentsMock");
const chai_1 = __importDefault(require("chai"));
chai_1.default.use(require("chai-as-promised"));
const { expect } = chai_1.default;
const address_1 = require("./data/address");
describe("Ownable", function () {
    helpers_1.useEnvironment("hardhat-deploy-project");
    const contractName = "TestContract";
    let ownable;
    beforeEach(function () {
        ownable = new Ownable_1.Ownable(this.hre);
        this.hre.deployments.currentOwner = address_1.ADDRESS_1;
    });
    describe("transferOwnership", function () {
        it("does not transfer ownership when new owner is the same as current owner", async function () {
            await ownable.transferOwnership(contractName, address_1.ADDRESS_1, address_1.ADDRESS_3);
            expect(this.hre.deployments.calls).to.have.lengthOf(1);
            expect(this.hre.deployments.calls[0]).to.deep.equal({
                functionType: DeploymentsMock_1.FunctionType.Read,
                contract: "TestContract",
                options: { from: address_1.ADDRESS_3 },
                methodName: "owner",
                args: [],
            });
        });
        it("transfers ownership when new owner is different than current owner", async function () {
            await ownable.transferOwnership(contractName, address_1.ADDRESS_2, address_1.ADDRESS_3);
            expect(this.hre.deployments.calls).to.have.lengthOf(2);
            expect(this.hre.deployments.calls[0]).to.deep.equal({
                functionType: DeploymentsMock_1.FunctionType.Read,
                contract: "TestContract",
                options: { from: address_1.ADDRESS_3 },
                methodName: "owner",
                args: [],
            });
            expect(this.hre.deployments.calls[1]).to.deep.equal({
                functionType: DeploymentsMock_1.FunctionType.Execute,
                contract: "TestContract",
                options: { from: address_1.ADDRESS_3 },
                methodName: "transferOwnership",
                args: [address_1.ADDRESS_2],
            });
        });
        it("should throw an error if new owner address is zero address", async function () {
            await expect(ownable.transferOwnership(contractName, address_1.ADDRESS_ZERO, address_1.ADDRESS_3)).to.be.rejectedWith(plugins_1.HardhatPluginError, "address is a zero address");
        });
    });
});
//# sourceMappingURL=Ownable.test.js.map