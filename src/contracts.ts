import type { BaseContract } from "ethers"
import type { HardhatRuntimeEnvironment } from "hardhat/types"

export interface HardhatContractsHelpers {
  getContract<T extends BaseContract>(
    deploymentName: string,
    contractName?: string
  ): Promise<T>
}

async function getContract<T extends BaseContract>(
  hre: HardhatRuntimeEnvironment,
  deploymentName: string,
  contractName: string = deploymentName
): Promise<T> {
  return (await hre.ethers.getContractAt(
    contractName,
    (
      await hre.deployments.get(deploymentName)
    ).address
  )) as T
}

export default function (
  hre: HardhatRuntimeEnvironment
): HardhatContractsHelpers {
  return {
    getContract: (deploymentName: string, contractName?: string) =>
      getContract(hre, deploymentName, contractName),
  }
}
