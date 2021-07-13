"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
const plugins_1 = require("hardhat/plugins");
const Address_1 = require("./Address");
require("./type-extensions");
config_1.extendEnvironment((hre) => {
    hre.helpers = plugins_1.lazyObject(() => {
        return {
            address: new Address_1.Address(),
        };
    });
});
//# sourceMappingURL=index.js.map