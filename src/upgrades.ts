import type { Contract, ContractFactory } from "ethers"
import type { FactoryOptions, HardhatRuntimeEnvironment } from "hardhat/types"
import type { Deployment } from "hardhat-deploy/dist/types"
import type {
  DeployProxyOptions,
  UpgradeProxyOptions,
} from "@openzeppelin/hardhat-upgrades/src/utils/options"

export interface HardhatUpgradesHelpers {
  deployProxy<T extends Contract>(
    name: string,
    opts?: UpgradesDeployOptions
  ): Promise<T>
  upgradeProxy<T extends Contract>(
    currentContractName: string,
    newContractName: string,
    opts?: UpgradesUpgradeOptions
  ): Promise<T>
}

export interface UpgradesDeployOptions {
  contractName?: string
  initializerArgs?: unknown[]
  factoryOpts?: FactoryOptions
  proxyOpts?: DeployProxyOptions
}

export interface UpgradesUpgradeOptions {
  contractName?: string
  initializerArgs?: unknown[]
  factoryOpts?: FactoryOptions
  proxyOpts?: UpgradeProxyOptions
}

/**
 * Deploys contract as a TransparentProxy.
 *
 * @param {HardhatRuntimeEnvironment} hre Hardhat runtime environment.
 * @param {string} name Contract Name
 * @param {UpgradesDeployOptions} opts
 */
export async function deployProxy<T extends Contract>(
  hre: HardhatRuntimeEnvironment,
  name: string,
  opts?: UpgradesDeployOptions
): Promise<T> {
  const { ethers, upgrades, deployments } = hre
  const { log } = deployments

  const existingDeployment = await deployments.getOrNull(name)
  if (existingDeployment) {
    throw new Error(
      `${name} was already deployed at ${existingDeployment.address}`
    )
  }

  const contractFactory: ContractFactory = await ethers.getContractFactory(
    opts?.contractName || name,
    opts?.factoryOpts
  )

  const contractInstance: T = (await upgrades.deployProxy(
    contractFactory,
    opts?.initializerArgs,
    opts?.proxyOpts
  )) as T

  log(`Deployed ${name} with TransparentProxy at ${contractInstance.address}`)

  const jsonAbi = contractInstance.interface.format(
    ethers.utils.FormatTypes.json
  )

  const deployment: Deployment = {
    address: contractInstance.address,
    abi: JSON.parse(jsonAbi as string),
    transactionHash: contractInstance.deployTransaction.hash,
    // args: opts?.initializerArgs,
  }

  await deployments.save(name, deployment)

  return contractInstance
}

async function upgradeProxy<T extends Contract>(
  hre: HardhatRuntimeEnvironment,
  currentContractName: string,
  newContractName: string,
  opts?: UpgradesUpgradeOptions
): Promise<T> {
  const { ethers, upgrades, deployments } = hre

  const currentContract = await deployments.get(currentContractName)

  const newContract = await ethers.getContractFactory(
    opts?.contractName || newContractName,
    opts?.factoryOpts
  )

  return upgrades.upgradeProxy(
    currentContract.address,
    newContract,
    opts?.proxyOpts
  ) as Promise<T>
}

export default function (
  hre: HardhatRuntimeEnvironment
): HardhatUpgradesHelpers {
  return {
    deployProxy: (name: string, opts?: UpgradesDeployOptions) =>
      deployProxy(hre, name, opts),
    upgradeProxy: (
      currentContractName: string,
      newContractName: string,
      opts?: UpgradesUpgradeOptions
    ) => upgradeProxy(hre, currentContractName, newContractName, opts),
  }
}
