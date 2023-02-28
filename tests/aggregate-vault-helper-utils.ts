import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  CloseRebalance,
  CollectVaultFees,
  CompoundDistributeYield,
  Cycle,
  OpenRebalance,
  RebalanceGlpPosition,
  SettleNettedPositionPnl,
  UpdateNettingCheckpointPrice
} from "../generated/AggregateVaultHelper/AggregateVaultHelper"

export function createCloseRebalanceEvent(_timestamp: BigInt): CloseRebalance {
  let closeRebalanceEvent = changetype<CloseRebalance>(newMockEvent())

  closeRebalanceEvent.parameters = new Array()

  closeRebalanceEvent.parameters.push(
    new ethereum.EventParam(
      "_timestamp",
      ethereum.Value.fromUnsignedBigInt(_timestamp)
    )
  )

  return closeRebalanceEvent
}

export function createCollectVaultFeesEvent(
  totalVaultFee: BigInt,
  performanceFeeInAsset: BigInt,
  managementFeeInAsset: BigInt,
  slowReleaseMintAmount: BigInt,
  _assetVault: Address
): CollectVaultFees {
  let collectVaultFeesEvent = changetype<CollectVaultFees>(newMockEvent())

  collectVaultFeesEvent.parameters = new Array()

  collectVaultFeesEvent.parameters.push(
    new ethereum.EventParam(
      "totalVaultFee",
      ethereum.Value.fromUnsignedBigInt(totalVaultFee)
    )
  )
  collectVaultFeesEvent.parameters.push(
    new ethereum.EventParam(
      "performanceFeeInAsset",
      ethereum.Value.fromUnsignedBigInt(performanceFeeInAsset)
    )
  )
  collectVaultFeesEvent.parameters.push(
    new ethereum.EventParam(
      "managementFeeInAsset",
      ethereum.Value.fromUnsignedBigInt(managementFeeInAsset)
    )
  )
  collectVaultFeesEvent.parameters.push(
    new ethereum.EventParam(
      "slowReleaseMintAmount",
      ethereum.Value.fromUnsignedBigInt(slowReleaseMintAmount)
    )
  )
  collectVaultFeesEvent.parameters.push(
    new ethereum.EventParam(
      "_assetVault",
      ethereum.Value.fromAddress(_assetVault)
    )
  )

  return collectVaultFeesEvent
}

export function createCompoundDistributeYieldEvent(
  glpYieldPerVault: Array<BigInt>
): CompoundDistributeYield {
  let compoundDistributeYieldEvent = changetype<CompoundDistributeYield>(
    newMockEvent()
  )

  compoundDistributeYieldEvent.parameters = new Array()

  compoundDistributeYieldEvent.parameters.push(
    new ethereum.EventParam(
      "glpYieldPerVault",
      ethereum.Value.fromUnsignedBigIntArray(glpYieldPerVault)
    )
  )

  return compoundDistributeYieldEvent
}

export function createCycleEvent(timestamp: BigInt, round: BigInt): Cycle {
  let cycleEvent = changetype<Cycle>(newMockEvent())

  cycleEvent.parameters = new Array()

  cycleEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )
  cycleEvent.parameters.push(
    new ethereum.EventParam("round", ethereum.Value.fromUnsignedBigInt(round))
  )

  return cycleEvent
}

export function createOpenRebalanceEvent(
  timestamp: BigInt,
  nextVaultGlpAlloc: Array<BigInt>,
  nextGlpComp: Array<BigInt>,
  adjustedPositions: Array<BigInt>
): OpenRebalance {
  let openRebalanceEvent = changetype<OpenRebalance>(newMockEvent())

  openRebalanceEvent.parameters = new Array()

  openRebalanceEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )
  openRebalanceEvent.parameters.push(
    new ethereum.EventParam(
      "nextVaultGlpAlloc",
      ethereum.Value.fromUnsignedBigIntArray(nextVaultGlpAlloc)
    )
  )
  openRebalanceEvent.parameters.push(
    new ethereum.EventParam(
      "nextGlpComp",
      ethereum.Value.fromUnsignedBigIntArray(nextGlpComp)
    )
  )
  openRebalanceEvent.parameters.push(
    new ethereum.EventParam(
      "adjustedPositions",
      ethereum.Value.fromSignedBigIntArray(adjustedPositions)
    )
  )

  return openRebalanceEvent
}

