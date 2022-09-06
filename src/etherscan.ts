import type { HardhatRuntimeEnvironment } from "hardhat/types"
import type { Deployment } from "hardhat-deploy/dist/types"

export interface HardhatEtherscanHelpers {
  verify(deployment: Deployment, contract?: string): Promise<void>
}

/**
 * Verifies contract on Etherscan.
 *
 * @param {HardhatRuntimeEnvironment} hre Hardhat runtime environment.
 * @param {Deployment} deployment Deployment Artifact
 * @param {string} contract Contract Name
 */
async function verify(
  hre: HardhatRuntimeEnvironment,
  deployment: Deployment,
  contract?: string
): Promise<void> {
  try {
    console.log(`Verifying contract ${deployment.address} on Etherscan...`)
    await hre.run("verify:verify", {
      address: deployment.address,
      constructorArguments: deployment.args,
      libraries: deployment.libraries,
      contract: contract,
    })
    // Catch the error to workaround https://github.com/NomicFoundation/hardhat/issues/2287
  } catch (err) {
    if (
      err instanceof Error &&
      (err.message.includes("Contract source code already verified") ||
        err.message.includes("Already Verified"))
    ) {
      console.log("Contract is already verified")
    } else {
      console.error(err)
    }
  }
}

export default function (
  hre: HardhatRuntimeEnvironment
): HardhatEtherscanHelpers {
  return {
    verify: (deployment: Deployment, contract?: string) =>
      verify(hre, deployment, contract),
  }
}
