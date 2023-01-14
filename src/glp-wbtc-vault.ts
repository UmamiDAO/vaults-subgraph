import { BigInt } from "@graphprotocol/graph-ts";
import {
  GlpWbtcVaultDeposit as GlpWbtcVaultDepositEvent,
  GlpWbtcVaultRebalanceRequest as GlpWbtcVaultRebalanceRequestEvent,
  GlpWbtcVaultTransfer as GlpWbtcVaultTransferEvent,
  GlpWbtcVaultWithdraw as GlpWbtcVaultWithdrawEvent,
} from "../generated/GlpWbtcVault/GlpWbtcVault";
import { UserVaultBalance, UserVaultBalanceTotal } from "../generated/schema";
import { WBTC_VAULT_ADDRESS, ZERO_ADDRESS } from "./constants";

export function handleGlpWbtcVaultTransfer(
  event: GlpWbtcVaultTransferEvent
): void {
  const amount = event.params.amount;

  const from = event.params.from.toHexString();
  const to = event.params.to.toHexString();

  // Any event not listed below is considered a transfer
  let balanceEvent = "wbtc-vault-transfer";
  // User deposited into the vault
  if (from == ZERO_ADDRESS) {
    balanceEvent = "wbtc-vault-deposit";
  }
  // User withdrew into the vault
  if (to == ZERO_ADDRESS) {
    balanceEvent = "wbtc-vault-withdraw";
  }

  // ZERO_ADDRESS = deposit event, don't register ZERO_ADDRESS's balance
  if (from != ZERO_ADDRESS) {
    const idFromTotal = `totalVault:wbtc:${from}`;
    let fromTotal = UserVaultBalanceTotal.load(idFromTotal);
    if (fromTotal == null) {
      fromTotal = new UserVaultBalanceTotal(idFromTotal);
      fromTotal.usdc = BigInt.zero();
      fromTotal.weth = BigInt.zero();
      fromTotal.wbtc = amount;
      fromTotal.uni = BigInt.zero();
      fromTotal.link = BigInt.zero();
    } else {
      fromTotal.wbtc = fromTotal.wbtc.minus(amount);
    }
    fromTotal.save();

    const fromHistoricalBalance = new UserVaultBalance(
      `${event.block.number}:wbtc:${from}`
    );
    fromHistoricalBalance.block = event.block.number;
    fromHistoricalBalance.timestamp = event.block.timestamp;
    fromHistoricalBalance.txHash = event.transaction.hash.toHex();
    fromHistoricalBalance.vault = WBTC_VAULT_ADDRESS.toString();
    fromHistoricalBalance.user = from;
    fromHistoricalBalance.value = fromTotal.wbtc;
    fromHistoricalBalance.event = balanceEvent;

    fromHistoricalBalance.save();
  }

  // ZERO_ADDRESS = withdraw event, don't register ZERO_ADDRESS's balance
  if (to != ZERO_ADDRESS) {
    const idToTotal = `totalVault:wbtc:${to}`;
    let toTotal = UserVaultBalanceTotal.load(idToTotal);
    if (toTotal == null) {
      toTotal = new UserVaultBalanceTotal(idToTotal);
      toTotal.usdc = BigInt.zero();
      toTotal.weth = BigInt.zero();
      toTotal.wbtc = amount;
      toTotal.uni = BigInt.zero();
      toTotal.link = BigInt.zero();
    } else {
      toTotal.wbtc = toTotal.wbtc.plus(amount);
    }
    toTotal.save();

    const toHistoricalBalance = new UserVaultBalance(
      `${event.block.number}:wbtc:${to}`
    );
    toHistoricalBalance.block = event.block.number;
    toHistoricalBalance.timestamp = event.block.timestamp;
    toHistoricalBalance.txHash = event.transaction.hash.toHex();
    toHistoricalBalance.vault = WBTC_VAULT_ADDRESS.toString();
    toHistoricalBalance.user = to;
    toHistoricalBalance.value = toTotal.wbtc;
    toHistoricalBalance.event = balanceEvent;

    toHistoricalBalance.save();
  }
}

export function handleGlpWbtcVaultRebalanceRequest(
  event: GlpWbtcVaultRebalanceRequestEvent
): void {}

export function handleGlpWbtcVaultDeposit(
  event: GlpWbtcVaultDepositEvent
): void {}

export function handleGlpWbtcVaultWithdraw(
  event: GlpWbtcVaultWithdrawEvent
): void {}
