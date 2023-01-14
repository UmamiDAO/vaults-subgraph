import {
  GlpWbtcVaultApproval as GlpWbtcVaultApprovalEvent,
  GlpWbtcVaultDeposit as GlpWbtcVaultDepositEvent,
  GlpWbtcVaultPaused as GlpWbtcVaultPausedEvent,
  GlpWbtcVaultRebalanceRequest as GlpWbtcVaultRebalanceRequestEvent,
  GlpWbtcVaultTransfer as GlpWbtcVaultTransferEvent,
  GlpWbtcVaultUnpaused as GlpWbtcVaultUnpausedEvent,
  GlpWbtcVaultWithdraw as GlpWbtcVaultWithdrawEvent
} from "../generated/GlpWbtcVault/GlpWbtcVault"
import {
  GlpWbtcVaultApproval,
  GlpWbtcVaultDeposit,
  GlpWbtcVaultPaused,
  GlpWbtcVaultRebalanceRequest,
  GlpWbtcVaultTransfer,
  GlpWbtcVaultUnpaused,
  GlpWbtcVaultWithdraw
} from "../generated/schema"

export function handleGlpWbtcVaultApproval(
  event: GlpWbtcVaultApprovalEvent
): void {
  let entity = new GlpWbtcVaultApproval(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.amount = event.params.amount
  entity.save()
}

export function handleGlpWbtcVaultDeposit(
  event: GlpWbtcVaultDepositEvent
): void {
  let entity = new GlpWbtcVaultDeposit(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.caller = event.params.caller
  entity.owner = event.params.owner
  entity.assets = event.params.assets
  entity.shares = event.params.shares
  entity.save()
}

export function handleGlpWbtcVaultPaused(event: GlpWbtcVaultPausedEvent): void {
  let entity = new GlpWbtcVaultPaused(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.account = event.params.account
  entity.save()
}

export function handleGlpWbtcVaultRebalanceRequest(
  event: GlpWbtcVaultRebalanceRequestEvent
): void {
  let entity = new GlpWbtcVaultRebalanceRequest(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.vault = event.params.vault
  entity.sender = event.params.sender
  entity.save()
}

export function handleGlpWbtcVaultTransfer(
  event: GlpWbtcVaultTransferEvent
): void {
  let entity = new GlpWbtcVaultTransfer(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.amount = event.params.amount
  entity.save()
}

export function handleGlpWbtcVaultUnpaused(
  event: GlpWbtcVaultUnpausedEvent
): void {
  let entity = new GlpWbtcVaultUnpaused(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.account = event.params.account
  entity.save()
}

export function handleGlpWbtcVaultWithdraw(
  event: GlpWbtcVaultWithdrawEvent
): void {
  let entity = new GlpWbtcVaultWithdraw(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.caller = event.params.caller
  entity.receiver = event.params.receiver
  entity.owner = event.params.owner
  entity.assets = event.params.assets
  entity.shares = event.params.shares
  entity.save()
}
