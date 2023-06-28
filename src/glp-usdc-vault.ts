import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  Deposit as DepositEvent,
  Withdraw as WithdrawEvent,
  Transfer as GlpUsdcTransferEvent,
  GlpUsdcVault,
} from "../generated/GlpUsdcVault/GlpUsdcVault";
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
  BOOSTED_USDC_VAULT_ADDRESS,
  USDC_VAULT_ADDRESS,
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

export function handleGlpUsdcDeposit(event: DepositEvent): void {
  const aggregateVault = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);
  const vaultContract = GlpUsdcVault.bind(USDC_VAULT_ADDRESS);
  const userBalanceEvent = new UserBalanceEvent(
    `usdc:deposit:${event.transaction.hash.toHex()}`
  );

  userBalanceEvent.block = event.block.number;
  userBalanceEvent.timestamp = event.block.timestamp;
  userBalanceEvent.txHash = event.transaction.hash.toHexString();
  userBalanceEvent.event = "deposit";
  userBalanceEvent.token = USDC_VAULT_ADDRESS.toHexString();
  userBalanceEvent.user = event.params.owner.toHexString();
  userBalanceEvent.assets = event.params.assets;
  userBalanceEvent.shares = event.params.shares;
  userBalanceEvent.from = event.params.caller.toHexString();
  userBalanceEvent.to = USDC_VAULT_ADDRESS.toHexString();
  userBalanceEvent.save();

  /** Price Per Share */

  const ppsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    USDC_VAULT_ADDRESS,
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
  vaultTvlEntity.vault = USDC_VAULT_ADDRESS.toHexString();
  vaultTvlEntity.tvl = aggregateVault.getVaultTVL(USDC_VAULT_ADDRESS);
  vaultTvlEntity.save();

  /** Total supply */

  const supplyEntityId = `${event.transaction.hash.toHex()}:supply`;
  const totalSupplyEntity = new VaultTotalSupply(supplyEntityId);

  totalSupplyEntity.block = event.block.number;
  totalSupplyEntity.timestamp = event.block.timestamp;
  totalSupplyEntity.event = "deposit";
  totalSupplyEntity.txHash = event.transaction.hash.toHex();
  totalSupplyEntity.vault = USDC_VAULT_ADDRESS.toHexString();
  totalSupplyEntity.totalSupply = vaultContract.totalSupply();
  totalSupplyEntity.save();
}

export function handleGlpUsdcWithdraw(event: WithdrawEvent): void {
  const aggregateVault = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);
  const vaultContract = GlpUsdcVault.bind(USDC_VAULT_ADDRESS);
  const userBalanceEvent = new UserBalanceEvent(
    `usdc:withdraw:${event.transaction.hash.toHex()}`
  );

  userBalanceEvent.block = event.block.number;
  userBalanceEvent.timestamp = event.block.timestamp;
  userBalanceEvent.txHash = event.transaction.hash.toHexString();
  userBalanceEvent.event = "withdraw";
  userBalanceEvent.token = USDC_VAULT_ADDRESS.toHexString();
  userBalanceEvent.user = event.params.receiver.toHexString();
  userBalanceEvent.assets = event.params.assets;
  userBalanceEvent.shares = event.params.shares;
  userBalanceEvent.from = USDC_VAULT_ADDRESS.toHexString();
  userBalanceEvent.to = event.params.receiver.toHexString();
  userBalanceEvent.save();

  /** Price Per Share */

  const ppsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    USDC_VAULT_ADDRESS,
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
  vaultTvlEntity.vault = USDC_VAULT_ADDRESS.toHexString();
  vaultTvlEntity.tvl = aggregateVault.getVaultTVL(USDC_VAULT_ADDRESS);
  vaultTvlEntity.save();

  /** Total supply */

  const supplyEntityId = `${event.transaction.hash.toHex()}:supply`;
  const totalSupplyEntity = new VaultTotalSupply(supplyEntityId);

  totalSupplyEntity.block = event.block.number;
  totalSupplyEntity.timestamp = event.block.timestamp;
  totalSupplyEntity.event = "withdraw";
  totalSupplyEntity.txHash = event.transaction.hash.toHex();
  totalSupplyEntity.vault = USDC_VAULT_ADDRESS.toHexString();
  totalSupplyEntity.totalSupply = vaultContract.totalSupply();
  totalSupplyEntity.save();
}

export function handleTransfer(event: GlpUsdcTransferEvent): void {
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
  // BOOSTED_USDC_VAULT_ADDRESS = deboost event, don't register
  if (from != ZERO_ADDRESS && from != BOOSTED_USDC_VAULT_ADDRESS.toString()) {
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

    if (balanceEvent == "transfer") {
      const userBalanceEvent = new UserBalanceEvent(
        `usdc:transferFrom:${event.transaction.hash.toHex()}`
      );

      userBalanceEvent.block = event.block.number;
      userBalanceEvent.timestamp = event.block.timestamp;
      userBalanceEvent.txHash = event.transaction.hash.toHexString();
      userBalanceEvent.event = balanceEvent;
      userBalanceEvent.token = USDC_VAULT_ADDRESS.toHexString();
      userBalanceEvent.user = from;
      userBalanceEvent.assets = BigInt.zero();
      userBalanceEvent.shares = event.params.amount;
      userBalanceEvent.from = from;
      userBalanceEvent.to = to;
      userBalanceEvent.save();
    }
  }

  // ZERO_ADDRESS = withdraw event, don't register ZERO_ADDRESS's balance
  // BOOSTED_USDC_VAULT_ADDRESS = boost event, don't register
  if (to != ZERO_ADDRESS && to != BOOSTED_USDC_VAULT_ADDRESS.toString()) {
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

    if (balanceEvent == "transfer") {
      const userBalanceEvent = new UserBalanceEvent(
        `usdc:transferTo:${event.transaction.hash.toHex()}`
      );

      userBalanceEvent.block = event.block.number;
      userBalanceEvent.timestamp = event.block.timestamp;
      userBalanceEvent.txHash = event.transaction.hash.toHexString();
      userBalanceEvent.event = balanceEvent;
      userBalanceEvent.token = USDC_VAULT_ADDRESS.toHexString();
      userBalanceEvent.user = to;
      userBalanceEvent.assets = BigInt.zero();
      userBalanceEvent.shares = event.params.amount;
      userBalanceEvent.from = from;
      userBalanceEvent.to = to;
      userBalanceEvent.save();
    }
  }
}
