import { extendEnvironment } from "hardhat/config"
import { lazyObject } from "hardhat/plugins"

import { Address } from "./Address"

import "./type-extensions"

extendEnvironment((hre) => {
  hre.helpers = lazyObject(() => {
    return {
      address: new Address(),
    }
  })
})
