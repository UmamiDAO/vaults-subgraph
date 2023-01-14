import {
  GlpWethVaultApproval as GlpWethVaultApprovalEvent,
  GlpWethVaultDeposit as GlpWethVaultDepositEvent,
  GlpWethVaultPaused as GlpWethVaultPausedEvent,
  GlpWethVaultRebalanceRequest as GlpWethVaultRebalanceRequestEvent,
  GlpWethVaultTransfer as GlpWethVaultTransferEvent,
  GlpWethVaultUnpaused as GlpWethVaultUnpausedEvent,
  GlpWethVaultWithdraw as GlpWethVaultWithdrawEvent
} from "../generated/GlpWethVault/GlpWethVault"
import {
  GlpWethVaultApproval,
  GlpWethVaultDeposit,
  GlpWethVaultPaused,
  GlpWethVaultRebalanceRequest,
  GlpWethVaultTransfer,
  GlpWethVaultUnpaused,
  GlpWethVaultWithdraw
} from "../generated/schema"

export function handleGlpWethVaultApproval(
  event: GlpWethVaultApprovalEvent
): void {
  let entity = new GlpWethVaultApproval(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.amount = event.params.amount
  entity.save()
}

export function handleGlpWethVaultDeposit(
  event: GlpWethVaultDepositEvent
): void {
  let entity = new GlpWethVaultDeposit(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.caller = event.params.caller
  entity.owner = event.params.owner
  entity.assets = event.params.assets
  entity.shares = event.params.shares
  entity.save()
}

export function handleGlpWethVaultPaused(event: GlpWethVaultPausedEvent): void {
  let entity = new GlpWethVaultPaused(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.account = event.params.account
  entity.save()
}

export function handleGlpWethVaultRebalanceRequest(
  event: GlpWethVaultRebalanceRequestEvent
): void {
  let entity = new GlpWethVaultRebalanceRequest(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.vault = event.params.vault
  entity.sender = event.params.sender
  entity.save()
}

export function handleGlpWethVaultTransfer(
  event: GlpWethVaultTransferEvent
): void {
  let entity = new GlpWethVaultTransfer(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.amount = event.params.amount
  entity.save()
}

export function handleGlpWethVaultUnpaused(
  event: GlpWethVaultUnpausedEvent
): void {
  let entity = new GlpWethVaultUnpaused(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.account = event.params.account
  entity.save()
}

export function handleGlpWethVaultWithdraw(
  event: GlpWethVaultWithdrawEvent
): void {
  let entity = new GlpWethVaultWithdraw(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.caller = event.params.caller
  entity.receiver = event.params.receiver
  entity.owner = event.params.owner
  entity.assets = event.params.assets
  entity.shares = event.params.shares
  entity.save()
}
