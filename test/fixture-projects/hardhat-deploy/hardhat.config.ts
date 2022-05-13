import { HardhatUserConfig } from "hardhat/types"

import "hardhat-deploy"
import "../../../src/index"

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      accounts: {
        count: 24,
      },
    },
  },
  namedAccounts: {
    deployer: {
      default: 1,
    },
    governance: {
      default: 2,
    },
  },
}

export default config
