import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  Deposit as DepositEvent,
  Withdraw as WithdrawEvent,
  Transfer as GlpWethVaultTransferEvent,
  GlpWethVault,
} from "../generated/GlpWethVault/GlpWethVault";
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
  BOOSTED_WETH_VAULT_ADDRESS,
  WETH_VAULT_ADDRESS,
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

export function handleGlpWethDeposit(event: DepositEvent): void {
  const aggregateVault = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);
  const vaultContract = GlpWethVault.bind(WETH_VAULT_ADDRESS);
  const userBalanceEvent = new UserBalanceEvent(
    `weth:deposit:${event.transaction.hash.toHex()}:${event.transactionLogIndex.toString()}`
  );

  userBalanceEvent.block = event.block.number;
  userBalanceEvent.timestamp = event.block.timestamp;
  userBalanceEvent.txHash = event.transaction.hash.toHexString();
  userBalanceEvent.event = "deposit";
  userBalanceEvent.token = WETH_VAULT_ADDRESS.toHexString();
  userBalanceEvent.user = event.params.owner.toHexString();
  userBalanceEvent.assets = event.params.assets;
  userBalanceEvent.shares = event.params.shares;
  userBalanceEvent.from = event.params.caller.toHexString();
  userBalanceEvent.to = WETH_VAULT_ADDRESS.toHexString();
  userBalanceEvent.save();

  /** Price Per Share */

  const ppsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    WETH_VAULT_ADDRESS,
    "deposit"
  );
  ppsEntity.pricePerShare = vaultContract.pps();
  ppsEntity.save();

  /** TVL */

  const tvlEntityId = `weth:${event.transaction.hash.toHex()}:tvl:${
    event.transactionLogIndex
  }`;
  const vaultTvlEntity = new VaultTVL(tvlEntityId);

  vaultTvlEntity.block = event.block.number;
  vaultTvlEntity.timestamp = event.block.timestamp;
  vaultTvlEntity.event = "deposit";
  vaultTvlEntity.txHash = event.transaction.hash.toHex();
  vaultTvlEntity.vault = WETH_VAULT_ADDRESS.toHexString();
  vaultTvlEntity.tvl = aggregateVault.getVaultTVL(WETH_VAULT_ADDRESS);
  vaultTvlEntity.save();

  /** Total supply */

  const supplyEntityId = `weth:${event.transaction.hash.toHex()}:supply:${
    event.transactionLogIndex
  }`;
  const totalSupplyEntity = new VaultTotalSupply(supplyEntityId);

  totalSupplyEntity.block = event.block.number;
  totalSupplyEntity.timestamp = event.block.timestamp;
  totalSupplyEntity.event = "deposit";
  totalSupplyEntity.txHash = event.transaction.hash.toHex();
  totalSupplyEntity.vault = WETH_VAULT_ADDRESS.toHexString();
  totalSupplyEntity.totalSupply = vaultContract.totalSupply();
  totalSupplyEntity.save();
}

export function handleGlpWethWithdraw(event: WithdrawEvent): void {
  const aggregateVault = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);
  const vaultContract = GlpWethVault.bind(WETH_VAULT_ADDRESS);
  const userBalanceEvent = new UserBalanceEvent(
    `weth:withdraw:${event.transaction.hash.toHex()}:${event.transactionLogIndex.toString()}`
  );

  userBalanceEvent.block = event.block.number;
  userBalanceEvent.timestamp = event.block.timestamp;
  userBalanceEvent.txHash = event.transaction.hash.toHexString();
  userBalanceEvent.event = "withdraw";
  userBalanceEvent.token = WETH_VAULT_ADDRESS.toHexString();
  userBalanceEvent.user = event.params.receiver.toHexString();
  userBalanceEvent.assets = event.params.assets;
  userBalanceEvent.shares = event.params.shares;
  userBalanceEvent.from = WETH_VAULT_ADDRESS.toHexString();
  userBalanceEvent.to = event.params.receiver.toHexString();
  userBalanceEvent.save();

  /** Price Per Share */

  const ppsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    WETH_VAULT_ADDRESS,
    "withdraw"
  );
  ppsEntity.pricePerShare = vaultContract.pps();
  ppsEntity.save();

  /** TVL */

  const tvlEntityId = `weth:${event.transaction.hash.toHex()}:tvl:${
    event.transactionLogIndex
  }`;
  const vaultTvlEntity = new VaultTVL(tvlEntityId);

  vaultTvlEntity.block = event.block.number;
  vaultTvlEntity.timestamp = event.block.timestamp;
  vaultTvlEntity.event = "withdraw";
  vaultTvlEntity.txHash = event.transaction.hash.toHex();
  vaultTvlEntity.txHash = event.transaction.hash.toHex();
  vaultTvlEntity.vault = WETH_VAULT_ADDRESS.toHexString();
  vaultTvlEntity.tvl = aggregateVault.getVaultTVL(WETH_VAULT_ADDRESS);
  vaultTvlEntity.save();

  /** Total supply */

  const supplyEntityId = `weth:${event.transaction.hash.toHex()}:supply:${
    event.transactionLogIndex
  }`;
  const totalSupplyEntity = new VaultTotalSupply(supplyEntityId);

  totalSupplyEntity.block = event.block.number;
  totalSupplyEntity.timestamp = event.block.timestamp;
  totalSupplyEntity.event = "withdraw";
  totalSupplyEntity.txHash = event.transaction.hash.toHex();
  totalSupplyEntity.vault = WETH_VAULT_ADDRESS.toHexString();
  totalSupplyEntity.totalSupply = vaultContract.totalSupply();
  totalSupplyEntity.save();
}

