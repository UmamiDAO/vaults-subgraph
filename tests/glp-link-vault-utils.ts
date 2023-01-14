import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  GlpLinkVaultApproval,
  GlpLinkVaultDeposit,
  GlpLinkVaultPaused,
  GlpLinkVaultRebalanceRequest,
  GlpLinkVaultTransfer,
  GlpLinkVaultUnpaused,
  GlpLinkVaultWithdraw
} from "../generated/GlpLinkVault/GlpLinkVault"

export function createGlpLinkVaultApprovalEvent(
  owner: Address,
  spender: Address,
  amount: BigInt
): GlpLinkVaultApproval {
  let glpLinkVaultApprovalEvent = changetype<GlpLinkVaultApproval>(
    newMockEvent()
  )

  glpLinkVaultApprovalEvent.parameters = new Array()

  glpLinkVaultApprovalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  glpLinkVaultApprovalEvent.parameters.push(
    new ethereum.EventParam("spender", ethereum.Value.fromAddress(spender))
  )
  glpLinkVaultApprovalEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return glpLinkVaultApprovalEvent
}

export function createGlpLinkVaultDepositEvent(
  caller: Address,
  owner: Address,
  assets: BigInt,
  shares: BigInt
): GlpLinkVaultDeposit {
  let glpLinkVaultDepositEvent = changetype<GlpLinkVaultDeposit>(newMockEvent())

  glpLinkVaultDepositEvent.parameters = new Array()

  glpLinkVaultDepositEvent.parameters.push(
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller))
  )
  glpLinkVaultDepositEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  glpLinkVaultDepositEvent.parameters.push(
    new ethereum.EventParam("assets", ethereum.Value.fromUnsignedBigInt(assets))
  )
  glpLinkVaultDepositEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return glpLinkVaultDepositEvent
}

export function createGlpLinkVaultPausedEvent(
  account: Address
): GlpLinkVaultPaused {
  let glpLinkVaultPausedEvent = changetype<GlpLinkVaultPaused>(newMockEvent())

  glpLinkVaultPausedEvent.parameters = new Array()

  glpLinkVaultPausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return glpLinkVaultPausedEvent
}

export function createGlpLinkVaultRebalanceRequestEvent(
  vault: Address,
  sender: Address
): GlpLinkVaultRebalanceRequest {
  let glpLinkVaultRebalanceRequestEvent = changetype<
    GlpLinkVaultRebalanceRequest
  >(newMockEvent())

  glpLinkVaultRebalanceRequestEvent.parameters = new Array()

  glpLinkVaultRebalanceRequestEvent.parameters.push(
    new ethereum.EventParam("vault", ethereum.Value.fromAddress(vault))
  )
  glpLinkVaultRebalanceRequestEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return glpLinkVaultRebalanceRequestEvent
}

export function createGlpLinkVaultTransferEvent(
  from: Address,
  to: Address,
  amount: BigInt
): GlpLinkVaultTransfer {
  let glpLinkVaultTransferEvent = changetype<GlpLinkVaultTransfer>(
    newMockEvent()
  )

  glpLinkVaultTransferEvent.parameters = new Array()

  glpLinkVaultTransferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  glpLinkVaultTransferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  glpLinkVaultTransferEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return glpLinkVaultTransferEvent
}

export function createGlpLinkVaultUnpausedEvent(
  account: Address
): GlpLinkVaultUnpaused {
  let glpLinkVaultUnpausedEvent = changetype<GlpLinkVaultUnpaused>(
    newMockEvent()
  )

  glpLinkVaultUnpausedEvent.parameters = new Array()

  glpLinkVaultUnpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return glpLinkVaultUnpausedEvent
}

export function createGlpLinkVaultWithdrawEvent(
  caller: Address,
  receiver: Address,
  owner: Address,
  assets: BigInt,
  shares: BigInt
): GlpLinkVaultWithdraw {
  let glpLinkVaultWithdrawEvent = changetype<GlpLinkVaultWithdraw>(
    newMockEvent()
  )

  glpLinkVaultWithdrawEvent.parameters = new Array()

  glpLinkVaultWithdrawEvent.parameters.push(
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller))
  )
  glpLinkVaultWithdrawEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  glpLinkVaultWithdrawEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  glpLinkVaultWithdrawEvent.parameters.push(
    new ethereum.EventParam("assets", ethereum.Value.fromUnsignedBigInt(assets))
  )
  glpLinkVaultWithdrawEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return glpLinkVaultWithdrawEvent
}
