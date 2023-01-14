import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { GlpUniVaultApproval } from "../generated/schema"
import { GlpUniVaultApproval as GlpUniVaultApprovalEvent } from "../generated/GlpUniVault/GlpUniVault"
import { handleGlpUniVaultApproval } from "../src/glp-uni-vault"
import { createGlpUniVaultApprovalEvent } from "./glp-uni-vault-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let owner = Address.fromString("0x0000000000000000000000000000000000000001")
    let spender = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let amount = BigInt.fromI32(234)
    let newGlpUniVaultApprovalEvent = createGlpUniVaultApprovalEvent(
      owner,
      spender,
      amount
    )
    handleGlpUniVaultApproval(newGlpUniVaultApprovalEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("GlpUniVaultApproval created and stored", () => {
    assert.entityCount("GlpUniVaultApproval", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "GlpUniVaultApproval",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "owner",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "GlpUniVaultApproval",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "spender",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "GlpUniVaultApproval",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
