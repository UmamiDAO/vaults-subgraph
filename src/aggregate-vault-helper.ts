import { BigInt, ethereum, log } from "@graphprotocol/graph-ts";
import {
  AggregateVaultHelper,
  CloseRebalance as CloseRebalanceEvent,
  CollectVaultFees as CollectVaultFeesEvent,
  CompoundDistributeYield as CompoundDistributeYieldEvent,
  Cycle as CycleEvent,
  OpenRebalance as OpenRebalanceEvent,
  RebalanceGlpPosition as RebalanceGlpPositionEvent,
  SettleNettedPositionPnl as SettleNettedPositionPnlEvent,
  UpdateNettingCheckpointPrice as UpdateNettingCheckpointPriceEvent,
} from "../generated/AggregateVaultHelper/AggregateVaultHelper";
import { AggregateVault } from "../generated/AggregateVaultHelper/AggregateVault";
import { GmxVault } from "../generated/AggregateVaultHelper/GmxVault";
import { Manager } from "../generated/AggregateVaultHelper/Manager";
import {
  CloseRebalance,
  CollectVaultFees,
  CompoundDistributeYield,
  Cycle,
  OpenRebalance,
  RebalanceGlpPosition,
  RebalanceSnapshot,
  SettleNettedPositionPnl,
  UpdateNettingCheckpointPrice,
  VaultPpsLastTimestamp,
  VaultPricePerShare,
  VaultTVL,
} from "../generated/schema";
import {
  AGGREGATE_VAULT_ADDRESS,
  AGGREGATE_VAULT_HELPER_ADDRESS,
  GLP_HANDLER_ADDRESS,
  GMX_VAULT_ADDRESS,
  LINK_ADDRESS,
  LINK_VAULT_ADDRESS,
  UNI_ADDRESS,
  UNI_VAULT_ADDRESS,
  USDC_ADDRESS,
  USDC_VAULT_ADDRESS,
  WBTC_ADDRESS,
  WBTC_VAULT_ADDRESS,
  WETH_ADDRESS,
  WETH_VAULT_ADDRESS,
} from "./constants";

