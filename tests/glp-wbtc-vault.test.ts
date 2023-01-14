import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { GlpWbtcVaultApproval } from "../generated/schema"
import { GlpWbtcVaultApproval as GlpWbtcVaultApprovalEvent } from "../generated/GlpWbtcVault/GlpWbtcVault"
import { handleGlpWbtcVaultApproval } from "../src/glp-wbtc-vault"
import { createGlpWbtcVaultApprovalEvent } from "./glp-wbtc-vault-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let owner = Address.fromString("0x0000000000000000000000000000000000000001")
    let spender = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let amount = BigInt.fromI32(234)
    let newGlpWbtcVaultApprovalEvent = createGlpWbtcVaultApprovalEvent(
      owner,
      spender,
      amount
    )
    handleGlpWbtcVaultApproval(newGlpWbtcVaultApprovalEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("GlpWbtcVaultApproval created and stored", () => {
    assert.entityCount("GlpWbtcVaultApproval", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "GlpWbtcVaultApproval",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "owner",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "GlpWbtcVaultApproval",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "spender",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "GlpWbtcVaultApproval",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
