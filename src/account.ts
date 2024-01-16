import "@nomicfoundation/hardhat-ethers"

import { parseUnits, parseEther, Signer } from "ethers"
import type { HardhatRuntimeEnvironment } from "hardhat/types"
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers"

export type FundOptions = {
  from: Signer
  value?: bigint
  unit?: string
}

export interface HardhatAccountHelpers {
  impersonateAccount(
    accountAddress: string,
    fundOptions?: FundOptions
  ): Promise<SignerWithAddress>
}

async function impersonateAccount(
  hre: HardhatRuntimeEnvironment,
  accountAddress: string,
  fundOptions?: FundOptions
) {
  // Make the required call against Hardhat Runtime Environment.
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [accountAddress],
  })

  if (fundOptions?.from!) {
    // Fund the account using a purse account in order to make transactions.
    // In case the account represents a contract, keep in mind the contract must
    // have a receive or fallback method to be funded successfully.

    let fundingValue: bigint
    if (fundOptions.unit) {
      fundingValue = parseUnits(fundOptions.value!.toString(), fundOptions.unit)
    } else {
      fundingValue = parseEther(fundOptions.value?.toString() || "1")
    }

    await fundOptions.from.sendTransaction({
      to: accountAddress,
      value: fundingValue,
    })
  }

  // Return the account's signer.
  return await hre.ethers.getSigner(accountAddress)
}

export default function (
  hre: HardhatRuntimeEnvironment
): HardhatAccountHelpers {
  return {
    impersonateAccount: (accountAddress: string, fundOptions: FundOptions) =>
      impersonateAccount(hre, accountAddress, fundOptions),
  }
}
