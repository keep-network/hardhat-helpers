import type { Address } from "./Address"
import type { Ownable } from "./Ownable"
import type { TestUtils } from "./TestUtils"

export interface HardhatHelpers {
  address: Address
  ownable: Ownable
  testUtils: TestUtils
}
