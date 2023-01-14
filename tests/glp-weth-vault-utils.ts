import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  GlpWethVaultApproval,
  GlpWethVaultDeposit,
  GlpWethVaultPaused,
  GlpWethVaultRebalanceRequest,
  GlpWethVaultTransfer,
  GlpWethVaultUnpaused,
  GlpWethVaultWithdraw
} from "../generated/GlpWethVault/GlpWethVault"

export function createGlpWethVaultApprovalEvent(
  owner: Address,
  spender: Address,
  amount: BigInt
): GlpWethVaultApproval {
  let glpWethVaultApprovalEvent = changetype<GlpWethVaultApproval>(
    newMockEvent()
  )

  glpWethVaultApprovalEvent.parameters = new Array()

  glpWethVaultApprovalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  glpWethVaultApprovalEvent.parameters.push(
    new ethereum.EventParam("spender", ethereum.Value.fromAddress(spender))
  )
  glpWethVaultApprovalEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return glpWethVaultApprovalEvent
}

export function createGlpWethVaultDepositEvent(
  caller: Address,
  owner: Address,
  assets: BigInt,
  shares: BigInt
): GlpWethVaultDeposit {
  let glpWethVaultDepositEvent = changetype<GlpWethVaultDeposit>(newMockEvent())

  glpWethVaultDepositEvent.parameters = new Array()

  glpWethVaultDepositEvent.parameters.push(
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller))
  )
  glpWethVaultDepositEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  glpWethVaultDepositEvent.parameters.push(
    new ethereum.EventParam("assets", ethereum.Value.fromUnsignedBigInt(assets))
  )
  glpWethVaultDepositEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return glpWethVaultDepositEvent
}

export function createGlpWethVaultPausedEvent(
  account: Address
): GlpWethVaultPaused {
  let glpWethVaultPausedEvent = changetype<GlpWethVaultPaused>(newMockEvent())

  glpWethVaultPausedEvent.parameters = new Array()

  glpWethVaultPausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return glpWethVaultPausedEvent
}

export function createGlpWethVaultRebalanceRequestEvent(
  vault: Address,
  sender: Address
): GlpWethVaultRebalanceRequest {
  let glpWethVaultRebalanceRequestEvent = changetype<
    GlpWethVaultRebalanceRequest
  >(newMockEvent())

  glpWethVaultRebalanceRequestEvent.parameters = new Array()

  glpWethVaultRebalanceRequestEvent.parameters.push(
    new ethereum.EventParam("vault", ethereum.Value.fromAddress(vault))
  )
  glpWethVaultRebalanceRequestEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return glpWethVaultRebalanceRequestEvent
}

export function createGlpWethVaultTransferEvent(
  from: Address,
  to: Address,
  amount: BigInt
): GlpWethVaultTransfer {
  let glpWethVaultTransferEvent = changetype<GlpWethVaultTransfer>(
    newMockEvent()
  )

  glpWethVaultTransferEvent.parameters = new Array()

  glpWethVaultTransferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  glpWethVaultTransferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  glpWethVaultTransferEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return glpWethVaultTransferEvent
}

export function createGlpWethVaultUnpausedEvent(
  account: Address
): GlpWethVaultUnpaused {
  let glpWethVaultUnpausedEvent = changetype<GlpWethVaultUnpaused>(
    newMockEvent()
  )

  glpWethVaultUnpausedEvent.parameters = new Array()

  glpWethVaultUnpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return glpWethVaultUnpausedEvent
}

export function createGlpWethVaultWithdrawEvent(
  caller: Address,
  receiver: Address,
  owner: Address,
  assets: BigInt,
  shares: BigInt
): GlpWethVaultWithdraw {
  let glpWethVaultWithdrawEvent = changetype<GlpWethVaultWithdraw>(
    newMockEvent()
  )

  glpWethVaultWithdrawEvent.parameters = new Array()

  glpWethVaultWithdrawEvent.parameters.push(
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller))
  )
  glpWethVaultWithdrawEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  glpWethVaultWithdrawEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  glpWethVaultWithdrawEvent.parameters.push(
    new ethereum.EventParam("assets", ethereum.Value.fromUnsignedBigInt(assets))
  )
  glpWethVaultWithdrawEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return glpWethVaultWithdrawEvent
}
