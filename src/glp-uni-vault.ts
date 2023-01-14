import { BigInt } from "@graphprotocol/graph-ts";
import {
  GlpUniVaultDeposit as GlpUniVaultDepositEvent,
  GlpUniVaultRebalanceRequest as GlpUniVaultRebalanceRequestEvent,
  GlpUniVaultTransfer as GlpUniVaultTransferEvent,
  GlpUniVaultWithdraw as GlpUniVaultWithdrawEvent,
} from "../generated/GlpUniVault/GlpUniVault";
import { UserVaultBalance, UserVaultBalanceTotal } from "../generated/schema";
import { UNI_VAULT_ADDRESS, ZERO_ADDRESS } from "./constants";

export function handleGlpUniVaultTransfer(
  event: GlpUniVaultTransferEvent
): void {
  const amount = event.params.amount;

  const from = event.params.from.toHexString();
  const to = event.params.to.toHexString();

  // Any event not listed below is considered a transfer
  let balanceEvent = "uni-vault-transfer";
  // User deposited into the vault
  if (from == ZERO_ADDRESS) {
    balanceEvent = "uni-vault-deposit";
  }
  // User withdrew into the vault
  if (to == ZERO_ADDRESS) {
    balanceEvent = "uni-vault-withdraw";
  }

  // ZERO_ADDRESS = deposit event, don't register ZERO_ADDRESS's balance
  if (from != ZERO_ADDRESS) {
    const idFromTotal = `totalVault:uni:${from}`;
    let fromTotal = UserVaultBalanceTotal.load(idFromTotal);
    if (fromTotal == null) {
      fromTotal = new UserVaultBalanceTotal(idFromTotal);
      fromTotal.usdc = BigInt.zero();
      fromTotal.weth = BigInt.zero();
      fromTotal.wbtc = BigInt.zero();
      fromTotal.uni = amount;
      fromTotal.link = BigInt.zero();
    } else {
      fromTotal.uni = fromTotal.uni.minus(amount);
    }
    fromTotal.save();

    const fromHistoricalBalance = new UserVaultBalance(
      `${event.block.number}:uni:${from}`
    );
    fromHistoricalBalance.block = event.block.number;
    fromHistoricalBalance.timestamp = event.block.timestamp;
    fromHistoricalBalance.txHash = event.transaction.hash.toHex();
    fromHistoricalBalance.vault = UNI_VAULT_ADDRESS.toString();
    fromHistoricalBalance.user = from;
    fromHistoricalBalance.value = fromTotal.uni;
    fromHistoricalBalance.event = balanceEvent;

    fromHistoricalBalance.save();
  }

  // ZERO_ADDRESS = withdraw event, don't register ZERO_ADDRESS's balance
  if (to != ZERO_ADDRESS) {
    const idToTotal = `totalVault:uni:${to}`;
    let toTotal = UserVaultBalanceTotal.load(idToTotal);
    if (toTotal == null) {
      toTotal = new UserVaultBalanceTotal(idToTotal);
      toTotal.usdc = BigInt.zero();
      toTotal.weth = BigInt.zero();
      toTotal.wbtc = BigInt.zero();
      toTotal.uni = amount;
      toTotal.link = BigInt.zero();
    } else {
      toTotal.uni = toTotal.uni.plus(amount);
    }
    toTotal.save();

    const toHistoricalBalance = new UserVaultBalance(
      `${event.block.number}:uni:${to}`
    );
    toHistoricalBalance.block = event.block.number;
    toHistoricalBalance.timestamp = event.block.timestamp;
    toHistoricalBalance.txHash = event.transaction.hash.toHex();
    toHistoricalBalance.vault = UNI_VAULT_ADDRESS.toString();
    toHistoricalBalance.user = to;
    toHistoricalBalance.value = toTotal.uni;
    toHistoricalBalance.event = balanceEvent;

    toHistoricalBalance.save();
  }
}

export function handleGlpUniVaultRebalanceRequest(
  event: GlpUniVaultRebalanceRequestEvent
): void {}

export function handleGlpUniVaultDeposit(
  event: GlpUniVaultDepositEvent
): void {}

export function handleGlpUniVaultWithdraw(
  event: GlpUniVaultWithdrawEvent
): void {}
