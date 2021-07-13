"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
const ethers_1 = require("ethers");
const plugins_1 = require("hardhat/plugins");
class Address {
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
    validate(address) {
        if (!ethers_1.ethers.utils.isAddress(address)) {
            throw new plugins_1.HardhatPluginError("@keep-network/hardhat-helpers", `address ${address} is not a valid address`);
        }
        if (ethers_1.ethers.utils.getAddress(address) === ethers_1.ethers.constants.AddressZero) {
            throw new plugins_1.HardhatPluginError("@keep-network/hardhat-helpers", `address is a zero address`);
        }
        return ethers_1.ethers.utils.getAddress(address);
    }
    /**
     * Checks if address is valid according to rules specified in the validate
     * function.
     *
     * @param {string} address Address to check
     * @return {boolean} True if address is valid, false otherwise.
     */
    isValid(address) {
        try {
            this.validate(address);
        }
        catch (_a) {
            return false;
        }
        return true;
    }
    /**
     * Checks if two addresses match.
     *
     * @param {string} address1 Address
     * @param {string} address2 Address
     * @return {boolean} True if addresses match, false otherwise.
     * @throws {HardhatPluginError} If any of the addresses is invalid according
     * to validate function rules.
     */
    match(address1, address2) {
        this.validate(address1);
        this.validate(address2);
        return (ethers_1.ethers.utils.getAddress(address1) === ethers_1.ethers.utils.getAddress(address2));
    }
}
exports.Address = Address;
//# sourceMappingURL=Address.js.map