export function handleBlock(block: ethereum.Block): void {
  if (block.number.mod(BigInt.fromString("500")).gt(BigInt.zero())) {
    return;
  }

  let lastPpsTimestamp = VaultPpsLastTimestamp.load("timestamp");
  /** Wait a minute to register a new PPS */
  if (
    lastPpsTimestamp == null ||
    block.timestamp.gt(
      lastPpsTimestamp.timestamp.plus(BigInt.fromString("1800"))
    )
  ) {
    if (lastPpsTimestamp == null) {
      lastPpsTimestamp = new VaultPpsLastTimestamp("timestamp");
    }
    lastPpsTimestamp.timestamp = block.timestamp;
    lastPpsTimestamp.save();

    const aggregateVault = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);

    /** USDC vault */
    /** USDC vault price per share */
    const usdcVaultEntityId = `${block.number}:${
      block.timestamp
    }:${USDC_VAULT_ADDRESS.toHexString()}`;
    const usdcVaultPps = new VaultPricePerShare(usdcVaultEntityId);

    usdcVaultPps.block = block.number;
    usdcVaultPps.timestamp = block.timestamp;
    usdcVaultPps.vault = USDC_VAULT_ADDRESS.toHexString();

    usdcVaultPps.pricePerShare = aggregateVault.getVaultPPS(USDC_VAULT_ADDRESS);
    usdcVaultPps.save();

    /** TVL */

    const usdcVaultTvl = new VaultTVL(usdcVaultEntityId);

    usdcVaultTvl.block = block.number;
    usdcVaultTvl.timestamp = block.timestamp;
    usdcVaultTvl.vault = USDC_VAULT_ADDRESS.toHexString();
    usdcVaultTvl.tvl = aggregateVault.getVaultTVL(USDC_VAULT_ADDRESS);
    usdcVaultTvl.save();

    /** WETH vault */
    /** Price per share */
    const wethVaultEntityId = `${block.number}:${
      block.timestamp
    }:${WETH_VAULT_ADDRESS.toHexString()}`;
    const wethVaultPps = new VaultPricePerShare(wethVaultEntityId);

    wethVaultPps.block = block.number;
    wethVaultPps.timestamp = block.timestamp;
    wethVaultPps.vault = WETH_VAULT_ADDRESS.toHexString();
    wethVaultPps.pricePerShare = aggregateVault.getVaultPPS(WETH_VAULT_ADDRESS);
    wethVaultPps.save();

    /** TVL */
    const wethVaulTvl = new VaultTVL(wethVaultEntityId);

    wethVaulTvl.block = block.number;
    wethVaulTvl.timestamp = block.timestamp;
    wethVaulTvl.vault = WETH_VAULT_ADDRESS.toHexString();
    wethVaulTvl.tvl = aggregateVault.getVaultTVL(WETH_VAULT_ADDRESS);
    wethVaulTvl.save();

    /** WBTC vault */
    /** Price per share */
    const wbtcVaultEntityId = `${block.number}:${
      block.timestamp
    }:${WBTC_VAULT_ADDRESS.toHexString()}`;
    const wbtcVaultPps = new VaultPricePerShare(wbtcVaultEntityId);

    wbtcVaultPps.block = block.number;
    wbtcVaultPps.timestamp = block.timestamp;
    wbtcVaultPps.vault = WBTC_VAULT_ADDRESS.toHexString();
    wbtcVaultPps.pricePerShare = aggregateVault.getVaultPPS(WBTC_VAULT_ADDRESS);
    wbtcVaultPps.save();

    /** TVL */

    const wbtcVaultTvl = new VaultTVL(wbtcVaultEntityId);

    wbtcVaultTvl.block = block.number;
    wbtcVaultTvl.timestamp = block.timestamp;
    wbtcVaultTvl.vault = WBTC_VAULT_ADDRESS.toHexString();
    wbtcVaultTvl.tvl = aggregateVault.getVaultTVL(WBTC_VAULT_ADDRESS);
    wbtcVaultTvl.save();

    /** UNI vault */
    /** Price per share */
    const uniVaultEntityId = `${block.number}:${
      block.timestamp
    }:${UNI_VAULT_ADDRESS.toHexString()}`;
    const uniVaultPps = new VaultPricePerShare(uniVaultEntityId);

    uniVaultPps.block = block.number;
    uniVaultPps.timestamp = block.timestamp;
    uniVaultPps.vault = UNI_VAULT_ADDRESS.toHexString();
    uniVaultPps.pricePerShare = aggregateVault.getVaultPPS(UNI_VAULT_ADDRESS);
    uniVaultPps.save();

    /** TVL */

    const uniVaultTvl = new VaultTVL(uniVaultEntityId);

    uniVaultTvl.block = block.number;
    uniVaultTvl.timestamp = block.timestamp;
    uniVaultTvl.vault = UNI_VAULT_ADDRESS.toHexString();
    uniVaultTvl.tvl = aggregateVault.getVaultTVL(UNI_VAULT_ADDRESS);
    uniVaultTvl.save();

    /** LINK vault */
    /** Price per share */
    const linkVaultEntityId = `${block.number}:${
      block.timestamp
    }:${LINK_VAULT_ADDRESS.toHexString()}`;

    const linkVaultPps = new VaultPricePerShare(linkVaultEntityId);

    linkVaultPps.block = block.number;
    linkVaultPps.timestamp = block.timestamp;
    linkVaultPps.vault = LINK_VAULT_ADDRESS.toHexString();
    linkVaultPps.pricePerShare = aggregateVault.getVaultPPS(LINK_VAULT_ADDRESS);
    linkVaultPps.save();

    /** TVL */

    const linkVaultTvl = new VaultTVL(linkVaultEntityId);

    linkVaultTvl.block = block.number;
    linkVaultTvl.timestamp = block.timestamp;
    linkVaultTvl.vault = LINK_VAULT_ADDRESS.toHexString();
    linkVaultTvl.tvl = aggregateVault.getVaultTVL(LINK_VAULT_ADDRESS);
    linkVaultTvl.save();
  }
}

