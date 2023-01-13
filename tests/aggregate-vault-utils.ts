import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  CallbackHandlerUpdated,
  CloseRebalance,
  CollectVaultFees,
  Cycle,
  DefaultHandlerContractUpdated,
  HandlerContractUpdated,
  OpenRebalance,
  Paused,
  SwapHandlerUpdated,
  Unpaused
} from "../generated/AggregateVault/AggregateVault"

export function createCallbackHandlerUpdatedEvent(
  _sig: Bytes,
  _handler: Address,
  _enabled: boolean
): CallbackHandlerUpdated {
  let callbackHandlerUpdatedEvent = changetype<CallbackHandlerUpdated>(
    newMockEvent()
  )

  callbackHandlerUpdatedEvent.parameters = new Array()

  callbackHandlerUpdatedEvent.parameters.push(
    new ethereum.EventParam("_sig", ethereum.Value.fromFixedBytes(_sig))
  )
  callbackHandlerUpdatedEvent.parameters.push(
    new ethereum.EventParam("_handler", ethereum.Value.fromAddress(_handler))
  )
  callbackHandlerUpdatedEvent.parameters.push(
    new ethereum.EventParam("_enabled", ethereum.Value.fromBoolean(_enabled))
  )

  return callbackHandlerUpdatedEvent
}

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
      "_assetVault",
      ethereum.Value.fromAddress(_assetVault)
    )
  )

  return collectVaultFeesEvent
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

export function createDefaultHandlerContractUpdatedEvent(
  _sig: Bytes,
  _handler: Address
): DefaultHandlerContractUpdated {
  let defaultHandlerContractUpdatedEvent = changetype<
    DefaultHandlerContractUpdated
  >(newMockEvent())

  defaultHandlerContractUpdatedEvent.parameters = new Array()

  defaultHandlerContractUpdatedEvent.parameters.push(
    new ethereum.EventParam("_sig", ethereum.Value.fromFixedBytes(_sig))
  )
  defaultHandlerContractUpdatedEvent.parameters.push(
    new ethereum.EventParam("_handler", ethereum.Value.fromAddress(_handler))
  )

  return defaultHandlerContractUpdatedEvent
}

export function createHandlerContractUpdatedEvent(
  _contract: Address,
  _enabled: boolean
): HandlerContractUpdated {
  let handlerContractUpdatedEvent = changetype<HandlerContractUpdated>(
    newMockEvent()
  )

  handlerContractUpdatedEvent.parameters = new Array()

  handlerContractUpdatedEvent.parameters.push(
    new ethereum.EventParam("_contract", ethereum.Value.fromAddress(_contract))
  )
  handlerContractUpdatedEvent.parameters.push(
    new ethereum.EventParam("_enabled", ethereum.Value.fromBoolean(_enabled))
  )

  return handlerContractUpdatedEvent
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

export function createPausedEvent(account: Address): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent())

  pausedEvent.parameters = new Array()

  pausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return pausedEvent
}

export function createSwapHandlerUpdatedEvent(
  _handled: Address,
  _enabled: boolean
): SwapHandlerUpdated {
  let swapHandlerUpdatedEvent = changetype<SwapHandlerUpdated>(newMockEvent())

  swapHandlerUpdatedEvent.parameters = new Array()

  swapHandlerUpdatedEvent.parameters.push(
    new ethereum.EventParam("_handled", ethereum.Value.fromAddress(_handled))
  )
  swapHandlerUpdatedEvent.parameters.push(
    new ethereum.EventParam("_enabled", ethereum.Value.fromBoolean(_enabled))
  )

  return swapHandlerUpdatedEvent
}

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return unpausedEvent
}
