import { HardhatUserConfig } from "hardhat/types"

import "./hardhat-deploy-mock/index"
import "../../../src/index"

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
}

export default config
