import type { Address } from "./Address"
import { Ownable } from "./Ownable"

export interface HardhatHelpers {
  address: Address
  ownable: Ownable
}
