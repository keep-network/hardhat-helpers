import "hardhat/types/runtime"

import type { DeploymentsExtensionMock } from "./DeploymentsMock"

declare module "hardhat/types/runtime" {
  export interface HardhatRuntimeEnvironment {
    deployments: DeploymentsExtensionMock
  }
}
