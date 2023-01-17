import { BigInt } from "@graphprotocol/graph-ts";
import {
  Deposit as GlpUsdcDepositEvent,
  RebalanceRequest as GlpUsdcRebalanceRequestEvent,
  Transfer as GlpUsdcTransferEvent,
  Withdraw as GlpUsdcWithdrawEvent,
} from "../generated/GlpUsdcVault/GlpUsdcVault";
import { UserVaultBalance, UserVaultBalanceTotal } from "../generated/schema";
import { USDC_VAULT_ADDRESS, ZERO_ADDRESS } from "./constants";

export function handleTransfer(event: GlpUsdcTransferEvent): void {
  const amount = event.params.amount;

  const from = event.params.from.toHexString();
  const to = event.params.to.toHexString();

  // Any event not listed below is considered a transfer
  let balanceEvent = "usdc-vault-transfer";
  // User deposited into the vault
  if (from == ZERO_ADDRESS) {
    balanceEvent = "usdc-vault-deposit";
  }
  // User withdrew into the vault
  if (to == ZERO_ADDRESS) {
    balanceEvent = "usdc-vault-withdraw";
  }

  // ZERO_ADDRESS = deposit event, don't register ZERO_ADDRESS's balance
  if (from != ZERO_ADDRESS) {
    const idFromTotal = `totalVault:usdc:${from}`;
    let fromTotal = UserVaultBalanceTotal.load(idFromTotal);
    if (fromTotal == null) {
      fromTotal = new UserVaultBalanceTotal(idFromTotal);
      fromTotal.usdc = amount;
      fromTotal.weth = BigInt.zero();
      fromTotal.wbtc = BigInt.zero();
      fromTotal.uni = BigInt.zero();
      fromTotal.link = BigInt.zero();
    } else {
      fromTotal.usdc = fromTotal.usdc.minus(amount);
    }
    fromTotal.save();

    const fromHistoricalBalance = new UserVaultBalance(
      `${event.block.number}:usdc:${from}`
    );
    fromHistoricalBalance.block = event.block.number;
    fromHistoricalBalance.timestamp = event.block.timestamp;
    fromHistoricalBalance.txHash = event.transaction.hash.toHex();
    fromHistoricalBalance.vault = USDC_VAULT_ADDRESS.toHexString();
    fromHistoricalBalance.user = from;
    fromHistoricalBalance.value = fromTotal.usdc;
    fromHistoricalBalance.event = balanceEvent;

    fromHistoricalBalance.save();
  }

  // ZERO_ADDRESS = withdraw event, don't register ZERO_ADDRESS's balance
  if (to != ZERO_ADDRESS) {
    const idToTotal = `totalVault:usdc:${to}`;
    let toTotal = UserVaultBalanceTotal.load(idToTotal);
    if (toTotal == null) {
      toTotal = new UserVaultBalanceTotal(idToTotal);
      toTotal.usdc = amount;
      toTotal.weth = BigInt.zero();
      toTotal.wbtc = BigInt.zero();
      toTotal.uni = BigInt.zero();
      toTotal.link = BigInt.zero();
    } else {
      toTotal.usdc = toTotal.usdc.plus(amount);
    }
    toTotal.save();

    const toHistoricalBalance = new UserVaultBalance(
      `${event.block.number}:usdc:${to}`
    );
    toHistoricalBalance.block = event.block.number;
    toHistoricalBalance.timestamp = event.block.timestamp;
    toHistoricalBalance.txHash = event.transaction.hash.toHex();
    toHistoricalBalance.vault = USDC_VAULT_ADDRESS.toHexString();
    toHistoricalBalance.user = to;
    toHistoricalBalance.value = toTotal.usdc;
    toHistoricalBalance.event = balanceEvent;

    toHistoricalBalance.save();
  }
}

export function handleRebalanceRequest(
  event: GlpUsdcRebalanceRequestEvent
): void {}

export function handleDeposit(event: GlpUsdcDepositEvent): void {}

export function handleWithdraw(event: GlpUsdcWithdrawEvent): void {}
