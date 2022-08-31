import "@openzeppelin/hardhat-upgrades"

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
  ): Promise<[T, Deployment]>
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
): Promise<[T, Deployment]> {
  const { ethers, upgrades, deployments, artifacts } = hre
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

  // Let the transaction propagate across the ethereum nodes. This is mostly to
  // wait for all Alchemy nodes to catch up their state.
  await contractInstance.deployTransaction.wait(1)

  log(
    `Deployed ${name} as ${opts?.proxyOpts?.kind || "transparent"} proxy at ${
      contractInstance.address
    } (tx: ${contractInstance.deployTransaction.hash})`
  )

  const artifact = artifacts.readArtifactSync(opts?.contractName || name)

  const adminInstance = await upgrades.admin.getInstance()
  const implementation = await adminInstance.getProxyImplementation(
    contractInstance.address
  )

  const transactionReceipt = await ethers.provider.getTransactionReceipt(
    contractInstance.deployTransaction.hash
  )

  const deployment: Deployment = {
    address: contractInstance.address,
    abi: artifact.abi,
    transactionHash: contractInstance.deployTransaction.hash,
    implementation: implementation,
    receipt: transactionReceipt,
    libraries: opts?.factoryOpts?.libraries,
    devdoc: "Contract deployed as upgradable proxy",
    args: opts?.proxyOpts?.constructorArgs,
  }

  await deployments.save(name, deployment)

  return [contractInstance, deployment]
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
