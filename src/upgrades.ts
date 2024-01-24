import "@openzeppelin/hardhat-upgrades"

import type {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
} from "ethers"
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
import { Libraries } from "hardhat-deploy/types"

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

type CustomFactoryOptions = FactoryOptions & {
  libraries?: Libraries
}

export interface UpgradesDeployOptions {
  contractName?: string
  initializerArgs?: unknown[]
  factoryOpts?: CustomFactoryOptions
  proxyOpts?: DeployProxyOptions
}

export interface UpgradesUpgradeOptions {
  contractName?: string
  initializerArgs?: unknown[]
  factoryOpts?: CustomFactoryOptions
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

  const deploymentTransaction = contractInstance.deploymentTransaction()

  // Let the transaction propagate across the ethereum nodes. This is mostly to
  // wait for all Alchemy nodes to catch up their state.
  const transactionReceipt = await deploymentTransaction?.wait(1)

  const contractAddress = await contractInstance.getAddress()
  const transactionHash = deploymentTransaction?.hash

  log(
    `Deployed ${name} as ${
      opts?.proxyOpts?.kind || "transparent"
    } proxy at ${contractAddress} (tx: ${transactionHash})`
  )

  const artifact = artifacts.readArtifactSync(opts?.contractName || name)

  const implementation = await upgrades.erc1967.getImplementationAddress(
    contractAddress
  )

  if (!transactionReceipt || !transactionHash) {
    throw new Error(
      `Could not find transaction receipt for transaction hash: ${transactionHash}`
    )
  }

  const deployment: Deployment = {
    address: contractAddress,
    abi: artifact.abi,
    transactionHash: transactionHash,
    implementation: implementation,
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

  // This is a workaround to get the deployment transaction. The upgradeProxy attaches
  // the deployment transaction to the field under a different name than ethers
  // contract.deploymentTransaction() function expects.
  // TODO: Remove this workaround once the issue is fixed on the OpenZeppelin side.
  // Tracked in: https://github.com/keep-network/hardhat-helpers/issues/49
  const deploymentTransaction =
    newContractInstance.deployTransaction as unknown as ContractTransactionResponse

  // Let the transaction propagate across the ethereum nodes. This is mostly to
  // wait for all Alchemy nodes to catch up their state.
  const transactionReceipt = await deploymentTransaction?.wait(1)

  const contractAddress = await newContractInstance.getAddress()
  const transactionHash = deploymentTransaction?.hash

  log(
    `Upgraded ${proxyDeploymentName} proxy contract (address: ${proxyDeployment.address}) ` +
      `in tx: ${transactionHash}`
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

  if (!transactionReceipt || !transactionHash) {
    throw new Error(
      `Could not find transaction receipt for transaction hash: ${transactionHash}`
    )
  }

  const deployment: Deployment = {
    address: contractAddress,
    abi: artifact.abi,
    transactionHash: transactionHash,
    implementation: implementation,
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
