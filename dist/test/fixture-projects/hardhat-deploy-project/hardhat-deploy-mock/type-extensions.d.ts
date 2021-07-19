import "hardhat/types/runtime";
import type { DeploymentsExtensionMock } from "./DeploymentsMock";
declare module "hardhat/types/runtime" {
    interface HardhatRuntimeEnvironment {
        deployments: DeploymentsExtensionMock;
    }
}
//# sourceMappingURL=type-extensions.d.ts.map