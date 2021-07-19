import type { HardhatRuntimeEnvironment } from "hardhat/types"

export class Ownable {
  hre: HardhatRuntimeEnvironment

  constructor(hre: HardhatRuntimeEnvironment) {
    this.hre = hre
  }

  /**
   * Transfers ownership of an Ownable contract to a specific address.
   *
   * @param {string} contractName Deployed Contract Name
   * @param {string} newOwnerAddress New Owner Address
   * @param {from} from Address to send transaction from.
   */
  public async transferOwnership(
    contractName: string,
    newOwnerAddress: string,
    from: string
  ): Promise<void> {
    const { helpers, deployments } = this.hre
    const { log } = deployments

    newOwnerAddress = helpers.address.validate(newOwnerAddress)

    const currentOwner = await deployments.read(contractName, { from }, "owner")

    if (!helpers.address.equal(currentOwner, newOwnerAddress)) {
      log(`transferring ownership of ${contractName} to ${newOwnerAddress}`)

      await deployments.execute(
        contractName,
        { from },
        "transferOwnership",
        newOwnerAddress
      )
    } else {
      log(`${contractName} is owned by ${currentOwner}`)
    }
  }
}
