import "hardhat/types/config"
import "hardhat/types/runtime"

import type { HardhatAccountHelpers } from "./account"
import type { HardhatAddressHelpers } from "./address"
import type { HardhatContractsHelpers } from "./contracts"
import type { HardhatEtherscanHelpers } from "./etherscan"
import type { HardhatOwnableHelpers } from "./ownable"
import type { HardhatTimeHelpers } from "./time"
import type { HardhatForkingHelpers } from "./forking"
import type { HardhatNumberHelpers } from "./number"
import type { HardhatSignersHelpers } from "./signers"
import type { HardhatSnapshotHelpers } from "./snapshot"
import type { HardhatUpgradesHelpers } from "./upgrades"
import {
  DeploymentArtifactsExportConfig,
  DeploymentArtifactsExportUserConfig,
} from "./deployment-artifacts"

declare module "hardhat/types/config" {
  export interface HardhatUserConfig {
    deploymentArtifactsExport?: DeploymentArtifactsExportUserConfig
  }

  export interface HardhatConfig {
    deploymentArtifactsExport: DeploymentArtifactsExportConfig
  }
}

declare module "hardhat/types/runtime" {
  export interface HardhatRuntimeEnvironment {
    helpers: HardhatHelpers
  }
}

export interface HardhatHelpers {
  account: HardhatAccountHelpers
  address: HardhatAddressHelpers
  contracts: HardhatContractsHelpers
  etherscan: HardhatEtherscanHelpers
  forking: HardhatForkingHelpers
  number: HardhatNumberHelpers
  ownable: HardhatOwnableHelpers
  time: HardhatTimeHelpers
  signers: HardhatSignersHelpers
  snapshot: HardhatSnapshotHelpers
  upgrades: HardhatUpgradesHelpers
}
