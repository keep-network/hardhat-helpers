import type { BaseContract } from "ethers"
import type { HardhatRuntimeEnvironment } from "hardhat/types"

export interface HardhatContractsHelpers {
  getContract<T extends BaseContract>(deploymentName: string): Promise<T>
}

async function getContract<T extends BaseContract>(
  hre: HardhatRuntimeEnvironment,
  deploymentName: string
): Promise<T> {
  const deployment = await hre.deployments.get(deploymentName)

  return (await hre.ethers.getContractAt(
    deployment.abi,
    deployment.address
  )) as T
}

export default function (
  hre: HardhatRuntimeEnvironment
): HardhatContractsHelpers {
  return {
    getContract: (deploymentName: string) => getContract(hre, deploymentName),
  }
}
