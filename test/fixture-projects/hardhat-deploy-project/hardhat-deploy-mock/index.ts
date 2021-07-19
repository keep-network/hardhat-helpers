import { extendEnvironment } from "hardhat/config"
import { DeploymentsExtensionMock } from "./DeploymentsMock"

extendEnvironment((hre) => {
  if (!hre.deployments) {
    hre.deployments = new DeploymentsExtensionMock()
  }
})
