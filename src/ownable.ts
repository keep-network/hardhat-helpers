import type { HardhatRuntimeEnvironment } from "hardhat/types"

export interface HardhatOwnableHelpers {
  transferOwnership(
    contractName: string,
    newOwnerAddress: string,
    from: string
  ): Promise<void>
}

/**
 * Transfers ownership of an Ownable contract to a specific address.
 *
 * @param {HardhatRuntimeEnvironment} hre Hardhat runtime environment.
 * @param {string} contractName Deployed Contract Name
 * @param {string} newOwnerAddress New Owner Address
 * @param {string} from Address to send transaction from.
 */
export async function transferOwnership(
  hre: HardhatRuntimeEnvironment,
  contractName: string,
  newOwnerAddress: string,
  from: string
): Promise<void> {
  const { helpers, deployments } = hre
  const { log } = deployments

  const currentOwner = await deployments.read(contractName, { from }, "owner")

  if (!(currentOwner && helpers.address.equal(currentOwner, newOwnerAddress))) {
    log(`transferring ownership of ${contractName} to ${newOwnerAddress}`)

    await deployments.execute(
      contractName,
      { from: from, log: true, waitConfirmations: 1 },
      "transferOwnership",
      newOwnerAddress
    )
  } else {
    log(`${contractName} is owned by ${currentOwner}`)
  }
}

export default function (
  hre: HardhatRuntimeEnvironment
): HardhatOwnableHelpers {
  return {
    transferOwnership: (
      contractName: string,
      newOwnerAddress: string,
      from: string
    ) => transferOwnership(hre, contractName, newOwnerAddress, from),
  }
}
