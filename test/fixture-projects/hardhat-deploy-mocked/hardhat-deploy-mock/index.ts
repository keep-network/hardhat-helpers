import { extendEnvironment } from "hardhat/config"
import { DeploymentsExtensionMock } from "./DeploymentsMock"

extendEnvironment((hre) => {
  if (!hre.deployments) {
    // @ts-ignore
    hre.deployments = new DeploymentsExtensionMock()
  }
})
