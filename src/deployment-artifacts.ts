import { HardhatRuntimeEnvironment } from "hardhat/types"
import { HardhatPluginError } from "hardhat/plugins"

import fs from "fs-extra"
import * as path from "path"
import { emoji } from "hardhat/internal/cli/emoji"

export type DeploymentArtifactsExportUserConfig = {
  default?: string
  [networkName: string]: string | undefined
}

export type DeploymentArtifactsExportConfig = {
  [networkName: string]: string
}

export function exportDeploymentArtifacts(hre: HardhatRuntimeEnvironment) {
  const networkName = hre.network.name

  copyDeploymentArtifacts(hre, networkName)

  // TODO: Remove address for `hardhat` network.

  console.log(`${emoji("🙌 ")}Done!`)
}

function copyDeploymentArtifacts(
  hre: HardhatRuntimeEnvironment,
  networkName: string
) {
  const sourceDir = path.join(hre.config.paths.deployments, networkName)
  const destinationDir = path.resolve(
    hre.config.deploymentArtifactsExport[networkName]
  )

  console.log(`Exporting deployment artifacts for network ${networkName}...`)

  if (!fs.pathExistsSync(sourceDir)) {
    throw new HardhatPluginError(
      "@keep-network/hardhat-helpers",
      `source deployments artifacts directory doesn't exist [${sourceDir}]`
    )
  }

  console.debug(`  Source:      ${sourceDir}\n  Destination: ${destinationDir}`)

  fs.ensureDirSync(destinationDir)
  fs.emptyDirSync(destinationDir)

  fs.copySync(sourceDir, destinationDir, {
    recursive: true,
  })
}
