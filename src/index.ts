import { extendEnvironment } from "hardhat/config"
import { lazyObject } from "hardhat/plugins"

import { Address } from "./Address"
import { Ownable } from "./Ownable"
import time from "./time"

import "./type-extensions"

extendEnvironment((hre) => {
  hre.helpers = lazyObject(() => {
    return {
      address: lazyObject(() => {
        return new Address()
      }),
      ownable: lazyObject(() => {
        return new Ownable(hre)
      }),
      time: lazyObject(() => {
        return time(hre)
      }),
    }
  })
})