export function handleCloseRebalance(event: CloseRebalanceEvent): void {
  let entity = new CloseRebalance(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  const aggregateVaultHelper = AggregateVaultHelper.bind(
    AGGREGATE_VAULT_HELPER_ADDRESS
  );
  const aggregateVault = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);

  const state = aggregateVaultHelper.getVaultState();
  entity.timestamp = event.params._timestamp;
  entity.block = event.block.number;
  entity.epoch = state.epoch;
  entity.save();

  const gmxVaultContract = GmxVault.bind(GMX_VAULT_ADDRESS);
  const glpManagerContract = Manager.bind(GLP_HANDLER_ADDRESS);

  const snapshot = new RebalanceSnapshot(event.transaction.hash.toHex());
  snapshot.block = event.block.number;
  snapshot.timestamp = event.block.timestamp;
  snapshot.txHash = event.transaction.hash.toHex();
  snapshot.event = "close";
  snapshot.vaultsPps = [
    aggregateVault.getVaultPPS(USDC_VAULT_ADDRESS),
    aggregateVault.getVaultPPS(WETH_VAULT_ADDRESS),
    aggregateVault.getVaultPPS(WBTC_VAULT_ADDRESS),
    aggregateVault.getVaultPPS(LINK_VAULT_ADDRESS),
    aggregateVault.getVaultPPS(UNI_VAULT_ADDRESS),
  ];
  snapshot.vaultsTVL = [
    aggregateVault.getVaultTVL(USDC_VAULT_ADDRESS),
    aggregateVault.getVaultTVL(WETH_VAULT_ADDRESS),
    aggregateVault.getVaultTVL(WBTC_VAULT_ADDRESS),
    aggregateVault.getVaultTVL(LINK_VAULT_ADDRESS),
    aggregateVault.getVaultTVL(UNI_VAULT_ADDRESS),
  ];
  const rebalanceState = aggregateVaultHelper.getRebalanceState();
  snapshot.glpComposition = rebalanceState.glpComposition;
  snapshot.vaultsGlpAlloc = rebalanceState.glpAllocation;
  snapshot.aggregatePositions = rebalanceState.aggregatePositions;
  snapshot.usdcVaultExposures = rebalanceState.externalPositions[0];
  snapshot.wethVaultExposures = rebalanceState.externalPositions[1];
  snapshot.wbtcVaultExposures = rebalanceState.externalPositions[2];
  snapshot.linkVaultExposures = rebalanceState.externalPositions[3];
  snapshot.uniVaultExposures = rebalanceState.externalPositions[4];
  snapshot.usdcVaultInternalNetting = aggregateVaultHelper.getNettedPositions()[0];
  snapshot.wethVaultInternalNetting = aggregateVaultHelper.getNettedPositions()[1];
  snapshot.wbtcVaultInternalNetting = aggregateVaultHelper.getNettedPositions()[2];
  snapshot.linkVaultInternalNetting = aggregateVaultHelper.getNettedPositions()[3];
  snapshot.uniVaultInternalNetting = aggregateVaultHelper.getNettedPositions()[4];
  snapshot.glpPrice = glpManagerContract.getGlpPrice1();
  const usdcMinPrice = gmxVaultContract.getMinPrice(USDC_ADDRESS);
  const usdcMaxPrice = gmxVaultContract.getMaxPrice(USDC_ADDRESS);
  const wethMinPrice = gmxVaultContract.getMinPrice(WETH_ADDRESS);
  const wethMaxPrice = gmxVaultContract.getMaxPrice(WETH_ADDRESS);
  const wbtcMinPrice = gmxVaultContract.getMinPrice(WBTC_ADDRESS);
  const wbtcMaxPrice = gmxVaultContract.getMaxPrice(WBTC_ADDRESS);
  const linkMinPrice = gmxVaultContract.getMinPrice(LINK_ADDRESS);
  const linkMaxPrice = gmxVaultContract.getMaxPrice(LINK_ADDRESS);
  const uniMinPrice = gmxVaultContract.getMinPrice(UNI_ADDRESS);
  const uniMaxPrice = gmxVaultContract.getMaxPrice(UNI_ADDRESS);
  snapshot.assetsPrices = [
    usdcMinPrice.plus(usdcMaxPrice).div(BigInt.fromString("2")),
    wethMinPrice.plus(wethMaxPrice).div(BigInt.fromString("2")),
    wbtcMinPrice.plus(wbtcMaxPrice).div(BigInt.fromString("2")),
    linkMinPrice.plus(linkMaxPrice).div(BigInt.fromString("2")),
    uniMinPrice.plus(uniMaxPrice).div(BigInt.fromString("2")),
  ];
  snapshot.save();

  const block = event.block;
  /** USDC vault */
  /** USDC vault price per share */
  const usdcVaultEntityId = `${block.number}:${
    block.timestamp
  }:${USDC_VAULT_ADDRESS.toHexString()}`;
  const usdcVaultPps = new VaultPricePerShare(usdcVaultEntityId);

  usdcVaultPps.block = block.number;
  usdcVaultPps.timestamp = block.timestamp;
  usdcVaultPps.vault = USDC_VAULT_ADDRESS.toHexString();

  usdcVaultPps.pricePerShare = aggregateVault.getVaultPPS(USDC_VAULT_ADDRESS);
  usdcVaultPps.save();

  /** TVL */

  const usdcVaultTvl = new VaultTVL(usdcVaultEntityId);

  usdcVaultTvl.block = block.number;
  usdcVaultTvl.timestamp = block.timestamp;
  usdcVaultTvl.vault = USDC_VAULT_ADDRESS.toHexString();
  usdcVaultTvl.tvl = aggregateVault.getVaultTVL(USDC_VAULT_ADDRESS);
  usdcVaultTvl.save();

  /** WETH vault */
  /** Price per share */
  const wethVaultEntityId = `${block.number}:${
    block.timestamp
  }:${WETH_VAULT_ADDRESS.toHexString()}`;
  const wethVaultPps = new VaultPricePerShare(wethVaultEntityId);

  wethVaultPps.block = block.number;
  wethVaultPps.timestamp = block.timestamp;
  wethVaultPps.vault = WETH_VAULT_ADDRESS.toHexString();
  wethVaultPps.pricePerShare = aggregateVault.getVaultPPS(WETH_VAULT_ADDRESS);
  wethVaultPps.save();

  /** TVL */
  const wethVaulTvl = new VaultTVL(wethVaultEntityId);

  wethVaulTvl.block = block.number;
  wethVaulTvl.timestamp = block.timestamp;
  wethVaulTvl.vault = WETH_VAULT_ADDRESS.toHexString();
  wethVaulTvl.tvl = aggregateVault.getVaultTVL(WETH_VAULT_ADDRESS);
  wethVaulTvl.save();

  /** WBTC vault */
  /** Price per share */
  const wbtcVaultEntityId = `${block.number}:${
    block.timestamp
  }:${WBTC_VAULT_ADDRESS.toHexString()}`;
  const wbtcVaultPps = new VaultPricePerShare(wbtcVaultEntityId);

  wbtcVaultPps.block = block.number;
  wbtcVaultPps.timestamp = block.timestamp;
  wbtcVaultPps.vault = WBTC_VAULT_ADDRESS.toHexString();
  wbtcVaultPps.pricePerShare = aggregateVault.getVaultPPS(WBTC_VAULT_ADDRESS);
  wbtcVaultPps.save();

  /** TVL */

  const wbtcVaultTvl = new VaultTVL(wbtcVaultEntityId);

  wbtcVaultTvl.block = block.number;
  wbtcVaultTvl.timestamp = block.timestamp;
  wbtcVaultTvl.vault = WBTC_VAULT_ADDRESS.toHexString();
  wbtcVaultTvl.tvl = aggregateVault.getVaultTVL(WBTC_VAULT_ADDRESS);
  wbtcVaultTvl.save();

  /** UNI vault */
  /** Price per share */
  const uniVaultEntityId = `${block.number}:${
    block.timestamp
  }:${UNI_VAULT_ADDRESS.toHexString()}`;
  const uniVaultPps = new VaultPricePerShare(uniVaultEntityId);

  uniVaultPps.block = block.number;
  uniVaultPps.timestamp = block.timestamp;
  uniVaultPps.vault = UNI_VAULT_ADDRESS.toHexString();
  uniVaultPps.pricePerShare = aggregateVault.getVaultPPS(UNI_VAULT_ADDRESS);
  uniVaultPps.save();

  /** TVL */

  const uniVaultTvl = new VaultTVL(uniVaultEntityId);

  uniVaultTvl.block = block.number;
  uniVaultTvl.timestamp = block.timestamp;
  uniVaultTvl.vault = UNI_VAULT_ADDRESS.toHexString();
  uniVaultTvl.tvl = aggregateVault.getVaultTVL(UNI_VAULT_ADDRESS);
  uniVaultTvl.save();

  /** LINK vault */
  /** Price per share */
  const linkVaultEntityId = `${block.number}:${
    block.timestamp
  }:${LINK_VAULT_ADDRESS.toHexString()}`;

  const linkVaultPps = new VaultPricePerShare(linkVaultEntityId);

  linkVaultPps.block = block.number;
  linkVaultPps.timestamp = block.timestamp;
  linkVaultPps.vault = LINK_VAULT_ADDRESS.toHexString();
  linkVaultPps.pricePerShare = aggregateVault.getVaultPPS(LINK_VAULT_ADDRESS);
  linkVaultPps.save();

  /** TVL */

  const linkVaultTvl = new VaultTVL(linkVaultEntityId);

  linkVaultTvl.block = block.number;
  linkVaultTvl.timestamp = block.timestamp;
  linkVaultTvl.vault = LINK_VAULT_ADDRESS.toHexString();
  linkVaultTvl.tvl = aggregateVault.getVaultTVL(LINK_VAULT_ADDRESS);
  linkVaultTvl.save();
}

