import "hardhat/types/runtime"

import type { DeploymentsExtensionMock } from "./DeploymentsMock"

declare module "hardhat/types/runtime" {
  export interface HardhatRuntimeEnvironment {
    // @ts-ignore
    deployments: DeploymentsExtensionMock
  }
}
