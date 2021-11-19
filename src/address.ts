import { ethers } from "ethers"
import { HardhatPluginError } from "hardhat/plugins"

export class Address {
  /**
   * Validates if an address is valid address supported by ethers. If the provided
   * address is incorrectly formatted it will return the address in correct Checksum
   * Address format.
   *
   * @param {string} address Address to check
   * @return {string} Address as a Checksum Address
   * @throws {HardhatPluginError} Throws an error if address is invalid format of
   * addresses supported by ethers.
   * @throws {HardhatPluginError} Throws an error if address is a zero address.
   */
  public validate(address: string): string {
    if (!ethers.utils.isAddress(address)) {
      throw new HardhatPluginError(
        "@keep-network/hardhat-helpers",
        `address ${address} is not a valid address`
      )
    }

    if (ethers.utils.getAddress(address) === ethers.constants.AddressZero) {
      throw new HardhatPluginError(
        "@keep-network/hardhat-helpers",
        `address is a zero address`
      )
    }

    return ethers.utils.getAddress(address)
  }

  /**
   * Checks if address is valid according to rules specified in the validate
   * function.
   *
   * @param {string} address Address to check
   * @return {boolean} True if address is valid, false otherwise.
   */
  public isValid(address: string): boolean {
    try {
      this.validate(address)
    } catch {
      return false
    }
    return true
  }

  /**
   * Checks if two addresses are the same.
   *
   * @param {string} address1 Address
   * @param {string} address2 Address
   * @return {boolean} True if addresses match, false otherwise.
   * @throws {HardhatPluginError} If any of the addresses is invalid according
   * to validate function rules.
   */
  public equal(address1: string, address2: string): boolean {
    this.validate(address1)
    this.validate(address2)

    return (
      ethers.utils.getAddress(address1) === ethers.utils.getAddress(address2)
    )
  }
}
