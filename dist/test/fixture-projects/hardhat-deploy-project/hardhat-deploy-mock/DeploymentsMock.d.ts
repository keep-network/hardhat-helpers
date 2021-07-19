import type { TxOptions, CallOptions, Receipt } from "hardhat-deploy/types";
export declare enum FunctionType {
    Log = 0,
    Read = 1,
    Execute = 2
}
declare type CallData = {
    functionType: FunctionType;
    contract: string;
    options: CallOptions | string;
    methodName: string;
    args: any[];
};
/**
 * Interface defining functions from 'hardhat-deploy' plugin that we use.
 */
export interface DeploymentsExtension {
    log(...args: any[]): void;
    read(name: string, options: CallOptions | string, methodName?: string | any, ...args: any[]): Promise<any>;
    execute(name: string, options: TxOptions, methodName: string, ...args: any[]): Promise<Receipt>;
}
export declare class DeploymentsExtensionMock implements DeploymentsExtension {
    calls: CallData[];
    currentOwner: string;
    constructor();
    log(...args: any[]): void;
    read(name: string, options: CallOptions | string, methodName?: string | any, ...args: any[]): Promise<any>;
    execute(name: string, options: TxOptions, methodName: string, ...args: any[]): Promise<Receipt>;
    registerCall(functionType: FunctionType, contract: string, options: CallOptions | string, methodName: string, args: any[]): void;
}
export {};
//# sourceMappingURL=DeploymentsMock.d.ts.map