import type { HardhatRuntimeEnvironment } from "hardhat/types";
export declare class Ownable {
    hre: HardhatRuntimeEnvironment;
    constructor(hre: HardhatRuntimeEnvironment);
    /**
     * Transfers ownership of an Ownable contract to a specific address.
     *
     * @param {string} contractName Deployed Contract Name
     * @param {string} newOwnerAddress New Owner Address
     * @param {from} from Address to send transaction from.
     */
    transferOwnership(contractName: string, newOwnerAddress: string, from: string): Promise<void>;
}
//# sourceMappingURL=Ownable.d.ts.map