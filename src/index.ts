import { extendConfig, extendEnvironment, task } from "hardhat/config"
import { lazyObject } from "hardhat/plugins"
import { enableEmoji } from "hardhat/internal/cli/emoji"

import * as path from "path"

import account from "./account"
import * as address from "./address"
import contracts from "./contracts"
import { exportDeploymentArtifacts } from "./deployment-artifacts"
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

import type { HardhatConfig, HardhatUserConfig } from "hardhat/types"

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

extendConfig(
  (config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
    const exportUserConfig = userConfig.deploymentArtifactsExport

    if (config.deploymentArtifactsExport === undefined) {
      config.deploymentArtifactsExport = {}
    }

    let defaultDestinationDir = exportUserConfig?.default ?? "artifacts"

    if (path.isAbsolute(defaultDestinationDir)) {
      defaultDestinationDir = defaultDestinationDir
    } else {
      defaultDestinationDir = path.normalize(
        path.join(config.paths.root, defaultDestinationDir)
      )
    }

    const networks = Object.keys(config.networks)

    networks.forEach((networkName: string) => {
      if (
        exportUserConfig === undefined ||
        exportUserConfig[networkName] === undefined
      ) {
        config.deploymentArtifactsExport[networkName] = defaultDestinationDir
      } else {
        let networkDestinationDir = exportUserConfig[networkName]!

        if (path.isAbsolute(networkDestinationDir)) {
          networkDestinationDir = networkDestinationDir
        } else {
          networkDestinationDir = path.normalize(
            path.join(config.paths.root, networkDestinationDir)
          )
        }

        config.deploymentArtifactsExport[networkName] = networkDestinationDir
      }
    })
  }
)

export const TASK_EXPORT_DEPLOYMENT_ARTIFACTS = "export-deployment-artifacts"

task(TASK_EXPORT_DEPLOYMENT_ARTIFACTS).setAction(async (args, hre) => {
  exportDeploymentArtifacts(hre)
})

export const TASK_PREPARE_ARTIFACTS = "prepare-artifacts" // deprecated

task(TASK_PREPARE_ARTIFACTS).setAction(async (args, hre) => {
  console.warn(
    '"prepare-artifacts" task is deprecated; ' +
      'please use "export-deployment-artifacts instead"'
  )
  exportDeploymentArtifacts(hre)
})
