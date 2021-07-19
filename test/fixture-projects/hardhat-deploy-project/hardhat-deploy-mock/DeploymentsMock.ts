import type { TxOptions, CallOptions, Receipt } from "hardhat-deploy/types"

/* eslint-disable no-unused-vars */
export enum FunctionType {
  Log,
  Read,
  Execute,
}
/* eslint-enable no-unused-vars */

type CallData = {
  functionType: FunctionType
  contract: string
  options: CallOptions | string
  methodName: string
  args: any[]
}

/**
 * Interface defining functions from 'hardhat-deploy' plugin that we use.
 */
export interface DeploymentsExtension {
  log(...args: any[]): void

  read(
    name: string,
    options: CallOptions | string,
    methodName?: string | any,
    ...args: any[]
  ): Promise<any>

  execute(
    name: string,
    options: TxOptions,
    methodName: string,
    ...args: any[]
  ): Promise<Receipt>
}

export class DeploymentsExtensionMock implements DeploymentsExtension {
  public calls: CallData[]
  public currentOwner: string = ""

  constructor() {
    this.calls = []
  }

  log(...args: any[]): void {
    console.log(`${args}`)
  }

  public async read(
    name: string,
    options: CallOptions | string,
    methodName?: string | any,
    ...args: any[]
  ): Promise<any> {
    this.registerCall(FunctionType.Read, name, options, methodName, args)
    return this.currentOwner
  }

  public async execute(
    name: string,
    options: TxOptions,
    methodName: string,
    ...args: any[]
  ): Promise<Receipt> {
    this.registerCall(FunctionType.Execute, name, options, methodName, args)

    return {
      from: "MOCK_CONTRACT",
      transactionHash: `MOCK_HASH_${this.calls.length}`,
      blockHash: "BLOCK_HASH",
      blockNumber: 808,
      transactionIndex: this.calls.length,
      cumulativeGasUsed: 101,
      gasUsed: 20,
    }
  }

  registerCall(
    functionType: FunctionType,
    contract: string,
    options: CallOptions | string,
    methodName: string,
    args: any[]
  ): void {
    this.calls.push({
      functionType: functionType,
      contract: contract,
      options: options,
      methodName: methodName,
      args: args,
    })
  }
}
