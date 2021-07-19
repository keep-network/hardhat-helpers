"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
const plugins_1 = require("hardhat/plugins");
const Address_1 = require("./Address");
const Ownable_1 = require("./Ownable");
require("./type-extensions");
config_1.extendEnvironment((hre) => {
    hre.helpers = plugins_1.lazyObject(() => {
        return {
            address: new Address_1.Address(),
            ownable: new Ownable_1.Ownable(hre),
        };
    });
});
//# sourceMappingURL=index.js.map