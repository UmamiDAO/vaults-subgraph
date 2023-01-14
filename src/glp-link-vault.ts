import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import {
  GlpLinkVaultDeposit as GlpLinkVaultDepositEvent,
  GlpLinkVaultRebalanceRequest as GlpLinkVaultRebalanceRequestEvent,
  GlpLinkVaultTransfer as GlpLinkVaultTransferEvent,
  GlpLinkVaultWithdraw as GlpLinkVaultWithdrawEvent,
} from "../generated/GlpLinkVault/GlpLinkVault";
import { UserVaultBalance, UserVaultBalanceTotal } from "../generated/schema";
import { LINK_VAULT_ADDRESS, ZERO_ADDRESS } from "./constants";

export function handleGlpLinkVaultTransfer(
  event: GlpLinkVaultTransferEvent
): void {
  const amount = event.params.amount;

  const from = event.params.from.toHexString();
  const to = event.params.to.toHexString();

  // Any event not listed below is considered a transfer
  let balanceEvent = "link-vault-transfer";
  // User deposited into the vault
  if (from == ZERO_ADDRESS) {
    balanceEvent = "link-vault-deposit";
  }
  // User withdrew into the vault
  if (to == ZERO_ADDRESS) {
    balanceEvent = "link-vault-withdraw";
  }

  // ZERO_ADDRESS = deposit event, don't register ZERO_ADDRESS's balance
  if (from != ZERO_ADDRESS) {
    const idFromTotal = `totalVault:link:${from}`;
    let fromTotal = UserVaultBalanceTotal.load(idFromTotal);
    if (fromTotal == null) {
      fromTotal = new UserVaultBalanceTotal(idFromTotal);
      fromTotal.usdc = BigInt.zero();
      fromTotal.weth = BigInt.zero();
      fromTotal.wbtc = BigInt.zero();
      fromTotal.uni = BigInt.zero();
      fromTotal.link = amount;
    } else {
      fromTotal.link = fromTotal.link.minus(amount);
    }
    fromTotal.save();

    const fromHistoricalBalance = new UserVaultBalance(
      `${event.block.number}:link:${from}`
    );
    fromHistoricalBalance.block = event.block.number;
    fromHistoricalBalance.timestamp = event.block.timestamp;
    fromHistoricalBalance.txHash = event.transaction.hash.toHex();
    fromHistoricalBalance.vault = LINK_VAULT_ADDRESS.toString();
    fromHistoricalBalance.user = from;
    fromHistoricalBalance.value = fromTotal.link;
    fromHistoricalBalance.event = balanceEvent;

    fromHistoricalBalance.save();
  }

  // ZERO_ADDRESS = withdraw event, don't register ZERO_ADDRESS's balance
  if (to != ZERO_ADDRESS) {
    const idToTotal = `totalVault:link:${to}`;
    let toTotal = UserVaultBalanceTotal.load(idToTotal);
    if (toTotal == null) {
      toTotal = new UserVaultBalanceTotal(idToTotal);
      toTotal.usdc = BigInt.zero();
      toTotal.weth = BigInt.zero();
      toTotal.wbtc = BigInt.zero();
      toTotal.uni = BigInt.zero();
      toTotal.link = amount;
    } else {
      toTotal.link = toTotal.link.plus(amount);
    }
    toTotal.save();

    const toHistoricalBalance = new UserVaultBalance(
      `${event.block.number}:link:${to}`
    );
    toHistoricalBalance.block = event.block.number;
    toHistoricalBalance.timestamp = event.block.timestamp;
    toHistoricalBalance.txHash = event.transaction.hash.toHex();
    toHistoricalBalance.vault = LINK_VAULT_ADDRESS.toString();
    toHistoricalBalance.user = to;
    toHistoricalBalance.value = toTotal.link;
    toHistoricalBalance.event = balanceEvent;

    toHistoricalBalance.save();
  }
}

export function handleGlpLinkVaultDeposit(
  event: GlpLinkVaultDepositEvent
): void {}

export function handleGlpLinkVaultWithdraw(
  event: GlpLinkVaultWithdrawEvent
): void {}

export function handleGlpLinkVaultRebalanceRequest(
  event: GlpLinkVaultRebalanceRequestEvent
): void {}
