import { BigInt, ethereum } from "@graphprotocol/graph-ts";
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
  let lastPpsTimestamp = VaultPpsLastTimestamp.load("timestamp");

  if (block.number.mod(BigInt.fromString("500")).gt(BigInt.zero())) {
    return;
  }

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

    const aggregateVaultHelper = AggregateVaultHelper.bind(
      AGGREGATE_VAULT_HELPER_ADDRESS
    );

    /** USDC vault */
    /** USDC vault price per share */
    const usdcVaultEntityId = `${block.number}:${
      block.timestamp
    }:${USDC_VAULT_ADDRESS.toHexString()}`;
    const usdcVaultPps = new VaultPricePerShare(usdcVaultEntityId);

    usdcVaultPps.block = block.number;
    usdcVaultPps.timestamp = block.timestamp;
    usdcVaultPps.vault = USDC_VAULT_ADDRESS.toHexString();
    const usdcPpsTry = aggregateVaultHelper.try_getVaultPPS(USDC_VAULT_ADDRESS);
    usdcVaultPps.pricePerShare = usdcPpsTry.reverted
      ? BigInt.zero()
      : usdcPpsTry.value;
    usdcVaultPps.save();

    /** TVL */

    const usdcVaultTvl = new VaultTVL(usdcVaultEntityId);

    usdcVaultTvl.block = block.number;
    usdcVaultTvl.timestamp = block.timestamp;
    usdcVaultTvl.vault = USDC_VAULT_ADDRESS.toHexString();
    const usdcTvlTry = aggregateVaultHelper.try_getVaultTVL(USDC_VAULT_ADDRESS);
    usdcVaultTvl.tvl = usdcTvlTry.reverted ? BigInt.zero() : usdcTvlTry.value;
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
    const wethPpsTry = aggregateVaultHelper.try_getVaultPPS(WETH_VAULT_ADDRESS);
    wethVaultPps.pricePerShare = wethPpsTry.reverted
      ? BigInt.zero()
      : wethPpsTry.value;
    wethVaultPps.save();

    /** TVL */
    const wethVaulTvl = new VaultTVL(wethVaultEntityId);

    wethVaulTvl.block = block.number;
    wethVaulTvl.timestamp = block.timestamp;
    wethVaulTvl.vault = WETH_VAULT_ADDRESS.toHexString();
    const wethTvlTry = aggregateVaultHelper.try_getVaultTVL(WETH_VAULT_ADDRESS);
    wethVaulTvl.tvl = wethTvlTry.reverted ? BigInt.zero() : wethTvlTry.value;
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
    const wbtcPpsTry = aggregateVaultHelper.try_getVaultPPS(WBTC_VAULT_ADDRESS);
    wbtcVaultPps.pricePerShare = wbtcPpsTry.reverted
      ? BigInt.zero()
      : wbtcPpsTry.value;

    wbtcVaultPps.save();

    /** TVL */

    const wbtcVaultTvl = new VaultTVL(wbtcVaultEntityId);

    wbtcVaultTvl.block = block.number;
    wbtcVaultTvl.timestamp = block.timestamp;
    wbtcVaultTvl.vault = WBTC_VAULT_ADDRESS.toHexString();
    const wbtcTvlTry = aggregateVaultHelper.try_getVaultTVL(WBTC_VAULT_ADDRESS);
    wbtcVaultTvl.tvl = wbtcTvlTry.reverted ? BigInt.zero() : wbtcTvlTry.value;
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
    const uniPpsTry = aggregateVaultHelper.try_getVaultPPS(UNI_VAULT_ADDRESS);
    uniVaultPps.pricePerShare = uniPpsTry.reverted
      ? BigInt.zero()
      : uniPpsTry.value;

    uniVaultPps.save();

    /** TVL */

    const uniVaultTvl = new VaultTVL(uniVaultEntityId);

    uniVaultTvl.block = block.number;
    uniVaultTvl.timestamp = block.timestamp;
    uniVaultTvl.vault = UNI_VAULT_ADDRESS.toHexString();
    const uniTvlTry = aggregateVaultHelper.try_getVaultTVL(UNI_VAULT_ADDRESS);
    uniVaultTvl.tvl = uniTvlTry.reverted ? BigInt.zero() : uniTvlTry.value;
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
    const linkPpsTry = aggregateVaultHelper.try_getVaultPPS(LINK_VAULT_ADDRESS);
    linkVaultPps.pricePerShare = linkPpsTry.reverted
      ? BigInt.zero()
      : linkPpsTry.value;
    linkVaultPps.save();

    /** TVL */

    const linkVaultTvl = new VaultTVL(linkVaultEntityId);

    linkVaultTvl.block = block.number;
    linkVaultTvl.timestamp = block.timestamp;
    linkVaultTvl.vault = LINK_VAULT_ADDRESS.toHexString();
    const linkTvlTry = aggregateVaultHelper.try_getVaultTVL(LINK_VAULT_ADDRESS);
    linkVaultTvl.tvl = linkTvlTry.reverted ? BigInt.zero() : linkTvlTry.value;
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
    aggregateVaultHelper.getVaultPPS(USDC_VAULT_ADDRESS),
    aggregateVaultHelper.getVaultPPS(WETH_VAULT_ADDRESS),
    aggregateVaultHelper.getVaultPPS(WBTC_VAULT_ADDRESS),
    aggregateVaultHelper.getVaultPPS(LINK_VAULT_ADDRESS),
    aggregateVaultHelper.getVaultPPS(UNI_VAULT_ADDRESS),
  ];
  snapshot.vaultsTVL = [
    aggregateVaultHelper.getVaultTVL(USDC_VAULT_ADDRESS),
    aggregateVaultHelper.getVaultTVL(WETH_VAULT_ADDRESS),
    aggregateVaultHelper.getVaultTVL(WBTC_VAULT_ADDRESS),
    aggregateVaultHelper.getVaultTVL(LINK_VAULT_ADDRESS),
    aggregateVaultHelper.getVaultTVL(UNI_VAULT_ADDRESS),
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

  /** USDC vault */
  /** USDC vault price per share */
  const usdcVaultEntityId = `${event.block.number}:${
    event.block.timestamp
  }:${USDC_VAULT_ADDRESS.toHexString()}`;
  const usdcVaultPps = new VaultPricePerShare(usdcVaultEntityId);

  usdcVaultPps.block = event.block.number;
  usdcVaultPps.timestamp = event.block.timestamp;
  usdcVaultPps.vault = USDC_VAULT_ADDRESS.toHexString();
  const usdcPpsTry = aggregateVaultHelper.try_getVaultPPS(USDC_VAULT_ADDRESS);
  usdcVaultPps.pricePerShare = usdcPpsTry.reverted
    ? BigInt.zero()
    : usdcPpsTry.value;
  usdcVaultPps.save();

  /** TVL */

  const usdcVaultTvl = new VaultTVL(usdcVaultEntityId);

  usdcVaultTvl.block = event.block.number;
  usdcVaultTvl.timestamp = event.block.timestamp;
  usdcVaultTvl.vault = USDC_VAULT_ADDRESS.toHexString();
  const usdcTvlTry = aggregateVaultHelper.try_getVaultTVL(USDC_VAULT_ADDRESS);
  usdcVaultTvl.tvl = usdcTvlTry.reverted ? BigInt.zero() : usdcTvlTry.value;
  usdcVaultTvl.save();

  /** WETH vault */
  /** Price per share */
  const wethVaultEntityId = `${event.block.number}:${
    event.block.timestamp
  }:${WETH_VAULT_ADDRESS.toHexString()}`;
  const wethVaultPps = new VaultPricePerShare(wethVaultEntityId);

  wethVaultPps.block = event.block.number;
  wethVaultPps.timestamp = event.block.timestamp;
  wethVaultPps.vault = WETH_VAULT_ADDRESS.toHexString();
  const wethPpsTry = aggregateVaultHelper.try_getVaultPPS(WETH_VAULT_ADDRESS);
  wethVaultPps.pricePerShare = wethPpsTry.reverted
    ? BigInt.zero()
    : wethPpsTry.value;
  wethVaultPps.save();

  /** TVL */
  const wethVaulTvl = new VaultTVL(wethVaultEntityId);

  wethVaulTvl.block = event.block.number;
  wethVaulTvl.timestamp = event.block.timestamp;
  wethVaulTvl.vault = WETH_VAULT_ADDRESS.toHexString();
  const wethTvlTry = aggregateVaultHelper.try_getVaultTVL(WETH_VAULT_ADDRESS);
  wethVaulTvl.tvl = wethTvlTry.reverted ? BigInt.zero() : wethTvlTry.value;
  wethVaulTvl.save();

  /** WBTC vault */
  /** Price per share */
  const wbtcVaultEntityId = `${event.block.number}:${
    event.block.timestamp
  }:${WBTC_VAULT_ADDRESS.toHexString()}`;
  const wbtcVaultPps = new VaultPricePerShare(wbtcVaultEntityId);

  wbtcVaultPps.block = event.block.number;
  wbtcVaultPps.timestamp = event.block.timestamp;
  wbtcVaultPps.vault = WBTC_VAULT_ADDRESS.toHexString();
  const wbtcPpsTry = aggregateVaultHelper.try_getVaultPPS(WBTC_VAULT_ADDRESS);
  wbtcVaultPps.pricePerShare = wbtcPpsTry.reverted
    ? BigInt.zero()
    : wbtcPpsTry.value;

  wbtcVaultPps.save();

  /** TVL */

  const wbtcVaultTvl = new VaultTVL(wbtcVaultEntityId);

  wbtcVaultTvl.block = event.block.number;
  wbtcVaultTvl.timestamp = event.block.timestamp;
  wbtcVaultTvl.vault = WBTC_VAULT_ADDRESS.toHexString();
  const wbtcTvlTry = aggregateVaultHelper.try_getVaultTVL(WBTC_VAULT_ADDRESS);
  wbtcVaultTvl.tvl = wbtcTvlTry.reverted ? BigInt.zero() : wbtcTvlTry.value;
  wbtcVaultTvl.save();

  /** UNI vault */
  /** Price per share */
  const uniVaultEntityId = `${event.block.number}:${
    event.block.timestamp
  }:${UNI_VAULT_ADDRESS.toHexString()}`;
  const uniVaultPps = new VaultPricePerShare(uniVaultEntityId);

  uniVaultPps.block = event.block.number;
  uniVaultPps.timestamp = event.block.timestamp;
  uniVaultPps.vault = UNI_VAULT_ADDRESS.toHexString();
  const uniPpsTry = aggregateVaultHelper.try_getVaultPPS(UNI_VAULT_ADDRESS);
  uniVaultPps.pricePerShare = uniPpsTry.reverted
    ? BigInt.zero()
    : uniPpsTry.value;

  uniVaultPps.save();

  /** TVL */

  const uniVaultTvl = new VaultTVL(uniVaultEntityId);

  uniVaultTvl.block = event.block.number;
  uniVaultTvl.timestamp = event.block.timestamp;
  uniVaultTvl.vault = UNI_VAULT_ADDRESS.toHexString();
  const uniTvlTry = aggregateVaultHelper.try_getVaultTVL(UNI_VAULT_ADDRESS);
  uniVaultTvl.tvl = uniTvlTry.reverted ? BigInt.zero() : uniTvlTry.value;
  uniVaultTvl.save();

  /** LINK vault */
  /** Price per share */
  const linkVaultEntityId = `${event.block.number}:${
    event.block.timestamp
  }:${LINK_VAULT_ADDRESS.toHexString()}`;

  const linkVaultPps = new VaultPricePerShare(linkVaultEntityId);

  linkVaultPps.block = event.block.number;
  linkVaultPps.timestamp = event.block.timestamp;
  linkVaultPps.vault = LINK_VAULT_ADDRESS.toHexString();
  const linkPpsTry = aggregateVaultHelper.try_getVaultPPS(LINK_VAULT_ADDRESS);
  linkVaultPps.pricePerShare = linkPpsTry.reverted
    ? BigInt.zero()
    : linkPpsTry.value;
  linkVaultPps.save();

  /** TVL */

  const linkVaultTvl = new VaultTVL(linkVaultEntityId);

  linkVaultTvl.block = event.block.number;
  linkVaultTvl.timestamp = event.block.timestamp;
  linkVaultTvl.vault = LINK_VAULT_ADDRESS.toHexString();
  const linkTvlTry = aggregateVaultHelper.try_getVaultTVL(LINK_VAULT_ADDRESS);
  linkVaultTvl.tvl = linkTvlTry.reverted ? BigInt.zero() : linkTvlTry.value;
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
    aggregateVaultHelper.getVaultPPS(USDC_VAULT_ADDRESS),
    aggregateVaultHelper.getVaultPPS(WETH_VAULT_ADDRESS),
    aggregateVaultHelper.getVaultPPS(WBTC_VAULT_ADDRESS),
    aggregateVaultHelper.getVaultPPS(LINK_VAULT_ADDRESS),
    aggregateVaultHelper.getVaultPPS(UNI_VAULT_ADDRESS),
  ];
  snapshot.vaultsTVL = [
    aggregateVaultHelper.getVaultTVL(USDC_VAULT_ADDRESS),
    aggregateVaultHelper.getVaultTVL(WETH_VAULT_ADDRESS),
    aggregateVaultHelper.getVaultTVL(WBTC_VAULT_ADDRESS),
    aggregateVaultHelper.getVaultTVL(LINK_VAULT_ADDRESS),
    aggregateVaultHelper.getVaultTVL(UNI_VAULT_ADDRESS),
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

  /** USDC vault */
  /** USDC vault price per share */
  const usdcVaultEntityId = `${event.block.number}:${
    event.block.timestamp
  }:${USDC_VAULT_ADDRESS.toHexString()}`;
  const usdcVaultPps = new VaultPricePerShare(usdcVaultEntityId);

  usdcVaultPps.block = event.block.number;
  usdcVaultPps.timestamp = event.block.timestamp;
  usdcVaultPps.vault = USDC_VAULT_ADDRESS.toHexString();
  const usdcPpsTry = aggregateVaultHelper.try_getVaultPPS(USDC_VAULT_ADDRESS);
  usdcVaultPps.pricePerShare = usdcPpsTry.reverted
    ? BigInt.zero()
    : usdcPpsTry.value;
  usdcVaultPps.save();

  /** TVL */

  const usdcVaultTvl = new VaultTVL(usdcVaultEntityId);

  usdcVaultTvl.block = event.block.number;
  usdcVaultTvl.timestamp = event.block.timestamp;
  usdcVaultTvl.vault = USDC_VAULT_ADDRESS.toHexString();
  const usdcTvlTry = aggregateVaultHelper.try_getVaultTVL(USDC_VAULT_ADDRESS);
  usdcVaultTvl.tvl = usdcTvlTry.reverted ? BigInt.zero() : usdcTvlTry.value;
  usdcVaultTvl.save();

  /** WETH vault */
  /** Price per share */
  const wethVaultEntityId = `${event.block.number}:${
    event.block.timestamp
  }:${WETH_VAULT_ADDRESS.toHexString()}`;
  const wethVaultPps = new VaultPricePerShare(wethVaultEntityId);

  wethVaultPps.block = event.block.number;
  wethVaultPps.timestamp = event.block.timestamp;
  wethVaultPps.vault = WETH_VAULT_ADDRESS.toHexString();
  const wethPpsTry = aggregateVaultHelper.try_getVaultPPS(WETH_VAULT_ADDRESS);
  wethVaultPps.pricePerShare = wethPpsTry.reverted
    ? BigInt.zero()
    : wethPpsTry.value;
  wethVaultPps.save();

  /** TVL */
  const wethVaulTvl = new VaultTVL(wethVaultEntityId);

  wethVaulTvl.block = event.block.number;
  wethVaulTvl.timestamp = event.block.timestamp;
  wethVaulTvl.vault = WETH_VAULT_ADDRESS.toHexString();
  const wethTvlTry = aggregateVaultHelper.try_getVaultTVL(WETH_VAULT_ADDRESS);
  wethVaulTvl.tvl = wethTvlTry.reverted ? BigInt.zero() : wethTvlTry.value;
  wethVaulTvl.save();

  /** WBTC vault */
  /** Price per share */
  const wbtcVaultEntityId = `${event.block.number}:${
    event.block.timestamp
  }:${WBTC_VAULT_ADDRESS.toHexString()}`;
  const wbtcVaultPps = new VaultPricePerShare(wbtcVaultEntityId);

  wbtcVaultPps.block = event.block.number;
  wbtcVaultPps.timestamp = event.block.timestamp;
  wbtcVaultPps.vault = WBTC_VAULT_ADDRESS.toHexString();
  const wbtcPpsTry = aggregateVaultHelper.try_getVaultPPS(WBTC_VAULT_ADDRESS);
  wbtcVaultPps.pricePerShare = wbtcPpsTry.reverted
    ? BigInt.zero()
    : wbtcPpsTry.value;

  wbtcVaultPps.save();

  /** TVL */

  const wbtcVaultTvl = new VaultTVL(wbtcVaultEntityId);

  wbtcVaultTvl.block = event.block.number;
  wbtcVaultTvl.timestamp = event.block.timestamp;
  wbtcVaultTvl.vault = WBTC_VAULT_ADDRESS.toHexString();
  const wbtcTvlTry = aggregateVaultHelper.try_getVaultTVL(WBTC_VAULT_ADDRESS);
  wbtcVaultTvl.tvl = wbtcTvlTry.reverted ? BigInt.zero() : wbtcTvlTry.value;
  wbtcVaultTvl.save();

  /** UNI vault */
  /** Price per share */
  const uniVaultEntityId = `${event.block.number}:${
    event.block.timestamp
  }:${UNI_VAULT_ADDRESS.toHexString()}`;
  const uniVaultPps = new VaultPricePerShare(uniVaultEntityId);

  uniVaultPps.block = event.block.number;
  uniVaultPps.timestamp = event.block.timestamp;
  uniVaultPps.vault = UNI_VAULT_ADDRESS.toHexString();
  const uniPpsTry = aggregateVaultHelper.try_getVaultPPS(UNI_VAULT_ADDRESS);
  uniVaultPps.pricePerShare = uniPpsTry.reverted
    ? BigInt.zero()
    : uniPpsTry.value;

  uniVaultPps.save();

  /** TVL */

  const uniVaultTvl = new VaultTVL(uniVaultEntityId);

  uniVaultTvl.block = event.block.number;
  uniVaultTvl.timestamp = event.block.timestamp;
  uniVaultTvl.vault = UNI_VAULT_ADDRESS.toHexString();
  const uniTvlTry = aggregateVaultHelper.try_getVaultTVL(UNI_VAULT_ADDRESS);
  uniVaultTvl.tvl = uniTvlTry.reverted ? BigInt.zero() : uniTvlTry.value;
  uniVaultTvl.save();

  /** LINK vault */
  /** Price per share */
  const linkVaultEntityId = `${event.block.number}:${
    event.block.timestamp
  }:${LINK_VAULT_ADDRESS.toHexString()}`;

  const linkVaultPps = new VaultPricePerShare(linkVaultEntityId);

  linkVaultPps.block = event.block.number;
  linkVaultPps.timestamp = event.block.timestamp;
  linkVaultPps.vault = LINK_VAULT_ADDRESS.toHexString();
  const linkPpsTry = aggregateVaultHelper.try_getVaultPPS(LINK_VAULT_ADDRESS);
  linkVaultPps.pricePerShare = linkPpsTry.reverted
    ? BigInt.zero()
    : linkPpsTry.value;
  linkVaultPps.save();

  /** TVL */

  const linkVaultTvl = new VaultTVL(linkVaultEntityId);

  linkVaultTvl.block = event.block.number;
  linkVaultTvl.timestamp = event.block.timestamp;
  linkVaultTvl.vault = LINK_VAULT_ADDRESS.toHexString();
  const linkTvlTry = aggregateVaultHelper.try_getVaultTVL(LINK_VAULT_ADDRESS);
  linkVaultTvl.tvl = linkTvlTry.reverted ? BigInt.zero() : linkTvlTry.value;
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