export function handleCollectVaultFees(event: CollectVaultFeesEvent): void {
  let entity = new CollectVaultFees(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  const aggregateVaultHelper = AggregateVaultHelper.bind(
    AGGREGATE_VAULT_HELPER_ADDRESS
  );
  const state = aggregateVaultHelper.getVaultState();
  entity.timestamp = event.block.timestamp;
  entity.block = event.block.number;
  entity.epoch = state.epoch;
  entity.totalVaultFee = event.params.totalVaultFee;
  entity.performanceFeeInAsset = event.params.performanceFeeInAsset;
  entity.managementFeeInAsset = event.params.managementFeeInAsset;
  entity.slowReleaseMintAmount = event.params.slowReleaseMintAmount;
  entity._assetVault = event.params._assetVault;
  entity.save();
}

export function handleCompoundDistributeYield(
  event: CompoundDistributeYieldEvent
): void {
  let entity = new CompoundDistributeYield(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  const aggregateVaultHelper = AggregateVaultHelper.bind(
    AGGREGATE_VAULT_HELPER_ADDRESS
  );
  const state = aggregateVaultHelper.getVaultState();
  entity.timestamp = event.block.timestamp;
  entity.block = event.block.number;
  entity.epoch = state.epoch;
  entity.glpYieldPerVault = event.params.glpYieldPerVault;
  entity.save();
}

export function handleCycle(event: CycleEvent): void {
  let entity = new Cycle(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  const aggregateVaultHelper = AggregateVaultHelper.bind(
    AGGREGATE_VAULT_HELPER_ADDRESS
  );
  const state = aggregateVaultHelper.getVaultState();
  entity.timestamp = event.params.timestamp;
  entity.block = event.block.number;
  entity.epoch = state.epoch;
  entity.round = event.params.round;
  entity.save();
}

export function handleOpenRebalance(event: OpenRebalanceEvent): void {
  let entity = new OpenRebalance(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );

  const gmxVaultContract = GmxVault.bind(GMX_VAULT_ADDRESS);
  const glpManagerContract = Manager.bind(GLP_HANDLER_ADDRESS);
  const aggregateVaultHelper = AggregateVaultHelper.bind(
    AGGREGATE_VAULT_HELPER_ADDRESS
  );
  const aggregateVault = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);
  const state = aggregateVaultHelper.getVaultState();
  entity.timestamp = event.params.timestamp;
  entity.block = event.block.number;
  entity.epoch = state.epoch;
  entity.nextVaultGlpAlloc = event.params.nextVaultGlpAlloc;
  entity.nextGlpComp = event.params.nextGlpComp;
  entity.adjustedPositions = event.params.adjustedPositions;
  entity.save();

  const snapshot = new RebalanceSnapshot(event.transaction.hash.toHex());
  snapshot.block = event.block.number;
  snapshot.timestamp = event.block.timestamp;
  snapshot.txHash = event.transaction.hash.toHex();
  snapshot.event = "open";
  snapshot.vaultsPps = [
    aggregateVault.getVaultPPS(USDC_VAULT_ADDRESS),
    aggregateVault.getVaultPPS(WETH_VAULT_ADDRESS),
    aggregateVault.getVaultPPS(WBTC_VAULT_ADDRESS),
    aggregateVault.getVaultPPS(LINK_VAULT_ADDRESS),
    aggregateVault.getVaultPPS(UNI_VAULT_ADDRESS),
  ];
  snapshot.vaultsTVL = [
    aggregateVault.getVaultTVL(USDC_VAULT_ADDRESS),
    aggregateVault.getVaultTVL(WETH_VAULT_ADDRESS),
    aggregateVault.getVaultTVL(WBTC_VAULT_ADDRESS),
    aggregateVault.getVaultTVL(LINK_VAULT_ADDRESS),
    aggregateVault.getVaultTVL(UNI_VAULT_ADDRESS),
  ];
  const rebalanceState = aggregateVaultHelper.getRebalanceState();
  snapshot.glpComposition = rebalanceState.glpComposition;
  snapshot.vaultsGlpAlloc = rebalanceState.glpAllocation;
  snapshot.aggregatePositions = rebalanceState.aggregatePositions;
  snapshot.usdcVaultExposures = rebalanceState.externalPositions[0];
  snapshot.wethVaultExposures = rebalanceState.externalPositions[1];
  snapshot.wbtcVaultExposures = rebalanceState.externalPositions[2];
  snapshot.linkVaultExposures = rebalanceState.externalPositions[3];
  snapshot.uniVaultExposures = rebalanceState.externalPositions[4];
  snapshot.usdcVaultInternalNetting = aggregateVaultHelper.getNettedPositions()[0];
  snapshot.wethVaultInternalNetting = aggregateVaultHelper.getNettedPositions()[1];
  snapshot.wbtcVaultInternalNetting = aggregateVaultHelper.getNettedPositions()[2];
  snapshot.linkVaultInternalNetting = aggregateVaultHelper.getNettedPositions()[3];
  snapshot.uniVaultInternalNetting = aggregateVaultHelper.getNettedPositions()[4];
  snapshot.glpPrice = glpManagerContract.getGlpPrice1();
  const usdcMinPrice = gmxVaultContract.getMinPrice(USDC_ADDRESS);
  const usdcMaxPrice = gmxVaultContract.getMaxPrice(USDC_ADDRESS);
  const wethMinPrice = gmxVaultContract.getMinPrice(WETH_ADDRESS);
  const wethMaxPrice = gmxVaultContract.getMaxPrice(WETH_ADDRESS);
  const wbtcMinPrice = gmxVaultContract.getMinPrice(WBTC_ADDRESS);
  const wbtcMaxPrice = gmxVaultContract.getMaxPrice(WBTC_ADDRESS);
  const linkMinPrice = gmxVaultContract.getMinPrice(LINK_ADDRESS);
  const linkMaxPrice = gmxVaultContract.getMaxPrice(LINK_ADDRESS);
  const uniMinPrice = gmxVaultContract.getMinPrice(UNI_ADDRESS);
  const uniMaxPrice = gmxVaultContract.getMaxPrice(UNI_ADDRESS);
  snapshot.assetsPrices = [
    usdcMinPrice.plus(usdcMaxPrice).div(BigInt.fromString("2")),
    wethMinPrice.plus(wethMaxPrice).div(BigInt.fromString("2")),
    wbtcMinPrice.plus(wbtcMaxPrice).div(BigInt.fromString("2")),
    linkMinPrice.plus(linkMaxPrice).div(BigInt.fromString("2")),
    uniMinPrice.plus(uniMaxPrice).div(BigInt.fromString("2")),
  ];
  snapshot.save();

  const block = event.block;
  /** USDC vault */
  /** USDC vault price per share */
  const usdcVaultEntityId = `${block.number}:${
    block.timestamp
  }:${USDC_VAULT_ADDRESS.toHexString()}`;
  const usdcVaultPps = new VaultPricePerShare(usdcVaultEntityId);

  usdcVaultPps.block = block.number;
  usdcVaultPps.timestamp = block.timestamp;
  usdcVaultPps.vault = USDC_VAULT_ADDRESS.toHexString();

  usdcVaultPps.pricePerShare = aggregateVault.getVaultPPS(USDC_VAULT_ADDRESS);
  usdcVaultPps.save();

  /** TVL */

  const usdcVaultTvl = new VaultTVL(usdcVaultEntityId);

  usdcVaultTvl.block = block.number;
  usdcVaultTvl.timestamp = block.timestamp;
  usdcVaultTvl.vault = USDC_VAULT_ADDRESS.toHexString();
  usdcVaultTvl.tvl = aggregateVault.getVaultTVL(USDC_VAULT_ADDRESS);
  usdcVaultTvl.save();

  /** WETH vault */
  /** Price per share */
  const wethVaultEntityId = `${block.number}:${
    block.timestamp
  }:${WETH_VAULT_ADDRESS.toHexString()}`;
  const wethVaultPps = new VaultPricePerShare(wethVaultEntityId);

  wethVaultPps.block = block.number;
  wethVaultPps.timestamp = block.timestamp;
  wethVaultPps.vault = WETH_VAULT_ADDRESS.toHexString();
  wethVaultPps.pricePerShare = aggregateVault.getVaultPPS(WETH_VAULT_ADDRESS);
  wethVaultPps.save();

  /** TVL */
  const wethVaulTvl = new VaultTVL(wethVaultEntityId);

  wethVaulTvl.block = block.number;
  wethVaulTvl.timestamp = block.timestamp;
  wethVaulTvl.vault = WETH_VAULT_ADDRESS.toHexString();
  wethVaulTvl.tvl = aggregateVault.getVaultTVL(WETH_VAULT_ADDRESS);
  wethVaulTvl.save();

  /** WBTC vault */
  /** Price per share */
  const wbtcVaultEntityId = `${block.number}:${
    block.timestamp
  }:${WBTC_VAULT_ADDRESS.toHexString()}`;
  const wbtcVaultPps = new VaultPricePerShare(wbtcVaultEntityId);

  wbtcVaultPps.block = block.number;
  wbtcVaultPps.timestamp = block.timestamp;
  wbtcVaultPps.vault = WBTC_VAULT_ADDRESS.toHexString();
  wbtcVaultPps.pricePerShare = aggregateVault.getVaultPPS(WBTC_VAULT_ADDRESS);
  wbtcVaultPps.save();

  /** TVL */

  const wbtcVaultTvl = new VaultTVL(wbtcVaultEntityId);

  wbtcVaultTvl.block = block.number;
  wbtcVaultTvl.timestamp = block.timestamp;
  wbtcVaultTvl.vault = WBTC_VAULT_ADDRESS.toHexString();
  wbtcVaultTvl.tvl = aggregateVault.getVaultTVL(WBTC_VAULT_ADDRESS);
  wbtcVaultTvl.save();

  /** UNI vault */
  /** Price per share */
  const uniVaultEntityId = `${block.number}:${
    block.timestamp
  }:${UNI_VAULT_ADDRESS.toHexString()}`;
  const uniVaultPps = new VaultPricePerShare(uniVaultEntityId);

  uniVaultPps.block = block.number;
  uniVaultPps.timestamp = block.timestamp;
  uniVaultPps.vault = UNI_VAULT_ADDRESS.toHexString();
  uniVaultPps.pricePerShare = aggregateVault.getVaultPPS(UNI_VAULT_ADDRESS);
  uniVaultPps.save();

  /** TVL */

  const uniVaultTvl = new VaultTVL(uniVaultEntityId);

  uniVaultTvl.block = block.number;
  uniVaultTvl.timestamp = block.timestamp;
  uniVaultTvl.vault = UNI_VAULT_ADDRESS.toHexString();
  uniVaultTvl.tvl = aggregateVault.getVaultTVL(UNI_VAULT_ADDRESS);
  uniVaultTvl.save();

  /** LINK vault */
  /** Price per share */
  const linkVaultEntityId = `${block.number}:${
    block.timestamp
  }:${LINK_VAULT_ADDRESS.toHexString()}`;

  const linkVaultPps = new VaultPricePerShare(linkVaultEntityId);

  linkVaultPps.block = block.number;
  linkVaultPps.timestamp = block.timestamp;
  linkVaultPps.vault = LINK_VAULT_ADDRESS.toHexString();
  linkVaultPps.pricePerShare = aggregateVault.getVaultPPS(LINK_VAULT_ADDRESS);
  linkVaultPps.save();

  /** TVL */

  const linkVaultTvl = new VaultTVL(linkVaultEntityId);

  linkVaultTvl.block = block.number;
  linkVaultTvl.timestamp = block.timestamp;
  linkVaultTvl.vault = LINK_VAULT_ADDRESS.toHexString();
  linkVaultTvl.tvl = aggregateVault.getVaultTVL(LINK_VAULT_ADDRESS);
  linkVaultTvl.save();
}

export function handleRebalanceGlpPosition(
  event: RebalanceGlpPositionEvent
): void {
  let entity = new RebalanceGlpPosition(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  const aggregateVaultHelper = AggregateVaultHelper.bind(
    AGGREGATE_VAULT_HELPER_ADDRESS
  );
  const state = aggregateVaultHelper.getVaultState();
  entity.timestamp = event.block.timestamp;
  entity.block = event.block.number;
  entity.epoch = state.epoch;
  entity.vaultGlpAttributionBefore = event.params.vaultGlpAttributionBefore;
  entity.vaultGlpAttributionAfter = event.params.vaultGlpAttributionAfter;
  entity.targetGlpAllocation = event.params.targetGlpAllocation;
  entity.vaultGlpDeltaToExecute = event.params.vaultGlpDeltaToExecute;
  entity.totalVaultGlpDelta = event.params.totalVaultGlpDelta;
  entity.save();
}

export function handleSettleNettedPositionPnl(
  event: SettleNettedPositionPnlEvent
): void {
  let entity = new SettleNettedPositionPnl(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  const aggregateVaultHelper = AggregateVaultHelper.bind(
    AGGREGATE_VAULT_HELPER_ADDRESS
  );
  const state = aggregateVaultHelper.getVaultState();
  entity.timestamp = event.block.timestamp;
  entity.block = event.block.number;
  entity.epoch = state.epoch;
  entity.previousGlpAmount = event.params.previousGlpAmount;
  entity.settledGlpAmount = event.params.settledGlpAmount;
  entity.glpPnl = event.params.glpPnl;
  entity.dollarPnl = event.params.dollarPnl;
  entity.percentPriceChange = event.params.percentPriceChange;
  entity.save();
}

export function handleUpdateNettingCheckpointPrice(
  event: UpdateNettingCheckpointPriceEvent
): void {
  let entity = new UpdateNettingCheckpointPrice(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  const aggregateVaultHelper = AggregateVaultHelper.bind(
    AGGREGATE_VAULT_HELPER_ADDRESS
  );
  const state = aggregateVaultHelper.getVaultState();
  entity.timestamp = event.block.timestamp;
  entity.block = event.block.number;
  entity.epoch = state.epoch;
  entity.oldPrices_stable = event.params.oldPrices.stable;
  entity.oldPrices_eth = event.params.oldPrices.eth;
  entity.oldPrices_btc = event.params.oldPrices.btc;
  entity.oldPrices_link = event.params.oldPrices.link;
  entity.oldPrices_uni = event.params.oldPrices.uni;
  entity.newPrices_stable = event.params.newPrices.stable;
  entity.newPrices_eth = event.params.newPrices.eth;
  entity.newPrices_btc = event.params.newPrices.btc;
  entity.newPrices_link = event.params.newPrices.link;
  entity.newPrices_uni = event.params.newPrices.uni;
  entity.save();
}
