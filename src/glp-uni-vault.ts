import {
  GlpUniVaultApproval as GlpUniVaultApprovalEvent,
  GlpUniVaultDeposit as GlpUniVaultDepositEvent,
  GlpUniVaultPaused as GlpUniVaultPausedEvent,
  GlpUniVaultRebalanceRequest as GlpUniVaultRebalanceRequestEvent,
  GlpUniVaultTransfer as GlpUniVaultTransferEvent,
  GlpUniVaultUnpaused as GlpUniVaultUnpausedEvent,
  GlpUniVaultWithdraw as GlpUniVaultWithdrawEvent
} from "../generated/GlpUniVault/GlpUniVault"
import {
  GlpUniVaultApproval,
  GlpUniVaultDeposit,
  GlpUniVaultPaused,
  GlpUniVaultRebalanceRequest,
  GlpUniVaultTransfer,
  GlpUniVaultUnpaused,
  GlpUniVaultWithdraw
} from "../generated/schema"

export function handleGlpUniVaultApproval(
  event: GlpUniVaultApprovalEvent
): void {
  let entity = new GlpUniVaultApproval(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.amount = event.params.amount
  entity.save()
}

export function handleGlpUniVaultDeposit(event: GlpUniVaultDepositEvent): void {
  let entity = new GlpUniVaultDeposit(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.caller = event.params.caller
  entity.owner = event.params.owner
  entity.assets = event.params.assets
  entity.shares = event.params.shares
  entity.save()
}

export function handleGlpUniVaultPaused(event: GlpUniVaultPausedEvent): void {
  let entity = new GlpUniVaultPaused(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.account = event.params.account
  entity.save()
}

export function handleGlpUniVaultRebalanceRequest(
  event: GlpUniVaultRebalanceRequestEvent
): void {
  let entity = new GlpUniVaultRebalanceRequest(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.vault = event.params.vault
  entity.sender = event.params.sender
  entity.save()
}

export function handleGlpUniVaultTransfer(
  event: GlpUniVaultTransferEvent
): void {
  let entity = new GlpUniVaultTransfer(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.amount = event.params.amount
  entity.save()
}

export function handleGlpUniVaultUnpaused(
  event: GlpUniVaultUnpausedEvent
): void {
  let entity = new GlpUniVaultUnpaused(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.account = event.params.account
  entity.save()
}

export function handleGlpUniVaultWithdraw(
  event: GlpUniVaultWithdrawEvent
): void {
  let entity = new GlpUniVaultWithdraw(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.caller = event.params.caller
  entity.receiver = event.params.receiver
  entity.owner = event.params.owner
  entity.assets = event.params.assets
  entity.shares = event.params.shares
  entity.save()
}
