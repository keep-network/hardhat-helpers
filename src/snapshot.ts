import { JsonRpcProvider } from "@ethersproject/providers"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const snapshotIdsStack: any[] = []

export interface HardhatSnapshotHelpers {
  createSnapshot(): Promise<void>
  restoreSnapshot(): Promise<void>
}

/**
 * Snapshot the state of the blockchain at the current.
 * @param {JsonRpcProvider} provider Ethers provider
 */
export async function createSnapshot(provider: JsonRpcProvider): Promise<void> {
  const snapshotId = await provider.send("evm_snapshot", [])
  snapshotIdsStack.push(snapshotId)
}

/**
 * Restores the chain to a latest snapshot.
 * @param {JsonRpcProvider} provider Ethers provider
 */
export async function restoreSnapshot(
  provider: JsonRpcProvider
): Promise<void> {
  const snapshotId = snapshotIdsStack.pop()
  await provider.send("evm_revert", [snapshotId])
}

export default function (
  hre: HardhatRuntimeEnvironment
): HardhatSnapshotHelpers {
  const provider = hre.ethers.provider

  return {
    createSnapshot: () => createSnapshot(provider),
    restoreSnapshot: () => restoreSnapshot(provider),
  }
}
