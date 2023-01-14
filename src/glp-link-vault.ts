import {
  GlpLinkVaultApproval as GlpLinkVaultApprovalEvent,
  GlpLinkVaultDeposit as GlpLinkVaultDepositEvent,
  GlpLinkVaultPaused as GlpLinkVaultPausedEvent,
  GlpLinkVaultRebalanceRequest as GlpLinkVaultRebalanceRequestEvent,
  GlpLinkVaultTransfer as GlpLinkVaultTransferEvent,
  GlpLinkVaultUnpaused as GlpLinkVaultUnpausedEvent,
  GlpLinkVaultWithdraw as GlpLinkVaultWithdrawEvent
} from "../generated/GlpLinkVault/GlpLinkVault"
import {
  GlpLinkVaultApproval,
  GlpLinkVaultDeposit,
  GlpLinkVaultPaused,
  GlpLinkVaultRebalanceRequest,
  GlpLinkVaultTransfer,
  GlpLinkVaultUnpaused,
  GlpLinkVaultWithdraw
} from "../generated/schema"

export function handleGlpLinkVaultApproval(
  event: GlpLinkVaultApprovalEvent
): void {
  let entity = new GlpLinkVaultApproval(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.amount = event.params.amount
  entity.save()
}

export function handleGlpLinkVaultDeposit(
  event: GlpLinkVaultDepositEvent
): void {
  let entity = new GlpLinkVaultDeposit(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.caller = event.params.caller
  entity.owner = event.params.owner
  entity.assets = event.params.assets
  entity.shares = event.params.shares
  entity.save()
}

export function handleGlpLinkVaultPaused(event: GlpLinkVaultPausedEvent): void {
  let entity = new GlpLinkVaultPaused(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.account = event.params.account
  entity.save()
}

export function handleGlpLinkVaultRebalanceRequest(
  event: GlpLinkVaultRebalanceRequestEvent
): void {
  let entity = new GlpLinkVaultRebalanceRequest(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.vault = event.params.vault
  entity.sender = event.params.sender
  entity.save()
}

export function handleGlpLinkVaultTransfer(
  event: GlpLinkVaultTransferEvent
): void {
  let entity = new GlpLinkVaultTransfer(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.amount = event.params.amount
  entity.save()
}

export function handleGlpLinkVaultUnpaused(
  event: GlpLinkVaultUnpausedEvent
): void {
  let entity = new GlpLinkVaultUnpaused(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.account = event.params.account
  entity.save()
}

export function handleGlpLinkVaultWithdraw(
  event: GlpLinkVaultWithdrawEvent
): void {
  let entity = new GlpLinkVaultWithdraw(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.caller = event.params.caller
  entity.receiver = event.params.receiver
  entity.owner = event.params.owner
  entity.assets = event.params.assets
  entity.shares = event.params.shares
  entity.save()
}
