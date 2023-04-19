import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { CloseRebalance } from "../generated/schema"
import { CloseRebalance as CloseRebalanceEvent } from "../generated/AggregateVaultHelper/AggregateVaultHelper"
import { handleCloseRebalance } from "../src/aggregate-vault-helper"
import { createCloseRebalanceEvent } from "./aggregate-vault-helper-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let _timestamp = BigInt.fromI32(234)
    let newCloseRebalanceEvent = createCloseRebalanceEvent(_timestamp)
    handleCloseRebalance(newCloseRebalanceEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("CloseRebalance created and stored", () => {
    assert.entityCount("CloseRebalance", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "CloseRebalance",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "_timestamp",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
