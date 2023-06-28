import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  Deposit as DepositEvent,
  Withdraw as WithdrawEvent,
  Transfer as GlpLinkVaultTransferEvent,
  GlpLinkVault,
} from "../generated/GlpLinkVault/GlpLinkVault";
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
  BOOSTED_LINK_VAULT_ADDRESS,
  LINK_VAULT_ADDRESS,
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

export function handleGlpLinkDeposit(event: DepositEvent): void {
  const aggregateVault = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);
  const vaultContract = GlpLinkVault.bind(LINK_VAULT_ADDRESS);
  const userBalanceEvent = new UserBalanceEvent(
    `link:deposit:${event.transaction.hash.toHex()}`
  );

  userBalanceEvent.block = event.block.number;
  userBalanceEvent.timestamp = event.block.timestamp;
  userBalanceEvent.txHash = event.transaction.hash.toHexString();
  userBalanceEvent.event = "deposit";
  userBalanceEvent.token = LINK_VAULT_ADDRESS.toHexString();
  userBalanceEvent.user = event.params.owner.toHexString();
  userBalanceEvent.assets = event.params.assets;
  userBalanceEvent.shares = event.params.shares;
  userBalanceEvent.from = event.params.caller.toHexString();
  userBalanceEvent.to = LINK_VAULT_ADDRESS.toHexString();
  userBalanceEvent.save();

  /** Price Per Share */

  const ppsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    LINK_VAULT_ADDRESS,
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
  vaultTvlEntity.txHash = event.transaction.hash.toHexString();
  vaultTvlEntity.vault = LINK_VAULT_ADDRESS.toHexString();
  vaultTvlEntity.tvl = aggregateVault.getVaultTVL(LINK_VAULT_ADDRESS);
  vaultTvlEntity.save();

  /** Total supply */

  const supplyEntityId = `${event.transaction.hash.toHex()}:supply`;
  const totalSupplyEntity = new VaultTotalSupply(supplyEntityId);

  totalSupplyEntity.block = event.block.number;
  totalSupplyEntity.timestamp = event.block.timestamp;
  totalSupplyEntity.event = "deposit";
  totalSupplyEntity.txHash = event.transaction.hash.toHex();
  totalSupplyEntity.vault = LINK_VAULT_ADDRESS.toHexString();
  totalSupplyEntity.totalSupply = vaultContract.totalSupply();
  totalSupplyEntity.save();
}

export function handleGlpLinkWithdraw(event: WithdrawEvent): void {
  const aggregateVault = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);
  const vaultContract = GlpLinkVault.bind(LINK_VAULT_ADDRESS);
  const userBalanceEvent = new UserBalanceEvent(
    `link:withdraw:${event.transaction.hash.toHex()}`
  );

  userBalanceEvent.block = event.block.number;
  userBalanceEvent.timestamp = event.block.timestamp;
  userBalanceEvent.txHash = event.transaction.hash.toHexString();
  userBalanceEvent.event = "withdraw";
  userBalanceEvent.token = LINK_VAULT_ADDRESS.toHexString();
  userBalanceEvent.user = event.params.receiver.toHexString();
  userBalanceEvent.assets = event.params.assets;
  userBalanceEvent.shares = event.params.shares;
  userBalanceEvent.from = LINK_VAULT_ADDRESS.toHexString();
  userBalanceEvent.to = event.params.receiver.toHexString();
  userBalanceEvent.save();

  /** Price Per Share */

  const ppsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    LINK_VAULT_ADDRESS,
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
  vaultTvlEntity.vault = LINK_VAULT_ADDRESS.toHexString();
  vaultTvlEntity.tvl = aggregateVault.getVaultTVL(LINK_VAULT_ADDRESS);
  vaultTvlEntity.save();

  /** Total supply */

  const supplyEntityId = `${event.transaction.hash.toHex()}:supply`;
  const totalSupplyEntity = new VaultTotalSupply(supplyEntityId);

  totalSupplyEntity.block = event.block.number;
  totalSupplyEntity.timestamp = event.block.timestamp;
  totalSupplyEntity.event = "withdraw";
  totalSupplyEntity.txHash = event.transaction.hash.toHex();
  totalSupplyEntity.vault = LINK_VAULT_ADDRESS.toHexString();
  totalSupplyEntity.totalSupply = vaultContract.totalSupply();
  totalSupplyEntity.save();
}

export function handleGlpLinkVaultTransfer(
  event: GlpLinkVaultTransferEvent
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
  // BOOSTED_LINK_VAULT_ADDRESS = deboost event, don't register
  if (from != ZERO_ADDRESS && from != BOOSTED_LINK_VAULT_ADDRESS.toString()) {
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
    fromHistoricalBalance.vault = LINK_VAULT_ADDRESS.toHexString();
    fromHistoricalBalance.user = from;
    fromHistoricalBalance.value = fromTotal.link;
    fromHistoricalBalance.event = balanceEvent;

    fromHistoricalBalance.save();

    if (balanceEvent == "transfer") {
      const userBalanceEvent = new UserBalanceEvent(
        `link:transferFrom:${event.transaction.hash.toHex()}`
      );

      userBalanceEvent.block = event.block.number;
      userBalanceEvent.timestamp = event.block.timestamp;
      userBalanceEvent.txHash = event.transaction.hash.toHexString();
      userBalanceEvent.event = balanceEvent;
      userBalanceEvent.token = LINK_VAULT_ADDRESS.toHexString();
      userBalanceEvent.user = from;
      userBalanceEvent.assets = BigInt.zero();
      userBalanceEvent.shares = event.params.amount;
      userBalanceEvent.from = from;
      userBalanceEvent.to = to;
      userBalanceEvent.save();
    }
  }

  // ZERO_ADDRESS = withdraw event, don't register ZERO_ADDRESS's balance
  // BOOSTED_LINK_VAULT_ADDRESS = boost event, don't register
  if (to != ZERO_ADDRESS && to != BOOSTED_LINK_VAULT_ADDRESS.toString()) {
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
    toHistoricalBalance.vault = LINK_VAULT_ADDRESS.toHexString();
    toHistoricalBalance.user = to;
    toHistoricalBalance.value = toTotal.link;
    toHistoricalBalance.event = balanceEvent;

    toHistoricalBalance.save();

    if (balanceEvent == "transfer") {
      const userBalanceEvent = new UserBalanceEvent(
        `link:transferTo:${event.transaction.hash.toHex()}`
      );

      userBalanceEvent.block = event.block.number;
      userBalanceEvent.timestamp = event.block.timestamp;
      userBalanceEvent.txHash = event.transaction.hash.toHexString();
      userBalanceEvent.event = balanceEvent;
      userBalanceEvent.token = LINK_VAULT_ADDRESS.toHexString();
      userBalanceEvent.user = to;
      userBalanceEvent.assets = BigInt.zero();
      userBalanceEvent.shares = event.params.amount;
      userBalanceEvent.from = from;
      userBalanceEvent.to = to;
      userBalanceEvent.save();
    }
  }
}
