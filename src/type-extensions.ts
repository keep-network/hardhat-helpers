import "hardhat/types/runtime"

import type { HardhatHelpers } from "./types"

declare module "hardhat/types/runtime" {
  export interface HardhatRuntimeEnvironment {
    helpers: HardhatHelpers
  }
}
