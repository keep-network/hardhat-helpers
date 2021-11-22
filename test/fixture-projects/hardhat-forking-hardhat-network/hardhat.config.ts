import { HardhatUserConfig } from "hardhat/types"

import "../../../src/index"

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",

  networks: {
    hardhat: {},
    development: {
      url: "http://localhost:8545",
      chainId: 1101,
    },
  },
}

if (process.env.FORKING_URL) {
  config.networks!.hardhat!.forking = {
    enabled: true,
    url: process.env.FORKING_URL,
  }
}

export default config
