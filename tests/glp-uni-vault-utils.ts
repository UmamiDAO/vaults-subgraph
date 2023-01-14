import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  GlpUniVaultApproval,
  GlpUniVaultDeposit,
  GlpUniVaultPaused,
  GlpUniVaultRebalanceRequest,
  GlpUniVaultTransfer,
  GlpUniVaultUnpaused,
  GlpUniVaultWithdraw
} from "../generated/GlpUniVault/GlpUniVault"

export function createGlpUniVaultApprovalEvent(
  owner: Address,
  spender: Address,
  amount: BigInt
): GlpUniVaultApproval {
  let glpUniVaultApprovalEvent = changetype<GlpUniVaultApproval>(newMockEvent())

  glpUniVaultApprovalEvent.parameters = new Array()

  glpUniVaultApprovalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  glpUniVaultApprovalEvent.parameters.push(
    new ethereum.EventParam("spender", ethereum.Value.fromAddress(spender))
  )
  glpUniVaultApprovalEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return glpUniVaultApprovalEvent
}

export function createGlpUniVaultDepositEvent(
  caller: Address,
  owner: Address,
  assets: BigInt,
  shares: BigInt
): GlpUniVaultDeposit {
  let glpUniVaultDepositEvent = changetype<GlpUniVaultDeposit>(newMockEvent())

  glpUniVaultDepositEvent.parameters = new Array()

  glpUniVaultDepositEvent.parameters.push(
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller))
  )
  glpUniVaultDepositEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  glpUniVaultDepositEvent.parameters.push(
    new ethereum.EventParam("assets", ethereum.Value.fromUnsignedBigInt(assets))
  )
  glpUniVaultDepositEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return glpUniVaultDepositEvent
}

export function createGlpUniVaultPausedEvent(
  account: Address
): GlpUniVaultPaused {
  let glpUniVaultPausedEvent = changetype<GlpUniVaultPaused>(newMockEvent())

  glpUniVaultPausedEvent.parameters = new Array()

  glpUniVaultPausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return glpUniVaultPausedEvent
}

export function createGlpUniVaultRebalanceRequestEvent(
  vault: Address,
  sender: Address
): GlpUniVaultRebalanceRequest {
  let glpUniVaultRebalanceRequestEvent = changetype<
    GlpUniVaultRebalanceRequest
  >(newMockEvent())

  glpUniVaultRebalanceRequestEvent.parameters = new Array()

  glpUniVaultRebalanceRequestEvent.parameters.push(
    new ethereum.EventParam("vault", ethereum.Value.fromAddress(vault))
  )
  glpUniVaultRebalanceRequestEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return glpUniVaultRebalanceRequestEvent
}

export function createGlpUniVaultTransferEvent(
  from: Address,
  to: Address,
  amount: BigInt
): GlpUniVaultTransfer {
  let glpUniVaultTransferEvent = changetype<GlpUniVaultTransfer>(newMockEvent())

  glpUniVaultTransferEvent.parameters = new Array()

  glpUniVaultTransferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  glpUniVaultTransferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  glpUniVaultTransferEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return glpUniVaultTransferEvent
}

export function createGlpUniVaultUnpausedEvent(
  account: Address
): GlpUniVaultUnpaused {
  let glpUniVaultUnpausedEvent = changetype<GlpUniVaultUnpaused>(newMockEvent())

  glpUniVaultUnpausedEvent.parameters = new Array()

  glpUniVaultUnpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return glpUniVaultUnpausedEvent
}

export function createGlpUniVaultWithdrawEvent(
  caller: Address,
  receiver: Address,
  owner: Address,
  assets: BigInt,
  shares: BigInt
): GlpUniVaultWithdraw {
  let glpUniVaultWithdrawEvent = changetype<GlpUniVaultWithdraw>(newMockEvent())

  glpUniVaultWithdrawEvent.parameters = new Array()

  glpUniVaultWithdrawEvent.parameters.push(
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller))
  )
  glpUniVaultWithdrawEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  glpUniVaultWithdrawEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  glpUniVaultWithdrawEvent.parameters.push(
    new ethereum.EventParam("assets", ethereum.Value.fromUnsignedBigInt(assets))
  )
  glpUniVaultWithdrawEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return glpUniVaultWithdrawEvent
}
