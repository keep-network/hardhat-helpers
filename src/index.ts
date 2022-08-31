import { extendEnvironment, task } from "hardhat/config"
import { HardhatPluginError, lazyObject } from "hardhat/plugins"
import { enableEmoji, emoji } from "hardhat/internal/cli/emoji"

import * as types from "hardhat/internal/core/params/argumentTypes"
import fs from "fs-extra"
import * as path from "path"

import account from "./account"
import * as address from "./address"
import contracts from "./contracts"
import etherscan from "./etherscan"
import forking from "./forking"
import * as number from "./number"
import ownable from "./ownable"
import time from "./time"
import signers from "./signers"
import snapshot from "./snapshot"
import upgrades from "./upgrades"

import "./type-extensions"

import "hardhat-deploy/dist/src/type-extensions"
import "@openzeppelin/hardhat-upgrades/dist/type-extensions"

extendEnvironment((hre) => {
  if (hre.hardhatArguments.emoji) {
    enableEmoji()
  }

  hre.helpers = lazyObject(() => {
    return {
      account: lazyObject(() => {
        return account(hre)
      }),
      address: lazyObject(() => {
        return address
      }),
      contracts: lazyObject(() => {
        return contracts(hre)
      }),
      etherscan: lazyObject(() => {
        return etherscan(hre)
      }),
      forking: lazyObject(() => {
        return forking(hre)
      }),
      number: lazyObject(() => {
        return number
      }),
      ownable: lazyObject(() => {
        return ownable(hre)
      }),
      time: lazyObject(() => {
        return time(hre)
      }),
      signers: lazyObject(() => {
        return signers(hre)
      }),
      snapshot: lazyObject(() => {
        return snapshot(hre)
      }),
      upgrades: lazyObject(() => {
        return upgrades(hre)
      }),
    }
  })
})

export const TASK_PREPARE_ARTIFACTS = "prepare-artifacts"

task(TASK_PREPARE_ARTIFACTS)
  .addOptionalPositionalParam(
    "destination",
    "destination folder where the artifacts files will be written to",
    "artifacts",
    types.string
  )
  .setAction(async (args, hre) => {
    const sourceDir = path.join(hre.config.paths.deployments, hre.network.name)
    const destinationDir = path.join(hre.config.paths.root, args.destination)

    console.log(
      `Preparing deployment artifacts for network ${hre.network.name}...`
    )

    if (!fs.pathExistsSync(sourceDir)) {
      throw new HardhatPluginError(
        "@keep-network/hardhat-helpers",
        `source deployments artifacts directory doesn't exist [${sourceDir}]`
      )
    }

    console.debug(
      `  Source:      ${sourceDir}\n  Destination: ${destinationDir}`
    )

    fs.ensureDirSync(destinationDir)
    fs.emptyDirSync(destinationDir)

    fs.copySync(sourceDir, destinationDir, {
      recursive: true,
    })

    // TODO: Remove address for `hardhat` network.

    console.log(`${emoji("🙌 ")}Done!`)
  })
