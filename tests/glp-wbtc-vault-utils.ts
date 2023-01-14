import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  GlpWbtcVaultApproval,
  GlpWbtcVaultDeposit,
  GlpWbtcVaultPaused,
  GlpWbtcVaultRebalanceRequest,
  GlpWbtcVaultTransfer,
  GlpWbtcVaultUnpaused,
  GlpWbtcVaultWithdraw
} from "../generated/GlpWbtcVault/GlpWbtcVault"

export function createGlpWbtcVaultApprovalEvent(
  owner: Address,
  spender: Address,
  amount: BigInt
): GlpWbtcVaultApproval {
  let glpWbtcVaultApprovalEvent = changetype<GlpWbtcVaultApproval>(
    newMockEvent()
  )

  glpWbtcVaultApprovalEvent.parameters = new Array()

  glpWbtcVaultApprovalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  glpWbtcVaultApprovalEvent.parameters.push(
    new ethereum.EventParam("spender", ethereum.Value.fromAddress(spender))
  )
  glpWbtcVaultApprovalEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return glpWbtcVaultApprovalEvent
}

export function createGlpWbtcVaultDepositEvent(
  caller: Address,
  owner: Address,
  assets: BigInt,
  shares: BigInt
): GlpWbtcVaultDeposit {
  let glpWbtcVaultDepositEvent = changetype<GlpWbtcVaultDeposit>(newMockEvent())

  glpWbtcVaultDepositEvent.parameters = new Array()

  glpWbtcVaultDepositEvent.parameters.push(
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller))
  )
  glpWbtcVaultDepositEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  glpWbtcVaultDepositEvent.parameters.push(
    new ethereum.EventParam("assets", ethereum.Value.fromUnsignedBigInt(assets))
  )
  glpWbtcVaultDepositEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return glpWbtcVaultDepositEvent
}

export function createGlpWbtcVaultPausedEvent(
  account: Address
): GlpWbtcVaultPaused {
  let glpWbtcVaultPausedEvent = changetype<GlpWbtcVaultPaused>(newMockEvent())

  glpWbtcVaultPausedEvent.parameters = new Array()

  glpWbtcVaultPausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return glpWbtcVaultPausedEvent
}

export function createGlpWbtcVaultRebalanceRequestEvent(
  vault: Address,
  sender: Address
): GlpWbtcVaultRebalanceRequest {
  let glpWbtcVaultRebalanceRequestEvent = changetype<
    GlpWbtcVaultRebalanceRequest
  >(newMockEvent())

  glpWbtcVaultRebalanceRequestEvent.parameters = new Array()

  glpWbtcVaultRebalanceRequestEvent.parameters.push(
    new ethereum.EventParam("vault", ethereum.Value.fromAddress(vault))
  )
  glpWbtcVaultRebalanceRequestEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return glpWbtcVaultRebalanceRequestEvent
}

export function createGlpWbtcVaultTransferEvent(
  from: Address,
  to: Address,
  amount: BigInt
): GlpWbtcVaultTransfer {
  let glpWbtcVaultTransferEvent = changetype<GlpWbtcVaultTransfer>(
    newMockEvent()
  )

  glpWbtcVaultTransferEvent.parameters = new Array()

  glpWbtcVaultTransferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  glpWbtcVaultTransferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  glpWbtcVaultTransferEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return glpWbtcVaultTransferEvent
}

export function createGlpWbtcVaultUnpausedEvent(
  account: Address
): GlpWbtcVaultUnpaused {
  let glpWbtcVaultUnpausedEvent = changetype<GlpWbtcVaultUnpaused>(
    newMockEvent()
  )

  glpWbtcVaultUnpausedEvent.parameters = new Array()

  glpWbtcVaultUnpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return glpWbtcVaultUnpausedEvent
}

export function createGlpWbtcVaultWithdrawEvent(
  caller: Address,
  receiver: Address,
  owner: Address,
  assets: BigInt,
  shares: BigInt
): GlpWbtcVaultWithdraw {
  let glpWbtcVaultWithdrawEvent = changetype<GlpWbtcVaultWithdraw>(
    newMockEvent()
  )

  glpWbtcVaultWithdrawEvent.parameters = new Array()

  glpWbtcVaultWithdrawEvent.parameters.push(
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller))
  )
  glpWbtcVaultWithdrawEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  glpWbtcVaultWithdrawEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  glpWbtcVaultWithdrawEvent.parameters.push(
    new ethereum.EventParam("assets", ethereum.Value.fromUnsignedBigInt(assets))
  )
  glpWbtcVaultWithdrawEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return glpWbtcVaultWithdrawEvent
}
