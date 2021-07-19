"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
const DeploymentsMock_1 = require("./DeploymentsMock");
config_1.extendEnvironment((hre) => {
    if (!hre.deployments) {
        hre.deployments = new DeploymentsMock_1.DeploymentsExtensionMock();
    }
});
//# sourceMappingURL=index.js.map