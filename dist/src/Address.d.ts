export declare class Address {
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
    validate(address: string): string;
    /**
     * Checks if address is valid according to rules specified in the validate
     * function.
     *
     * @param {string} address Address to check
     * @return {boolean} True if address is valid, false otherwise.
     */
    isValid(address: string): boolean;
    /**
     * Checks if two addresses are the same.
     *
     * @param {string} address1 Address
     * @param {string} address2 Address
     * @return {boolean} True if addresses match, false otherwise.
     * @throws {HardhatPluginError} If any of the addresses is invalid according
     * to validate function rules.
     */
    equal(address1: string, address2: string): boolean;
}
//# sourceMappingURL=Address.d.ts.map