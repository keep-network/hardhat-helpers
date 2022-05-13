import "hardhat/types/runtime"

import type { HardhatAccountHelpers } from "./account"
import type { HardhatAddressHelpers } from "./address"
import type { HardhatContractsHelpers } from "./contracts"
import type { HardhatOwnableHelpers } from "./ownable"
import type { HardhatTimeHelpers } from "./time"
import type { HardhatForkingHelpers } from "./forking"
import type { HardhatNumberHelpers } from "./number"
import type { HardhatSignersHelpers } from "./signers"
import type { HardhatSnapshotHelpers } from "./snapshot"
import type { HardhatUpgradesHelpers } from "./upgrades"

declare module "hardhat/types/runtime" {
  export interface HardhatRuntimeEnvironment {
    helpers: HardhatHelpers
  }
}

export interface HardhatHelpers {
  account: HardhatAccountHelpers
  address: HardhatAddressHelpers
  contracts: HardhatContractsHelpers
  forking: HardhatForkingHelpers
  number: HardhatNumberHelpers
  ownable: HardhatOwnableHelpers
  time: HardhatTimeHelpers
  signers: HardhatSignersHelpers
  snapshot: HardhatSnapshotHelpers
  upgrades: HardhatUpgradesHelpers
}
