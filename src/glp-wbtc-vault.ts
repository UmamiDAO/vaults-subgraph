import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  Deposit as DepositEvent,
  Withdraw as WithdrawEvent,
  Transfer as GlpWbtcVaultTransferEvent,
  GlpWbtcVault,
} from "../generated/GlpWbtcVault/GlpWbtcVault";
import {
  UserBalanceEvent,
  UserVaultBalance,
  UserVaultBalanceTotal,
  VaultPricePerShare,
  VaultTVL,
  VaultTotalSupply,
} from "../generated/schema";
import {
  AGGREGATE_VAULT_ADDRESS,
  WBTC_VAULT_ADDRESS,
  ZERO_ADDRESS,
} from "./constants";
import { AggregateVault } from "../generated/AggregateVault/AggregateVault";

function getVaultPpsEntity(
  blockNumber: BigInt,
  timestamp: BigInt,
  vault: Address,
  event: string
): VaultPricePerShare {
  const vaultEntityId = `${blockNumber}:${timestamp}:${vault.toHexString()}`;
  const vaultPps = new VaultPricePerShare(vaultEntityId);

  vaultPps.block = blockNumber;
  vaultPps.timestamp = timestamp;
  vaultPps.vault = vault.toHexString();
  vaultPps.txHash = "";
  vaultPps.event = event;

  return vaultPps as VaultPricePerShare;
}

export function handleGlpWbtcDeposit(event: DepositEvent): void {
  const aggregateVault = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);
  const vaultContract = GlpWbtcVault.bind(WBTC_VAULT_ADDRESS);
  const userBalanceEvent = new UserBalanceEvent(event.transaction.hash.toHex());

  userBalanceEvent.block = event.block.number;
  userBalanceEvent.timestamp = event.block.timestamp;
  userBalanceEvent.txHash = event.transaction.hash.toHexString();
  userBalanceEvent.event = "deposit";
  userBalanceEvent.token = WBTC_VAULT_ADDRESS.toHexString();
  userBalanceEvent.user = event.params.caller.toHexString();
  userBalanceEvent.amount = event.params.assets;
  userBalanceEvent.from = event.params.caller.toHexString();
  userBalanceEvent.to = WBTC_VAULT_ADDRESS.toHexString();
  userBalanceEvent.save();

  /** Price Per Share */

  const ppsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    WBTC_VAULT_ADDRESS,
    "deposit"
  );
  ppsEntity.pricePerShare = vaultContract.pps();
  ppsEntity.save();

  /** TVL */

  const tvlEntityId = `${event.transaction.hash.toHex()}:tvl`;
  const vaultTvlEntity = new VaultTVL(tvlEntityId);

  vaultTvlEntity.block = event.block.number;
  vaultTvlEntity.timestamp = event.block.timestamp;
  vaultTvlEntity.event = "deposit";
  vaultTvlEntity.txHash = event.transaction.hash.toHex();
  vaultTvlEntity.vault = WBTC_VAULT_ADDRESS.toHexString();
  vaultTvlEntity.tvl = aggregateVault.getVaultTVL(WBTC_VAULT_ADDRESS);
  vaultTvlEntity.save();

  /** Total supply */

  const supplyEntityId = `${event.transaction.hash.toHex()}:supply`;
  const totalSupplyEntity = new VaultTotalSupply(supplyEntityId);

  totalSupplyEntity.block = event.block.number;
  totalSupplyEntity.timestamp = event.block.timestamp;
  totalSupplyEntity.event = "deposit";
  totalSupplyEntity.txHash = event.transaction.hash.toHex();
  totalSupplyEntity.vault = WBTC_VAULT_ADDRESS.toHexString();
  totalSupplyEntity.totalSupply = vaultContract.totalSupply();
  totalSupplyEntity.save();
}

export function handleGlpWbtcWithdraw(event: WithdrawEvent): void {
  const aggregateVault = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);
  const vaultContract = GlpWbtcVault.bind(WBTC_VAULT_ADDRESS);
  const userBalanceEvent = new UserBalanceEvent(event.transaction.hash.toHex());

  userBalanceEvent.block = event.block.number;
  userBalanceEvent.timestamp = event.block.timestamp;
  userBalanceEvent.txHash = event.transaction.hash.toHexString();
  userBalanceEvent.event = "withdraw";
  userBalanceEvent.token = WBTC_VAULT_ADDRESS.toHexString();
  userBalanceEvent.user = event.params.caller.toHexString();
  userBalanceEvent.amount = event.params.assets;
  userBalanceEvent.from = WBTC_VAULT_ADDRESS.toHexString();
  userBalanceEvent.to = event.params.caller.toHexString();
  userBalanceEvent.save();

  /** Price Per Share */

  const ppsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    WBTC_VAULT_ADDRESS,
    "withdraw"
  );
  ppsEntity.pricePerShare = vaultContract.pps();
  ppsEntity.save();

  /** TVL */

  const tvlEntityId = `${event.transaction.hash.toHex()}:tvl`;
  const vaultTvlEntity = new VaultTVL(tvlEntityId);

  vaultTvlEntity.block = event.block.number;
  vaultTvlEntity.timestamp = event.block.timestamp;
  vaultTvlEntity.event = "withdraw";
  vaultTvlEntity.txHash = event.transaction.hash.toHex();
  vaultTvlEntity.vault = WBTC_VAULT_ADDRESS.toHexString();
  vaultTvlEntity.tvl = aggregateVault.getVaultTVL(WBTC_VAULT_ADDRESS);
  vaultTvlEntity.save();

  /** Total supply */

  const supplyEntityId = `${event.transaction.hash.toHex()}:supply`;
  const totalSupplyEntity = new VaultTotalSupply(supplyEntityId);

  totalSupplyEntity.block = event.block.number;
  totalSupplyEntity.timestamp = event.block.timestamp;
  totalSupplyEntity.event = "withdraw";
  totalSupplyEntity.txHash = event.transaction.hash.toHex();
  totalSupplyEntity.vault = WBTC_VAULT_ADDRESS.toHexString();
  totalSupplyEntity.totalSupply = vaultContract.totalSupply();
  totalSupplyEntity.save();
}

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
    fromHistoricalBalance.vault = WBTC_VAULT_ADDRESS.toHexString();
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
    toHistoricalBalance.vault = WBTC_VAULT_ADDRESS.toHexString();
    toHistoricalBalance.user = to;
    toHistoricalBalance.value = toTotal.wbtc;
    toHistoricalBalance.event = balanceEvent;

    toHistoricalBalance.save();
  }
}
