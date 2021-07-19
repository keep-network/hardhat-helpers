import "hardhat/types/runtime";
import type { HardhatHelpers } from "./types";
declare module "hardhat/types/runtime" {
    interface HardhatRuntimeEnvironment {
        helpers: HardhatHelpers;
    }
}
//# sourceMappingURL=type-extensions.d.ts.map