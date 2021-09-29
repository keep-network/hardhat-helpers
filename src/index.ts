import { extendEnvironment } from "hardhat/config"
import { lazyObject } from "hardhat/plugins"

import { Address } from "./Address"
import { Ownable } from "./Ownable"
import { TestUtils } from "./TestUtils"

import "./type-extensions"

extendEnvironment((hre) => {
  hre.helpers = lazyObject(() => {
    return {
      address: new Address(),
      ownable: new Ownable(hre),
      testUtils: new TestUtils(),
    }
  })
})