export function handleGlpWethVaultTransfer(
  event: GlpWethVaultTransferEvent
): void {
  const amount = event.params.amount;

  const from = event.params.from.toHexString();
  const to = event.params.to.toHexString();

  // Any event not listed below is considered a transfer
  let balanceEvent = "transfer";
  // User deposited into the vault
  if (from == ZERO_ADDRESS) {
    balanceEvent = "deposit";
  }
  // User withdrew into the vault
  if (to == ZERO_ADDRESS) {
    balanceEvent = "withdraw";
  }

  // ZERO_ADDRESS = deposit event, don't register ZERO_ADDRESS's balance
  // BOOSTED_WETH_VAULT_ADDRESS = deboost event, don't register
  if (from != ZERO_ADDRESS && from != BOOSTED_WETH_VAULT_ADDRESS.toString()) {
    const idFromTotal = `totalVault:weth:${from}`;
    let fromTotal = UserVaultBalanceTotal.load(idFromTotal);
    if (fromTotal == null) {
      fromTotal = new UserVaultBalanceTotal(idFromTotal);
      fromTotal.usdc = BigInt.zero();
      fromTotal.weth = amount;
      fromTotal.wbtc = BigInt.zero();
      fromTotal.uni = BigInt.zero();
      fromTotal.link = BigInt.zero();
    } else {
      fromTotal.weth = fromTotal.weth.minus(amount);
    }
    fromTotal.save();

    const fromHistoricalBalance = new UserVaultBalance(
      `${event.block.number}:weth:${from}`
    );
    fromHistoricalBalance.block = event.block.number;
    fromHistoricalBalance.timestamp = event.block.timestamp;
    fromHistoricalBalance.txHash = event.transaction.hash.toHex();
    fromHistoricalBalance.vault = WETH_VAULT_ADDRESS.toHexString();
    fromHistoricalBalance.user = from;
    fromHistoricalBalance.value = fromTotal.weth;
    fromHistoricalBalance.event = balanceEvent;

    fromHistoricalBalance.save();

    if (balanceEvent == "transfer") {
      const userBalanceEvent = new UserBalanceEvent(
        `weth:transferFrom:${event.transaction.hash.toHex()}:${event.transactionLogIndex.toString()}`
      );

      userBalanceEvent.block = event.block.number;
      userBalanceEvent.timestamp = event.block.timestamp;
      userBalanceEvent.txHash = event.transaction.hash.toHexString();
      userBalanceEvent.event = balanceEvent;
      userBalanceEvent.token = WETH_VAULT_ADDRESS.toHexString();
      userBalanceEvent.user = from;
      userBalanceEvent.assets = BigInt.zero();
      userBalanceEvent.shares = event.params.amount;
      userBalanceEvent.from = from;
      userBalanceEvent.to = to;
      userBalanceEvent.save();
    }
  }

  // ZERO_ADDRESS = withdraw event, don't register ZERO_ADDRESS's balance
  // BOOSTED_WETH_VAULT_ADDRESS = boost event, don't register
  if (to != ZERO_ADDRESS && to != BOOSTED_WETH_VAULT_ADDRESS.toString()) {
    const idToTotal = `totalVault:weth:${to}`;
    let toTotal = UserVaultBalanceTotal.load(idToTotal);
    if (toTotal == null) {
      toTotal = new UserVaultBalanceTotal(idToTotal);
      toTotal.usdc = BigInt.zero();
      toTotal.weth = amount;
      toTotal.wbtc = BigInt.zero();
      toTotal.uni = BigInt.zero();
      toTotal.link = BigInt.zero();
    } else {
      toTotal.weth = toTotal.weth.plus(amount);
    }
    toTotal.save();

    const toHistoricalBalance = new UserVaultBalance(
      `${event.block.number}:weth:${to}`
    );
    toHistoricalBalance.block = event.block.number;
    toHistoricalBalance.timestamp = event.block.timestamp;
    toHistoricalBalance.txHash = event.transaction.hash.toHex();
    toHistoricalBalance.vault = WETH_VAULT_ADDRESS.toHexString();
    toHistoricalBalance.user = to;
    toHistoricalBalance.value = toTotal.weth;
    toHistoricalBalance.event = balanceEvent;

    toHistoricalBalance.save();

    if (balanceEvent == "transfer") {
      const userBalanceEvent = new UserBalanceEvent(
        `weth:transferTo:${event.transaction.hash.toHex()}:${event.transactionLogIndex.toString()}`
      );

      userBalanceEvent.block = event.block.number;
      userBalanceEvent.timestamp = event.block.timestamp;
      userBalanceEvent.txHash = event.transaction.hash.toHexString();
      userBalanceEvent.event = balanceEvent;
      userBalanceEvent.token = WETH_VAULT_ADDRESS.toHexString();
      userBalanceEvent.user = to;
      userBalanceEvent.assets = BigInt.zero();
      userBalanceEvent.shares = event.params.amount;
      userBalanceEvent.from = from;
      userBalanceEvent.to = to;
      userBalanceEvent.save();
    }
  }
}
