import "hardhat/types/runtime"

import type { HardhatAccountHelpers } from "./account"
import type { HardhatAddressHelpers } from "./address"
import type { HardhatOwnableHelpers } from "./ownable"
import type { HardhatTimeHelpers } from "./time"
import type { HardhatForkingHelpers } from "./forking"
import type { HardhatNumberHelpers } from "./number"
import type { HardhatSnapshotHelpers } from "./snapshot"

declare module "hardhat/types/runtime" {
  export interface HardhatRuntimeEnvironment {
    helpers: HardhatHelpers
  }
}

export interface HardhatHelpers {
  account: HardhatAccountHelpers
  address: HardhatAddressHelpers
  forking: HardhatForkingHelpers
  number: HardhatNumberHelpers
  ownable: HardhatOwnableHelpers
  time: HardhatTimeHelpers
  snapshot: HardhatSnapshotHelpers
}
