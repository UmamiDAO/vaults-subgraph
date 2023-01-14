import {
  Approval as ApprovalEvent,
  Deposit as DepositEvent,
  GlpUsdcVaultPaused as GlpUsdcVaultPausedEvent,
  RebalanceRequest as RebalanceRequestEvent,
  Transfer as TransferEvent,
  GlpUsdcVaultUnpaused as GlpUsdcVaultUnpausedEvent,
  Withdraw as WithdrawEvent
} from "../generated/GlpUsdcVault/GlpUsdcVault"
import {
  Approval,
  Deposit,
  GlpUsdcVaultPaused,
  RebalanceRequest,
  Transfer,
  GlpUsdcVaultUnpaused,
  Withdraw
} from "../generated/schema"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.amount = event.params.amount
  entity.save()
}

export function handleDeposit(event: DepositEvent): void {
  let entity = new Deposit(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.caller = event.params.caller
  entity.owner = event.params.owner
  entity.assets = event.params.assets
  entity.shares = event.params.shares
  entity.save()
}

export function handleGlpUsdcVaultPaused(event: GlpUsdcVaultPausedEvent): void {
  let entity = new GlpUsdcVaultPaused(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.account = event.params.account
  entity.save()
}

export function handleRebalanceRequest(event: RebalanceRequestEvent): void {
  let entity = new RebalanceRequest(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.vault = event.params.vault
  entity.sender = event.params.sender
  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.amount = event.params.amount
  entity.save()
}

export function handleGlpUsdcVaultUnpaused(
  event: GlpUsdcVaultUnpausedEvent
): void {
  let entity = new GlpUsdcVaultUnpaused(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.account = event.params.account
  entity.save()
}

export function handleWithdraw(event: WithdrawEvent): void {
  let entity = new Withdraw(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.caller = event.params.caller
  entity.receiver = event.params.receiver
  entity.owner = event.params.owner
  entity.assets = event.params.assets
  entity.shares = event.params.shares
  entity.save()
}
