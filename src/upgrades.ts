import "@openzeppelin/hardhat-upgrades"

import type { Contract, ContractFactory } from "ethers"
import type {
  Artifact,
  FactoryOptions,
  HardhatRuntimeEnvironment,
} from "hardhat/types"
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
  ): Promise<[T, Deployment]>
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
  await contractInstance.deploymentTransaction()?.wait(1)

  const contractAddress = await contractInstance.getAddress()

  log(
    `Deployed ${name} as ${
      opts?.proxyOpts?.kind || "transparent"
    } proxy at ${contractAddress} (tx: ${
      contractInstance.deploymentTransaction()?.hash
    })`
  )

  const artifact = artifacts.readArtifactSync(opts?.contractName || name)

  const implementation = await upgrades.erc1967.getImplementationAddress(
    contractAddress
  )

  const transactionHash = contractInstance.deploymentTransaction()?.hash

  const transactionReceipt = transactionHash
    ? await hre.ethers.provider.getTransactionReceipt(transactionHash)
    : null

  if (!transactionReceipt) {
    throw new Error(
      `Could not find transaction receipt for transaction hash: ${transactionHash}`
    )
  }

  const deployment: Deployment = {
    address: contractAddress,
    abi: artifact.abi,
    transactionHash,
    implementation: implementation,
    // @ts-ignore-next-line 
    receipt: transactionReceipt,
    // @ts-ignore-next-line 
    libraries: opts?.factoryOpts?.libraries,
    devdoc: "Contract deployed as upgradable proxy",
    args: opts?.proxyOpts?.constructorArgs,
  }

  await deployments.save(name, deployment)

  return [contractInstance, deployment]
}

/**
 * Upgrades previously deployed contract.
 *
 * @param {HardhatRuntimeEnvironment} hre Hardhat runtime environment.
 * @param {string} proxyDeploymentName Name of the proxy deployment that will be
 *        upgraded.
 * @param {string} newContractName Name of the new implementation contract.
 * @param {UpgradesDeployOptions} opts
 */
async function upgradeProxy<T extends Contract>(
  hre: HardhatRuntimeEnvironment,
  proxyDeploymentName: string,
  newContractName: string,
  opts?: UpgradesUpgradeOptions
): Promise<[T, Deployment]> {
  const { ethers, upgrades, deployments, artifacts } = hre
  const { log } = deployments

  const proxyDeployment: Deployment = await deployments.get(proxyDeploymentName)

  const newContract: ContractFactory = await ethers.getContractFactory(
    opts?.contractName || newContractName,
    opts?.factoryOpts
  )

  const newContractInstance: T = (await upgrades.upgradeProxy(
    proxyDeployment.address,
    newContract,
    opts?.proxyOpts
  )) as T

  // Let the transaction propagate across the ethereum nodes. This is mostly to
  // wait for all Alchemy nodes to catch up their state.
  await newContractInstance.deploymentTransaction()?.wait(1)

  const contractAddress = await newContractInstance.getAddress()

  log(
    `Upgraded ${proxyDeploymentName} proxy contract (address: ${proxyDeployment.address}) ` +
      `in tx: ${newContractInstance.deploymentTransaction()?.hash}`
  )

  const artifact: Artifact = artifacts.readArtifactSync(
    opts?.contractName || newContractName
  )

  const implementation = await upgrades.erc1967.getImplementationAddress(
    contractAddress
  )

  log(
    `New ${proxyDeploymentName} proxy contract implementation address is: ${implementation}`
  )

  const transactionHash = newContractInstance.deploymentTransaction()?.hash

  const transactionReceipt = transactionHash
    ? await hre.ethers.provider.getTransactionReceipt(transactionHash)
    : null

  if (!transactionReceipt) {
    throw new Error(
      `Could not find transaction receipt for transaction hash: ${transactionHash}`
    )
  }

  const deployment: Deployment = {
    address: contractAddress,
    abi: artifact.abi,
    transactionHash: transactionHash,
    implementation: implementation,
    // @ts-ignore-next-line 
    receipt: transactionReceipt,
    // @ts-ignore-next-line 
    libraries: opts?.factoryOpts?.libraries,
    devdoc: "Contract deployed as upgradable proxy",
    args: opts?.proxyOpts?.constructorArgs,
  }

  await deployments.save(proxyDeploymentName, deployment)

  return [newContractInstance, deployment]
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
