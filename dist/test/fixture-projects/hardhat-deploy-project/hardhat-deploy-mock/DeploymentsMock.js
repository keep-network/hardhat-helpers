"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeploymentsExtensionMock = exports.FunctionType = void 0;
/* eslint-disable no-unused-vars */
var FunctionType;
(function (FunctionType) {
    FunctionType[FunctionType["Log"] = 0] = "Log";
    FunctionType[FunctionType["Read"] = 1] = "Read";
    FunctionType[FunctionType["Execute"] = 2] = "Execute";
})(FunctionType = exports.FunctionType || (exports.FunctionType = {}));
class DeploymentsExtensionMock {
    constructor() {
        this.currentOwner = "";
        this.calls = [];
    }
    log(...args) {
        console.log(`${args}`);
    }
    async read(name, options, methodName, ...args) {
        this.registerCall(FunctionType.Read, name, options, methodName, args);
        return this.currentOwner;
    }
    async execute(name, options, methodName, ...args) {
        this.registerCall(FunctionType.Execute, name, options, methodName, args);
        return {
            from: "MOCK_CONTRACT",
            transactionHash: `MOCK_HASH_${this.calls.length}`,
            blockHash: "BLOCK_HASH",
            blockNumber: 808,
            transactionIndex: this.calls.length,
            cumulativeGasUsed: 101,
            gasUsed: 20,
        };
    }
    registerCall(functionType, contract, options, methodName, args) {
        this.calls.push({
            functionType: functionType,
            contract: contract,
            options: options,
            methodName: methodName,
            args: args,
        });
    }
}
exports.DeploymentsExtensionMock = DeploymentsExtensionMock;
//# sourceMappingURL=DeploymentsMock.js.map