export function createRebalanceGlpPositionEvent(
  vaultGlpAttributionBefore: Array<BigInt>,
  vaultGlpAttributionAfter: Array<BigInt>,
  targetGlpAllocation: Array<BigInt>,
  vaultGlpDeltaToExecute: Array<BigInt>,
  totalVaultGlpDelta: Array<BigInt>
): RebalanceGlpPosition {
  let rebalanceGlpPositionEvent = changetype<RebalanceGlpPosition>(
    newMockEvent()
  )

  rebalanceGlpPositionEvent.parameters = new Array()

  rebalanceGlpPositionEvent.parameters.push(
    new ethereum.EventParam(
      "vaultGlpAttributionBefore",
      ethereum.Value.fromUnsignedBigIntArray(vaultGlpAttributionBefore)
    )
  )
  rebalanceGlpPositionEvent.parameters.push(
    new ethereum.EventParam(
      "vaultGlpAttributionAfter",
      ethereum.Value.fromUnsignedBigIntArray(vaultGlpAttributionAfter)
    )
  )
  rebalanceGlpPositionEvent.parameters.push(
    new ethereum.EventParam(
      "targetGlpAllocation",
      ethereum.Value.fromUnsignedBigIntArray(targetGlpAllocation)
    )
  )
  rebalanceGlpPositionEvent.parameters.push(
    new ethereum.EventParam(
      "vaultGlpDeltaToExecute",
      ethereum.Value.fromSignedBigIntArray(vaultGlpDeltaToExecute)
    )
  )
  rebalanceGlpPositionEvent.parameters.push(
    new ethereum.EventParam(
      "totalVaultGlpDelta",
      ethereum.Value.fromSignedBigIntArray(totalVaultGlpDelta)
    )
  )

  return rebalanceGlpPositionEvent
}

export function createSettleNettedPositionPnlEvent(
  previousGlpAmount: Array<BigInt>,
  settledGlpAmount: Array<BigInt>,
  glpPnl: Array<BigInt>,
  dollarPnl: Array<BigInt>,
  percentPriceChange: Array<BigInt>
): SettleNettedPositionPnl {
  let settleNettedPositionPnlEvent = changetype<SettleNettedPositionPnl>(
    newMockEvent()
  )

  settleNettedPositionPnlEvent.parameters = new Array()

  settleNettedPositionPnlEvent.parameters.push(
    new ethereum.EventParam(
      "previousGlpAmount",
      ethereum.Value.fromUnsignedBigIntArray(previousGlpAmount)
    )
  )
  settleNettedPositionPnlEvent.parameters.push(
    new ethereum.EventParam(
      "settledGlpAmount",
      ethereum.Value.fromUnsignedBigIntArray(settledGlpAmount)
    )
  )
  settleNettedPositionPnlEvent.parameters.push(
    new ethereum.EventParam(
      "glpPnl",
      ethereum.Value.fromSignedBigIntArray(glpPnl)
    )
  )
  settleNettedPositionPnlEvent.parameters.push(
    new ethereum.EventParam(
      "dollarPnl",
      ethereum.Value.fromSignedBigIntArray(dollarPnl)
    )
  )
  settleNettedPositionPnlEvent.parameters.push(
    new ethereum.EventParam(
      "percentPriceChange",
      ethereum.Value.fromSignedBigIntArray(percentPriceChange)
    )
  )

  return settleNettedPositionPnlEvent
}

export function createUpdateNettingCheckpointPriceEvent(
  oldPrices: ethereum.Tuple,
  newPrices: ethereum.Tuple
): UpdateNettingCheckpointPrice {
  let updateNettingCheckpointPriceEvent = changetype<
    UpdateNettingCheckpointPrice
  >(newMockEvent())

  updateNettingCheckpointPriceEvent.parameters = new Array()

  updateNettingCheckpointPriceEvent.parameters.push(
    new ethereum.EventParam("oldPrices", ethereum.Value.fromTuple(oldPrices))
  )
  updateNettingCheckpointPriceEvent.parameters.push(
    new ethereum.EventParam("newPrices", ethereum.Value.fromTuple(newPrices))
  )

  return updateNettingCheckpointPriceEvent
}
