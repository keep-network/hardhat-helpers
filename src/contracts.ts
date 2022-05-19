import type { Contract } from "ethers"
import type { HardhatRuntimeEnvironment } from "hardhat/types"

export interface HardhatContractsHelpers {
  getContract<T extends Contract>(deploymentName: string): Promise<T>
}

async function getContract<T extends Contract>(
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
