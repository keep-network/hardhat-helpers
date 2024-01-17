import {
  SnapshotRestorer,
  takeSnapshot,
} from "@nomicfoundation/hardhat-network-helpers"

const snapshotStack: SnapshotRestorer[] = []

export interface HardhatSnapshotHelpers {
  createSnapshot(): Promise<void>
  restoreSnapshot(): Promise<void>
}

/**
 * Snapshot the state of the blockchain at the current.
 */
export async function createSnapshot(): Promise<void> {
  const snapshot = await takeSnapshot()
  snapshotStack.push(snapshot)
}

/**
 * Restores the chain to a latest snapshot.
 */
export async function restoreSnapshot(): Promise<void> {
  const snapshot = snapshotStack.pop()
  await snapshot?.restore()
}

export default function (): HardhatSnapshotHelpers {
  return {
    createSnapshot,
    restoreSnapshot,
  }
}
