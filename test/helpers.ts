import { resetHardhatContext } from "hardhat/plugins-testing"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import path from "path"

declare module "mocha" {
  export interface Context {
    hre: HardhatRuntimeEnvironment
  }
}

export function useEnvironment(
  fixtureProjectName: string,
  preFunction?: () => void
) {
  beforeEach("Loading hardhat environment", function () {
    if (preFunction) preFunction()

    process.chdir(path.join(__dirname, "fixture-projects", fixtureProjectName))

    this.hre = require("hardhat")
  })

  afterEach("Resetting hardhat", function () {
    resetHardhatContext()
  })
}
