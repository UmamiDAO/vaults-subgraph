import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { GlpLinkVaultApproval } from "../generated/schema"
import { GlpLinkVaultApproval as GlpLinkVaultApprovalEvent } from "../generated/GlpLinkVault/GlpLinkVault"
import { handleGlpLinkVaultApproval } from "../src/glp-link-vault"
import { createGlpLinkVaultApprovalEvent } from "./glp-link-vault-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let owner = Address.fromString("0x0000000000000000000000000000000000000001")
    let spender = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let amount = BigInt.fromI32(234)
    let newGlpLinkVaultApprovalEvent = createGlpLinkVaultApprovalEvent(
      owner,
      spender,
      amount
    )
    handleGlpLinkVaultApproval(newGlpLinkVaultApprovalEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("GlpLinkVaultApproval created and stored", () => {
    assert.entityCount("GlpLinkVaultApproval", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "GlpLinkVaultApproval",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "owner",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "GlpLinkVaultApproval",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "spender",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "GlpLinkVaultApproval",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
