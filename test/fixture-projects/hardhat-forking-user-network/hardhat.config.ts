import { HardhatUserConfig } from "hardhat/types"

import "../../../src/index"

const config: HardhatUserConfig = {
  defaultNetwork: "development",

  networks: {
    hardhat: {
      forking: {
        enabled: !!process.env.FORKING_URL,
        url: process.env.FORKING_URL || "",
      },
    },
    development: {
      url: "http://localhost:8545",
      chainId: 1101,
    },
  },
}

export default config
