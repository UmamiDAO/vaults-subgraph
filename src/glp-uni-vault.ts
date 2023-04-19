import { BigInt } from "@graphprotocol/graph-ts";
import {
  Deposit as DepositEvent,
  Withdraw as WithdrawEvent,
  Transfer as GlpUniVaultTransferEvent,
  GlpUniVault,
} from "../generated/GlpUniVault/GlpUniVault";
import {
  UserVaultBalance,
  UserVaultBalanceTotal,
  VaultTVL,
  VaultTotalSupply,
} from "../generated/schema";
import {
  AGGREGATE_VAULT_ADDRESS,
  UNI_VAULT_ADDRESS,
  ZERO_ADDRESS,
} from "./constants";
import { AggregateVault } from "../generated/AggregateVault/AggregateVault";

export function handleGlpWbtcDeposit(event: DepositEvent): void {
  const aggregateVault = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);
  const vaultContract = GlpUniVault.bind(UNI_VAULT_ADDRESS);

  /** TVL */

  const tvlEntityId = `${event.transaction.hash.toHex()}:tvl`;
  const vaultTvlEntity = new VaultTVL(tvlEntityId);

  vaultTvlEntity.block = event.block.number;
  vaultTvlEntity.timestamp = event.block.timestamp;
  vaultTvlEntity.vault = UNI_VAULT_ADDRESS.toHexString();
  vaultTvlEntity.tvl = aggregateVault.getVaultTVL(UNI_VAULT_ADDRESS);
  vaultTvlEntity.save();

  /** Total supply */

  const supplyEntityId = `${event.transaction.hash.toHex()}:supply`;
  const totalSupplyEntity = new VaultTotalSupply(supplyEntityId);

  totalSupplyEntity.block = event.block.number;
  totalSupplyEntity.timestamp = event.block.timestamp;
  totalSupplyEntity.vault = UNI_VAULT_ADDRESS.toHexString();
  totalSupplyEntity.totalSupply = vaultContract.totalSupply();
  totalSupplyEntity.save();
}

export function handleGlpWbtcWithdraw(event: WithdrawEvent): void {
  const aggregateVault = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);
  const vaultContract = GlpUniVault.bind(UNI_VAULT_ADDRESS);

  /** TVL */

  const tvlEntityId = `${event.transaction.hash.toHex()}:tvl`;
  const vaultTvlEntity = new VaultTVL(tvlEntityId);

  vaultTvlEntity.block = event.block.number;
  vaultTvlEntity.timestamp = event.block.timestamp;
  vaultTvlEntity.vault = UNI_VAULT_ADDRESS.toHexString();
  vaultTvlEntity.tvl = aggregateVault.getVaultTVL(UNI_VAULT_ADDRESS);
  vaultTvlEntity.save();

  /** Total supply */

  const supplyEntityId = `${event.transaction.hash.toHex()}:supply`;
  const totalSupplyEntity = new VaultTotalSupply(supplyEntityId);

  totalSupplyEntity.block = event.block.number;
  totalSupplyEntity.timestamp = event.block.timestamp;
  totalSupplyEntity.vault = UNI_VAULT_ADDRESS.toHexString();
  totalSupplyEntity.totalSupply = vaultContract.totalSupply();
  totalSupplyEntity.save();
}

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
    fromHistoricalBalance.vault = UNI_VAULT_ADDRESS.toHexString();
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
    toHistoricalBalance.vault = UNI_VAULT_ADDRESS.toHexString();
    toHistoricalBalance.user = to;
    toHistoricalBalance.value = toTotal.uni;
    toHistoricalBalance.event = balanceEvent;

    toHistoricalBalance.save();
  }
}
