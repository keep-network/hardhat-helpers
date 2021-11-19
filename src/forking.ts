import { HardhatPluginError } from "hardhat/plugins"

import type {
  HardhatNetworkConfig,
  HardhatRuntimeEnvironment,
} from "hardhat/types"
export interface HardhatForkingHelpers {
  resetFork(blockNumber: number): Promise<void>
}

// This function is meant to be used along with the Hardhat forking feature
// (https://hardhat.org/guides/mainnet-forking.html). It resets the fork state
// to the given origin block. It is especially useful in system tests
// environment which leverage mainnet forking feature. For example, it
// can be used to set the environment to the same deterministic state, before
// each test case.
async function resetFork(hre: HardhatRuntimeEnvironment, blockNumber: number) {
  if ((hre.network.config as HardhatNetworkConfig).forking) {
    await hre.network.provider.request({
      method: "hardhat_reset",
      params: [
        {
          forking: {
            jsonRpcUrl: (hre.network.config as HardhatNetworkConfig).forking!
              .url,
            blockNumber: blockNumber,
          },
        },
      ],
    })
  } else {
    throw new HardhatPluginError(
      "@keep-network/hardhat-helpers",
      "network is not in the forking mode"
    )
  }
}

export default function (
  hre: HardhatRuntimeEnvironment
): HardhatForkingHelpers {
  return {
    resetFork: (blockNumber: number) => resetFork(hre, blockNumber),
  }
}
