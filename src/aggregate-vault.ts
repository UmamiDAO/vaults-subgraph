import {
  BigDecimal,
  BigInt,
  Bytes,
  ethereum,
  log,
} from "@graphprotocol/graph-ts";
import {
  CloseRebalance as CloseRebalanceEvent,
  CollectVaultFees as CollectVaultFeesEvent,
  CompoundDistributeYield as CompoundDistributeYieldEvent,
  Cycle as CycleEvent,
  OpenRebalance as OpenRebalanceEvent,
  RebalanceGlpPosition as RebalanceGlpPositionEvent,
  SettleNettedPositionPnl as SettleNettedPositionPnlEvent,
  UpdateNettingCheckpointPrice as UpdateNettingCheckpointPriceEvent,
} from "../generated/AggregateVault/AggregateVaultHelper";
import { AggregateVault } from "../generated/AggregateVault/AggregateVault";
import { GmxVault } from "../generated/AggregateVault/GmxVault";
import { Manager } from "../generated/AggregateVault/Manager";
import { GlpAssetVault } from "../generated/AggregateVault/GlpAssetVault";
import {
  CloseRebalance,
  CompoundDistributeYield,
  Cycle,
  GmxState,
  OpenRebalance,
  RebalanceGlpPosition,
  RebalanceSnapshot,
  SettleNettedPositionPnl,
  UpdateNettingCheckpointPrice,
  VaultFeesCollection,
  VaultPpsLastTimestampQuick,
  VaultPpsLastTimestampSlow,
  VaultPricePerShare,
  VaultTotalSupply,
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
  let lastPpsTimestampQuick = VaultPpsLastTimestampQuick.load(
    "timestamp-quick"
  );
  /** Wait a minute to register a new PPS */
  if (
    lastPpsTimestampQuick == null ||
    block.timestamp.gt(
      lastPpsTimestampQuick.timestamp.plus(BigInt.fromString("60"))
    )
  ) {
    const event = "quick";
    if (lastPpsTimestampQuick == null) {
      lastPpsTimestampQuick = new VaultPpsLastTimestampQuick("timestamp-quick");
    }
    lastPpsTimestampQuick.timestamp = block.timestamp;
    lastPpsTimestampQuick.save();

    const aggregateVault = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);
    const gmxVaultContract = GmxVault.bind(GMX_VAULT_ADDRESS);
    const glpManagerContract = Manager.bind(GLP_HANDLER_ADDRESS);
    const usdcVaultContract = GlpAssetVault.bind(USDC_VAULT_ADDRESS);
    const wethVaultContract = GlpAssetVault.bind(WETH_VAULT_ADDRESS);
    const wbtcVaultContract = GlpAssetVault.bind(WBTC_VAULT_ADDRESS);
    const linkVaultContract = GlpAssetVault.bind(LINK_VAULT_ADDRESS);
    const uniVaultContract = GlpAssetVault.bind(UNI_VAULT_ADDRESS);

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
    const assetsPrices = [
      usdcMinPrice.plus(usdcMaxPrice).div(BigInt.fromString("2")),
      wethMinPrice.plus(wethMaxPrice).div(BigInt.fromString("2")),
      wbtcMinPrice.plus(wbtcMaxPrice).div(BigInt.fromString("2")),
      linkMinPrice.plus(linkMaxPrice).div(BigInt.fromString("2")),
      uniMinPrice.plus(uniMaxPrice).div(BigInt.fromString("2")),
    ];

    const rebalanceState = aggregateVault.getRebalanceState();

    const gmxState = new GmxState(`${block.number}`);
    gmxState.block = block.number;
    gmxState.timestamp = block.timestamp;
    gmxState.event = event;
    gmxState.assetsPrices = assetsPrices;
    gmxState.glpPrice = glpManagerContract.getGlpPrice1();
    gmxState.glpComposition = rebalanceState.getGlpComposition();

    gmxState.reservedAmounts = [
      BigInt.zero(),
      gmxVaultContract.reservedAmounts(WETH_ADDRESS),
      gmxVaultContract.reservedAmounts(WBTC_ADDRESS),
      gmxVaultContract.reservedAmounts(LINK_ADDRESS),
      gmxVaultContract.reservedAmounts(UNI_ADDRESS),
    ];
    gmxState.guaranteedUsd = [
      BigInt.zero(),
      gmxVaultContract.guaranteedUsd(WETH_ADDRESS),
      gmxVaultContract.guaranteedUsd(WBTC_ADDRESS),
      gmxVaultContract.guaranteedUsd(LINK_ADDRESS),
      gmxVaultContract.guaranteedUsd(UNI_ADDRESS),
    ];
    gmxState.shortsAveragePrices = [
      BigInt.zero(),
      gmxVaultContract.globalShortAveragePrices(WETH_ADDRESS),
      gmxVaultContract.globalShortAveragePrices(WBTC_ADDRESS),
      gmxVaultContract.globalShortAveragePrices(LINK_ADDRESS),
      gmxVaultContract.globalShortAveragePrices(UNI_ADDRESS),
    ];
    gmxState.globalShortSizes = [
      BigInt.zero(),
      gmxVaultContract.globalShortSizes(WETH_ADDRESS),
      gmxVaultContract.globalShortSizes(WBTC_ADDRESS),
      gmxVaultContract.globalShortSizes(LINK_ADDRESS),
      gmxVaultContract.globalShortSizes(UNI_ADDRESS),
    ];

    gmxState.save();

    /** USDC vault */
    /** USDC vault price per share */
    const usdcVaultEntityId = `${block.number}:${
      block.timestamp
    }:${USDC_VAULT_ADDRESS.toHexString()}`;
    const usdcVaultPps = new VaultPricePerShare(usdcVaultEntityId);

    usdcVaultPps.block = block.number;
    usdcVaultPps.timestamp = block.timestamp;
    usdcVaultPps.event = event;
    usdcVaultPps.txHash = "";
    usdcVaultPps.vault = USDC_VAULT_ADDRESS.toHexString();
    const usdcVaultPpsTry = aggregateVault.try_getVaultPPS(USDC_VAULT_ADDRESS);
    if (usdcVaultPpsTry.reverted) {
      log.info("REVERT_PPS handleBlock USDC at block {} ", [
        block.number.toString(),
      ]);
    }
    usdcVaultPps.pricePerShare = usdcVaultPpsTry.reverted
      ? BigInt.zero()
      : usdcVaultPpsTry.value;
    usdcVaultPps.save();

    /** TVL */

    const usdcVaultTvl = new VaultTVL(usdcVaultEntityId);

    usdcVaultTvl.block = block.number;
    usdcVaultTvl.timestamp = block.timestamp;
    usdcVaultTvl.event = event;
    usdcVaultTvl.txHash = "";
    usdcVaultTvl.vault = USDC_VAULT_ADDRESS.toHexString();
    const usdcVaultTVLTry = aggregateVault.try_getVaultTVL(USDC_VAULT_ADDRESS);
    if (usdcVaultTVLTry.reverted) {
      log.info("REVERT_TVL handleBlock USDC at block {} ", [
        block.number.toString(),
      ]);
    }
    usdcVaultTvl.tvl = usdcVaultTVLTry.reverted
      ? BigInt.zero()
      : usdcVaultTVLTry.value;
    usdcVaultTvl.save();

    /** Total supply */

    const usdcTotalSupply = new VaultTotalSupply(usdcVaultEntityId);

    usdcTotalSupply.block = block.number;
    usdcTotalSupply.timestamp = block.timestamp;
    usdcTotalSupply.event = event;
    usdcTotalSupply.txHash = "";
    usdcTotalSupply.vault = USDC_VAULT_ADDRESS.toHexString();
    usdcTotalSupply.totalSupply = usdcVaultContract.totalSupply();
    usdcTotalSupply.save();

    /** WETH vault */
    /** Price per share */
    const wethVaultEntityId = `${block.number}:${
      block.timestamp
    }:${WETH_VAULT_ADDRESS.toHexString()}`;
    const wethVaultPps = new VaultPricePerShare(wethVaultEntityId);

    wethVaultPps.block = block.number;
    wethVaultPps.timestamp = block.timestamp;
    wethVaultPps.event = event;
    wethVaultPps.txHash = "";
    wethVaultPps.vault = WETH_VAULT_ADDRESS.toHexString();
    const wethVaultPpsTry = aggregateVault.try_getVaultPPS(WETH_VAULT_ADDRESS);
    if (wethVaultPpsTry.reverted) {
      log.info("REVERT_PPS handleBlock wETH at block {} ", [
        block.number.toString(),
      ]);
    }
    wethVaultPps.pricePerShare = wethVaultPpsTry.reverted
      ? BigInt.zero()
      : wethVaultPpsTry.value;
    wethVaultPps.save();

    /** TVL */
    const wethVaulTvl = new VaultTVL(wethVaultEntityId);

    wethVaulTvl.block = block.number;
    wethVaulTvl.timestamp = block.timestamp;
    wethVaulTvl.event = event;
    wethVaulTvl.txHash = "";
    wethVaulTvl.vault = WETH_VAULT_ADDRESS.toHexString();
    const wethVaultTVLTry = aggregateVault.try_getVaultTVL(WETH_VAULT_ADDRESS);
    if (wethVaultTVLTry.reverted) {
      log.info("REVERT_TVL handleBlock wETH at block {} ", [
        block.number.toString(),
      ]);
    }
    wethVaulTvl.tvl = wethVaultTVLTry.reverted
      ? BigInt.zero()
      : wethVaultTVLTry.value;
    wethVaulTvl.save();

    /** Total supply */

    const wethTotalSupply = new VaultTotalSupply(wethVaultEntityId);

    wethTotalSupply.block = block.number;
    wethTotalSupply.timestamp = block.timestamp;
    wethTotalSupply.event = event;
    wethTotalSupply.txHash = "";
    wethTotalSupply.vault = WETH_VAULT_ADDRESS.toHexString();
    wethTotalSupply.totalSupply = wethVaultContract.totalSupply();
    wethTotalSupply.save();

    /** WBTC vault */
    /** Price per share */
    const wbtcVaultEntityId = `${block.number}:${
      block.timestamp
    }:${WBTC_VAULT_ADDRESS.toHexString()}`;
    const wbtcVaultPps = new VaultPricePerShare(wbtcVaultEntityId);

    wbtcVaultPps.block = block.number;
    wbtcVaultPps.timestamp = block.timestamp;
    wbtcVaultPps.event = event;
    wbtcVaultPps.txHash = "";
    wbtcVaultPps.vault = WBTC_VAULT_ADDRESS.toHexString();
    const wbtcVaultPpsTry = aggregateVault.try_getVaultPPS(WBTC_VAULT_ADDRESS);
    if (wbtcVaultPpsTry.reverted) {
      log.info("REVERT_PPS handleBlock wBTC at block {} ", [
        block.number.toString(),
      ]);
    }
    wbtcVaultPps.pricePerShare = wbtcVaultPpsTry.reverted
      ? BigInt.zero()
      : wbtcVaultPpsTry.value;
    wbtcVaultPps.save();

    /** TVL */

    const wbtcVaultTvl = new VaultTVL(wbtcVaultEntityId);

    wbtcVaultTvl.block = block.number;
    wbtcVaultTvl.timestamp = block.timestamp;
    wbtcVaultTvl.event = event;
    wbtcVaultTvl.txHash = "";
    wbtcVaultTvl.vault = WBTC_VAULT_ADDRESS.toHexString();
    const wbtcVaultTVLTry = aggregateVault.try_getVaultTVL(WBTC_VAULT_ADDRESS);
    if (wbtcVaultTVLTry.reverted) {
      log.info("REVERT_TVL handleBlock wBTC at block {} ", [
        block.number.toString(),
      ]);
    }
    wbtcVaultTvl.tvl = wbtcVaultTVLTry.reverted
      ? BigInt.zero()
      : wbtcVaultTVLTry.value;
    wbtcVaultTvl.save();

    /** Total supply */

    const wbtcTotalSupply = new VaultTotalSupply(wbtcVaultEntityId);

    wbtcTotalSupply.block = block.number;
    wbtcTotalSupply.timestamp = block.timestamp;
    wbtcTotalSupply.event = event;
    wbtcTotalSupply.txHash = "";
    wbtcTotalSupply.vault = WBTC_VAULT_ADDRESS.toHexString();
    wbtcTotalSupply.totalSupply = wbtcVaultContract.totalSupply();
    wbtcTotalSupply.save();

    /** LINK vault */
    /** Price per share */
    const linkVaultEntityId = `${block.number}:${
      block.timestamp
    }:${LINK_VAULT_ADDRESS.toHexString()}`;

    const linkVaultPps = new VaultPricePerShare(linkVaultEntityId);

    linkVaultPps.block = block.number;
    linkVaultPps.timestamp = block.timestamp;
    linkVaultPps.event = event;
    linkVaultPps.txHash = "";
    linkVaultPps.vault = LINK_VAULT_ADDRESS.toHexString();
    const linkVaultPpsTry = aggregateVault.try_getVaultPPS(LINK_VAULT_ADDRESS);
    if (linkVaultPpsTry.reverted) {
      log.info("REVERT_PPS handleBlock LINK at block {} ", [
        block.number.toString(),
      ]);
    }
    linkVaultPps.pricePerShare = linkVaultPpsTry.reverted
      ? BigInt.zero()
      : linkVaultPpsTry.value;
    linkVaultPps.save();

    /** TVL */

    const linkVaultTvl = new VaultTVL(linkVaultEntityId);

    linkVaultTvl.block = block.number;
    linkVaultTvl.timestamp = block.timestamp;
    linkVaultTvl.event = event;
    linkVaultTvl.txHash = "";
    linkVaultTvl.vault = LINK_VAULT_ADDRESS.toHexString();
    const linkVaultTVLTry = aggregateVault.try_getVaultTVL(LINK_VAULT_ADDRESS);
    if (linkVaultTVLTry.reverted) {
      log.info("REVERT_TVL handleBlock LINK at block {} ", [
        block.number.toString(),
      ]);
    }
    linkVaultTvl.tvl = linkVaultTVLTry.reverted
      ? BigInt.zero()
      : linkVaultTVLTry.value;
    linkVaultTvl.save();

    const linkTotalSupply = new VaultTotalSupply(linkVaultEntityId);

    linkTotalSupply.block = block.number;
    linkTotalSupply.timestamp = block.timestamp;
    linkTotalSupply.event = event;
    linkTotalSupply.txHash = "";
    linkTotalSupply.vault = LINK_VAULT_ADDRESS.toHexString();
    linkTotalSupply.totalSupply = linkVaultContract.totalSupply();
    linkTotalSupply.save();

    /** UNI vault */
    /** Price per share */
    const uniVaultEntityId = `${block.number}:${
      block.timestamp
    }:${UNI_VAULT_ADDRESS.toHexString()}`;
    const uniVaultPps = new VaultPricePerShare(uniVaultEntityId);

    uniVaultPps.block = block.number;
    uniVaultPps.timestamp = block.timestamp;
    uniVaultPps.event = event;
    uniVaultPps.txHash = "";
    uniVaultPps.vault = UNI_VAULT_ADDRESS.toHexString();
    const uniVaultPpsTry = aggregateVault.try_getVaultPPS(UNI_VAULT_ADDRESS);
    if (uniVaultPpsTry.reverted) {
      log.info("REVERT_PPS handleBlock UNI at block {} ", [
        block.number.toString(),
      ]);
    }
    uniVaultPps.pricePerShare = uniVaultPpsTry.reverted
      ? BigInt.zero()
      : uniVaultPpsTry.value;
    uniVaultPps.save();

    /** TVL */

    const uniVaultTvl = new VaultTVL(uniVaultEntityId);

    uniVaultTvl.block = block.number;
    uniVaultTvl.timestamp = block.timestamp;
    uniVaultTvl.event = event;
    uniVaultTvl.vault = UNI_VAULT_ADDRESS.toHexString();
    uniVaultTvl.txHash = "";
    const uniVaultTVLTry = aggregateVault.try_getVaultTVL(UNI_VAULT_ADDRESS);
    if (uniVaultTVLTry.reverted) {
      log.info("REVERT_TVL handleBlock UNI at block {} ", [
        block.number.toString(),
      ]);
    }
    uniVaultTvl.tvl = uniVaultTVLTry.reverted
      ? BigInt.zero()
      : uniVaultTVLTry.value;
    uniVaultTvl.save();

    /** Total supply */

    const uniTotalSupply = new VaultTotalSupply(uniVaultEntityId);

    uniTotalSupply.block = block.number;
    uniTotalSupply.timestamp = block.timestamp;
    uniTotalSupply.event = event;
    uniTotalSupply.txHash = "";
    uniTotalSupply.vault = UNI_VAULT_ADDRESS.toHexString();
    uniTotalSupply.totalSupply = uniVaultContract.totalSupply();
    uniTotalSupply.save();
  }

  let lastPpsTimestampSlow = VaultPpsLastTimestampSlow.load("timestamp-slow");
  /** Wait an hour to register a new PPS */
  if (
    lastPpsTimestampSlow == null ||
    block.timestamp.gt(
      lastPpsTimestampSlow.timestamp.plus(BigInt.fromString("3600"))
    )
  ) {
    const event = "slow";
    if (lastPpsTimestampSlow == null) {
      lastPpsTimestampSlow = new VaultPpsLastTimestampSlow("timestamp-slow");
    }
    lastPpsTimestampSlow.timestamp = block.timestamp;
    lastPpsTimestampSlow.save();

    const aggregateVault = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);

    const gmxVaultContract = GmxVault.bind(GMX_VAULT_ADDRESS);
    const glpManagerContract = Manager.bind(GLP_HANDLER_ADDRESS);

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
    const assetsPrices = [
      usdcMinPrice.plus(usdcMaxPrice).div(BigInt.fromString("2")),
      wethMinPrice.plus(wethMaxPrice).div(BigInt.fromString("2")),
      wbtcMinPrice.plus(wbtcMaxPrice).div(BigInt.fromString("2")),
      linkMinPrice.plus(linkMaxPrice).div(BigInt.fromString("2")),
      uniMinPrice.plus(uniMaxPrice).div(BigInt.fromString("2")),
    ];

    const rebalanceState = aggregateVault.getRebalanceState();
    const gmxState = new GmxState(`${block.number}`);
    gmxState.block = block.number;
    gmxState.timestamp = block.timestamp;
    gmxState.event = event;
    gmxState.assetsPrices = assetsPrices;
    gmxState.glpPrice = glpManagerContract.getGlpPrice1();
    gmxState.glpComposition = rebalanceState.getGlpComposition();

    gmxState.reservedAmounts = [
      BigInt.zero(),
      gmxVaultContract.reservedAmounts(WETH_ADDRESS),
      gmxVaultContract.reservedAmounts(WBTC_ADDRESS),
      gmxVaultContract.reservedAmounts(LINK_ADDRESS),
      gmxVaultContract.reservedAmounts(UNI_ADDRESS),
    ];
    gmxState.guaranteedUsd = [
      BigInt.zero(),
      gmxVaultContract.guaranteedUsd(WETH_ADDRESS),
      gmxVaultContract.guaranteedUsd(WBTC_ADDRESS),
      gmxVaultContract.guaranteedUsd(LINK_ADDRESS),
      gmxVaultContract.guaranteedUsd(UNI_ADDRESS),
    ];
    gmxState.shortsAveragePrices = [
      BigInt.zero(),
      gmxVaultContract.globalShortAveragePrices(WETH_ADDRESS),
      gmxVaultContract.globalShortAveragePrices(WBTC_ADDRESS),
      gmxVaultContract.globalShortAveragePrices(LINK_ADDRESS),
      gmxVaultContract.globalShortAveragePrices(UNI_ADDRESS),
    ];
    gmxState.globalShortSizes = [
      BigInt.zero(),
      gmxVaultContract.globalShortSizes(WETH_ADDRESS),
      gmxVaultContract.globalShortSizes(WBTC_ADDRESS),
      gmxVaultContract.globalShortSizes(LINK_ADDRESS),
      gmxVaultContract.globalShortSizes(UNI_ADDRESS),
    ];

    gmxState.save();

    /** USDC vault */
    /** USDC vault price per share */
    const usdcVaultEntityId = `${block.number}:${
      block.timestamp
    }:${USDC_VAULT_ADDRESS.toHexString()}`;
    const usdcVaultPps = new VaultPricePerShare(usdcVaultEntityId);

    usdcVaultPps.block = block.number;
    usdcVaultPps.timestamp = block.timestamp;
    usdcVaultPps.event = event;
    usdcVaultPps.txHash = "";
    usdcVaultPps.vault = USDC_VAULT_ADDRESS.toHexString();
    const usdcVaultPpsTry = aggregateVault.try_getVaultPPS(USDC_VAULT_ADDRESS);
    if (usdcVaultPpsTry.reverted) {
      log.info("REVERT_PPS handleBlock USDC at block {} ", [
        block.number.toString(),
      ]);
    }
    usdcVaultPps.pricePerShare = usdcVaultPpsTry.reverted
      ? BigInt.zero()
      : usdcVaultPpsTry.value;
    usdcVaultPps.save();

    /** TVL */

    const usdcVaultTvl = new VaultTVL(usdcVaultEntityId);

    usdcVaultTvl.block = block.number;
    usdcVaultTvl.timestamp = block.timestamp;
    usdcVaultTvl.event = event;
    usdcVaultTvl.txHash = "";
    usdcVaultTvl.vault = USDC_VAULT_ADDRESS.toHexString();
    const usdcVaultTVLTry = aggregateVault.try_getVaultTVL(USDC_VAULT_ADDRESS);
    if (usdcVaultTVLTry.reverted) {
      log.info("REVERT_TVL handleBlock USDC at block {} ", [
        block.number.toString(),
      ]);
    }
    usdcVaultTvl.tvl = usdcVaultTVLTry.reverted
      ? BigInt.zero()
      : usdcVaultTVLTry.value;
    usdcVaultTvl.save();

    /** WETH vault */
    /** Price per share */
    const wethVaultEntityId = `${block.number}:${
      block.timestamp
    }:${WETH_VAULT_ADDRESS.toHexString()}`;
    const wethVaultPps = new VaultPricePerShare(wethVaultEntityId);

    wethVaultPps.block = block.number;
    wethVaultPps.timestamp = block.timestamp;
    wethVaultPps.event = event;
    wethVaultPps.txHash = "";
    wethVaultPps.vault = WETH_VAULT_ADDRESS.toHexString();
    const wethVaultPpsTry = aggregateVault.try_getVaultPPS(WETH_VAULT_ADDRESS);
    if (wethVaultPpsTry.reverted) {
      log.info("REVERT_PPS handleBlock wETH at block {} ", [
        block.number.toString(),
      ]);
    }
    wethVaultPps.pricePerShare = wethVaultPpsTry.reverted
      ? BigInt.zero()
      : wethVaultPpsTry.value;
    wethVaultPps.save();

    /** TVL */
    const wethVaulTvl = new VaultTVL(wethVaultEntityId);

    wethVaulTvl.block = block.number;
    wethVaulTvl.timestamp = block.timestamp;
    wethVaulTvl.event = event;
    wethVaulTvl.txHash = "";
    wethVaulTvl.vault = WETH_VAULT_ADDRESS.toHexString();
    const wethVaultTVLTry = aggregateVault.try_getVaultTVL(WETH_VAULT_ADDRESS);
    if (wethVaultTVLTry.reverted) {
      log.info("REVERT_TVL handleBlock wETH at block {} ", [
        block.number.toString(),
      ]);
    }
    wethVaulTvl.tvl = wethVaultTVLTry.reverted
      ? BigInt.zero()
      : wethVaultTVLTry.value;
    wethVaulTvl.save();

    /** WBTC vault */
    /** Price per share */
    const wbtcVaultEntityId = `${block.number}:${
      block.timestamp
    }:${WBTC_VAULT_ADDRESS.toHexString()}`;
    const wbtcVaultPps = new VaultPricePerShare(wbtcVaultEntityId);

    wbtcVaultPps.block = block.number;
    wbtcVaultPps.timestamp = block.timestamp;
    wbtcVaultPps.event = event;
    wbtcVaultPps.txHash = "";
    wbtcVaultPps.vault = WBTC_VAULT_ADDRESS.toHexString();
    const wbtcVaultPpsTry = aggregateVault.try_getVaultPPS(WBTC_VAULT_ADDRESS);
    if (wbtcVaultPpsTry.reverted) {
      log.info("REVERT_PPS handleBlock wBTC at block {} ", [
        block.number.toString(),
      ]);
    }
    wbtcVaultPps.pricePerShare = wbtcVaultPpsTry.reverted
      ? BigInt.zero()
      : wbtcVaultPpsTry.value;
    wbtcVaultPps.save();

    /** TVL */

    const wbtcVaultTvl = new VaultTVL(wbtcVaultEntityId);

    wbtcVaultTvl.block = block.number;
    wbtcVaultTvl.timestamp = block.timestamp;
    wbtcVaultTvl.event = event;
    wbtcVaultTvl.txHash = "";
    wbtcVaultTvl.vault = WBTC_VAULT_ADDRESS.toHexString();
    const wbtcVaultTVLTry = aggregateVault.try_getVaultTVL(WBTC_VAULT_ADDRESS);
    if (wbtcVaultTVLTry.reverted) {
      log.info("REVERT_TVL handleBlock wBTC at block {} ", [
        block.number.toString(),
      ]);
    }
    wbtcVaultTvl.tvl = wbtcVaultTVLTry.reverted
      ? BigInt.zero()
      : wbtcVaultTVLTry.value;
    wbtcVaultTvl.save();

    /** LINK vault */
    /** Price per share */
    const linkVaultEntityId = `${block.number}:${
      block.timestamp
    }:${LINK_VAULT_ADDRESS.toHexString()}`;

    const linkVaultPps = new VaultPricePerShare(linkVaultEntityId);

    linkVaultPps.block = block.number;
    linkVaultPps.timestamp = block.timestamp;
    linkVaultPps.event = event;
    linkVaultPps.txHash = "";
    linkVaultPps.vault = LINK_VAULT_ADDRESS.toHexString();
    const linkVaultPpsTry = aggregateVault.try_getVaultPPS(LINK_VAULT_ADDRESS);
    if (linkVaultPpsTry.reverted) {
      log.info("REVERT_PPS handleBlock LINK at block {} ", [
        block.number.toString(),
      ]);
    }
    linkVaultPps.pricePerShare = linkVaultPpsTry.reverted
      ? BigInt.zero()
      : linkVaultPpsTry.value;
    linkVaultPps.save();

    /** TVL */

    const linkVaultTvl = new VaultTVL(linkVaultEntityId);

    linkVaultTvl.block = block.number;
    linkVaultTvl.timestamp = block.timestamp;
    linkVaultTvl.event = event;
    linkVaultTvl.txHash = "";
    linkVaultTvl.vault = LINK_VAULT_ADDRESS.toHexString();
    const linkVaultTVLTry = aggregateVault.try_getVaultTVL(LINK_VAULT_ADDRESS);
    if (linkVaultTVLTry.reverted) {
      log.info("REVERT_TVL handleBlock LINK at block {} ", [
        block.number.toString(),
      ]);
    }
    linkVaultTvl.tvl = linkVaultTVLTry.reverted
      ? BigInt.zero()
      : linkVaultTVLTry.value;
    linkVaultTvl.save();

    /** UNI vault */
    /** Price per share */
    const uniVaultEntityId = `${block.number}:${
      block.timestamp
    }:${UNI_VAULT_ADDRESS.toHexString()}`;
    const uniVaultPps = new VaultPricePerShare(uniVaultEntityId);

    uniVaultPps.block = block.number;
    uniVaultPps.timestamp = block.timestamp;
    uniVaultPps.event = event;
    uniVaultPps.txHash = "";
    uniVaultPps.vault = UNI_VAULT_ADDRESS.toHexString();
    const uniVaultPpsTry = aggregateVault.try_getVaultPPS(UNI_VAULT_ADDRESS);
    if (uniVaultPpsTry.reverted) {
      log.info("REVERT_PPS handleBlock UNI at block {} ", [
        block.number.toString(),
      ]);
    }
    uniVaultPps.pricePerShare = uniVaultPpsTry.reverted
      ? BigInt.zero()
      : uniVaultPpsTry.value;
    uniVaultPps.save();

    /** TVL */

    const uniVaultTvl = new VaultTVL(uniVaultEntityId);

    uniVaultTvl.block = block.number;
    uniVaultTvl.timestamp = block.timestamp;
    uniVaultTvl.event = event;
    uniVaultTvl.txHash = "";
    uniVaultTvl.vault = UNI_VAULT_ADDRESS.toHexString();
    const uniVaultTVLTry = aggregateVault.try_getVaultTVL(UNI_VAULT_ADDRESS);
    if (uniVaultTVLTry.reverted) {
      log.info("REVERT_TVL handleBlock UNI at block {} ", [
        block.number.toString(),
      ]);
    }
    uniVaultTvl.tvl = uniVaultTVLTry.reverted
      ? BigInt.zero()
      : uniVaultTVLTry.value;
    uniVaultTvl.save();
  }
}

export function handleCloseRebalance(event: CloseRebalanceEvent): void {
  let entity = new CloseRebalance(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  const aggregateVault = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);

  let epoch = BigInt.zero();
  /** getVaultState() */
  const vaultStateView = aggregateVault.delegateview(
    AGGREGATE_VAULT_HELPER_ADDRESS,
    Bytes.fromHexString("0x4a8c110a")
  );

  let vaultStateViewDecoded = ethereum.decode(
    "(int,bool,int[5],int[5],int[5][5],address)",
    vaultStateView.get_ret()
  );
  if (vaultStateViewDecoded !== null) {
    epoch = vaultStateViewDecoded.toTuple()[0].toBigInt();
  }

  entity.timestamp = event.params._timestamp;
  entity.block = event.block.number;
  entity.epoch = epoch;
  entity.save();

  const eventLabel = "close";
  const gmxVaultContract = GmxVault.bind(GMX_VAULT_ADDRESS);
  const glpManagerContract = Manager.bind(GLP_HANDLER_ADDRESS);

  const snapshot = new RebalanceSnapshot(event.transaction.hash.toHex());
  snapshot.block = event.block.number;
  snapshot.timestamp = event.block.timestamp;
  snapshot.epoch = epoch;
  snapshot.txHash = event.transaction.hash.toHex();
  snapshot.event = eventLabel;
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
  const rebalanceState = aggregateVault.getRebalanceState();
  snapshot.glpComposition = rebalanceState.getGlpComposition();
  snapshot.vaultsGlpAlloc = rebalanceState.getGlpAllocation();
  snapshot.aggregatePositions = rebalanceState.getAggregatePositions();
  snapshot.usdcVaultExternalPositions = rebalanceState.getExternalPositions()[0];
  snapshot.wethVaultExternalPositions = rebalanceState.getExternalPositions()[1];
  snapshot.wbtcVaultExternalPositions = rebalanceState.getExternalPositions()[2];
  snapshot.linkVaultExternalPositions = rebalanceState.getExternalPositions()[3];
  snapshot.uniVaultExternalPositions = rebalanceState.getExternalPositions()[4];
  const nettedPositionsView = aggregateVault.delegateview(
    AGGREGATE_VAULT_HELPER_ADDRESS,
    Bytes.fromHexString("0x6c2e656c")
  );

  let nettedPositionsViewDecoded = ethereum.decode(
    "int[5][5]",
    nettedPositionsView.get_ret()
  );
  if (nettedPositionsViewDecoded !== null) {
    const nettedPositionsMatrix = nettedPositionsViewDecoded.toBigIntMatrix();
    snapshot.usdcVaultNettedPositions = nettedPositionsMatrix[0];
    snapshot.wethVaultNettedPositions = nettedPositionsMatrix[1];
    snapshot.wbtcVaultNettedPositions = nettedPositionsMatrix[2];
    snapshot.linkVaultNettedPositions = nettedPositionsMatrix[3];
    snapshot.uniVaultNettedPositions = nettedPositionsMatrix[4];
  } else {
    log.info(
      "DECODE_NETTED_POSITIONS_CLOSE_REBALANCE could not decode getNettedPositions at block {} ",
      [event.block.number.toString()]
    );
    const emptyArray = [
      BigInt.zero(),
      BigInt.zero(),
      BigInt.zero(),
      BigInt.zero(),
      BigInt.zero(),
    ];
    snapshot.wethVaultNettedPositions = emptyArray;
    snapshot.usdcVaultNettedPositions = emptyArray;
    snapshot.wbtcVaultNettedPositions = emptyArray;
    snapshot.linkVaultNettedPositions = emptyArray;
    snapshot.uniVaultNettedPositions = emptyArray;
  }
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
  usdcVaultPps.event = eventLabel;
  usdcVaultPps.txHash = event.transaction.hash.toHex();
  usdcVaultPps.vault = USDC_VAULT_ADDRESS.toHexString();
  const usdcVaultPpsTry = aggregateVault.try_getVaultPPS(USDC_VAULT_ADDRESS);
  if (usdcVaultPpsTry.reverted) {
    log.info("REVERT_PPS handleCloseRebalance USDC at block {} ", [
      block.number.toString(),
    ]);
  }
  usdcVaultPps.pricePerShare = usdcVaultPpsTry.reverted
    ? BigInt.zero()
    : usdcVaultPpsTry.value;
  usdcVaultPps.save();

  /** TVL */

  const usdcVaultTvl = new VaultTVL(usdcVaultEntityId);

  usdcVaultTvl.block = block.number;
  usdcVaultTvl.timestamp = block.timestamp;
  usdcVaultTvl.event = eventLabel;
  usdcVaultTvl.txHash = event.transaction.hash.toHex();
  usdcVaultTvl.vault = USDC_VAULT_ADDRESS.toHexString();
  const usdcVaultTVLTry = aggregateVault.try_getVaultTVL(USDC_VAULT_ADDRESS);
  if (usdcVaultTVLTry.reverted) {
    log.info("REVERT_TVL handleCloseRebalance USDC at block {} ", [
      block.number.toString(),
    ]);
  }
  usdcVaultTvl.tvl = usdcVaultTVLTry.reverted
    ? BigInt.zero()
    : usdcVaultTVLTry.value;
  usdcVaultTvl.save();

  /** WETH vault */
  /** Price per share */
  const wethVaultEntityId = `${block.number}:${
    block.timestamp
  }:${WETH_VAULT_ADDRESS.toHexString()}`;
  const wethVaultPps = new VaultPricePerShare(wethVaultEntityId);

  wethVaultPps.block = block.number;
  wethVaultPps.timestamp = block.timestamp;
  wethVaultPps.event = eventLabel;
  wethVaultPps.txHash = event.transaction.hash.toHex();
  wethVaultPps.vault = WETH_VAULT_ADDRESS.toHexString();
  const wethVaultPpsTry = aggregateVault.try_getVaultPPS(WETH_VAULT_ADDRESS);
  if (wethVaultPpsTry.reverted) {
    log.info("REVERT_PPS handleCloseRebalance wETH at block {} ", [
      block.number.toString(),
    ]);
  }
  wethVaultPps.pricePerShare = wethVaultPpsTry.reverted
    ? BigInt.zero()
    : wethVaultPpsTry.value;
  wethVaultPps.save();

  /** TVL */
  const wethVaulTvl = new VaultTVL(wethVaultEntityId);

  wethVaulTvl.block = block.number;
  wethVaulTvl.timestamp = block.timestamp;
  wethVaulTvl.event = eventLabel;
  wethVaulTvl.txHash = event.transaction.hash.toHex();
  wethVaulTvl.vault = WETH_VAULT_ADDRESS.toHexString();
  const wethVaultTVLTry = aggregateVault.try_getVaultTVL(WETH_VAULT_ADDRESS);
  if (wethVaultTVLTry.reverted) {
    log.info("REVERT_TVL handleCloseRebalance wETH at block {} ", [
      block.number.toString(),
    ]);
  }
  wethVaulTvl.tvl = wethVaultTVLTry.reverted
    ? BigInt.zero()
    : wethVaultTVLTry.value;
  wethVaulTvl.save();

  /** WBTC vault */
  /** Price per share */
  const wbtcVaultEntityId = `${block.number}:${
    block.timestamp
  }:${WBTC_VAULT_ADDRESS.toHexString()}`;
  const wbtcVaultPps = new VaultPricePerShare(wbtcVaultEntityId);

  wbtcVaultPps.block = block.number;
  wbtcVaultPps.timestamp = block.timestamp;
  wbtcVaultPps.event = eventLabel;
  wbtcVaultPps.txHash = event.transaction.hash.toHex();
  wbtcVaultPps.vault = WBTC_VAULT_ADDRESS.toHexString();
  const wbtcVaultPpsTry = aggregateVault.try_getVaultPPS(WBTC_VAULT_ADDRESS);
  if (wbtcVaultPpsTry.reverted) {
    log.info("REVERT_PPS handleCloseRebalance wBTC at block {} ", [
      block.number.toString(),
    ]);
  }
  wbtcVaultPps.pricePerShare = wbtcVaultPpsTry.reverted
    ? BigInt.zero()
    : wbtcVaultPpsTry.value;
  wbtcVaultPps.save();

  /** TVL */

  const wbtcVaultTvl = new VaultTVL(wbtcVaultEntityId);

  wbtcVaultTvl.block = block.number;
  wbtcVaultTvl.timestamp = block.timestamp;
  wbtcVaultTvl.event = eventLabel;
  wbtcVaultTvl.txHash = event.transaction.hash.toHex();
  wbtcVaultTvl.vault = WBTC_VAULT_ADDRESS.toHexString();
  const wbtcVaultTVLTry = aggregateVault.try_getVaultTVL(WBTC_VAULT_ADDRESS);
  if (wbtcVaultTVLTry.reverted) {
    log.info("REVERT_TVL handleCloseRebalance wBTC at block {} ", [
      block.number.toString(),
    ]);
  }
  wbtcVaultTvl.tvl = wbtcVaultTVLTry.reverted
    ? BigInt.zero()
    : wbtcVaultTVLTry.value;
  wbtcVaultTvl.save();

  /** UNI vault */
  /** Price per share */
  const uniVaultEntityId = `${block.number}:${
    block.timestamp
  }:${UNI_VAULT_ADDRESS.toHexString()}`;
  const uniVaultPps = new VaultPricePerShare(uniVaultEntityId);

  uniVaultPps.block = block.number;
  uniVaultPps.timestamp = block.timestamp;
  uniVaultPps.event = eventLabel;
  uniVaultPps.txHash = event.transaction.hash.toHex();
  uniVaultPps.vault = UNI_VAULT_ADDRESS.toHexString();
  const uniVaultPpsTry = aggregateVault.try_getVaultPPS(UNI_VAULT_ADDRESS);
  if (uniVaultPpsTry.reverted) {
    log.info("REVERT_PPS handleCloseRebalance UNI at block {} ", [
      block.number.toString(),
    ]);
  }
  uniVaultPps.pricePerShare = uniVaultPpsTry.reverted
    ? BigInt.zero()
    : uniVaultPpsTry.value;
  uniVaultPps.save();

  /** TVL */

  const uniVaultTvl = new VaultTVL(uniVaultEntityId);

  uniVaultTvl.block = block.number;
  uniVaultTvl.timestamp = block.timestamp;
  uniVaultTvl.event = eventLabel;
  uniVaultTvl.txHash = event.transaction.hash.toHex();
  uniVaultTvl.vault = UNI_VAULT_ADDRESS.toHexString();
  const uniVaultTVLTry = aggregateVault.try_getVaultTVL(UNI_VAULT_ADDRESS);
  if (uniVaultTVLTry.reverted) {
    log.info("REVERT_TVL handleCloseRebalance UNI at block {} ", [
      block.number.toString(),
    ]);
  }
  uniVaultTvl.tvl = uniVaultTVLTry.reverted
    ? BigInt.zero()
    : uniVaultTVLTry.value;
  uniVaultTvl.save();

  /** LINK vault */
  /** Price per share */
  const linkVaultEntityId = `${block.number}:${
    block.timestamp
  }:${LINK_VAULT_ADDRESS.toHexString()}`;

  const linkVaultPps = new VaultPricePerShare(linkVaultEntityId);

  linkVaultPps.block = block.number;
  linkVaultPps.timestamp = block.timestamp;
  linkVaultPps.event = eventLabel;
  linkVaultPps.txHash = event.transaction.hash.toHex();
  linkVaultPps.vault = LINK_VAULT_ADDRESS.toHexString();
  const linkVaultPpsTry = aggregateVault.try_getVaultPPS(LINK_VAULT_ADDRESS);
  if (linkVaultPpsTry.reverted) {
    log.info("REVERT_PPS handleCloseRebalance LINK at block {} ", [
      block.number.toString(),
    ]);
  }
  linkVaultPps.pricePerShare = linkVaultPpsTry.reverted
    ? BigInt.zero()
    : linkVaultPpsTry.value;
  linkVaultPps.save();

  /** TVL */

  const linkVaultTvl = new VaultTVL(linkVaultEntityId);

  linkVaultTvl.block = block.number;
  linkVaultTvl.timestamp = block.timestamp;
  linkVaultTvl.event = eventLabel;
  linkVaultTvl.txHash = event.transaction.hash.toHex();
  linkVaultTvl.vault = LINK_VAULT_ADDRESS.toHexString();
  const linkVaultTVLTry = aggregateVault.try_getVaultTVL(LINK_VAULT_ADDRESS);
  if (linkVaultTVLTry.reverted) {
    log.info("REVERT_TVL handleCloseRebalance LINK at block {} ", [
      block.number.toString(),
    ]);
  }
  linkVaultTvl.tvl = linkVaultTVLTry.reverted
    ? BigInt.zero()
    : linkVaultTVLTry.value;
  linkVaultTvl.save();
}

export function handleCollectVaultFees(event: CollectVaultFeesEvent): void {
  let entity = new VaultFeesCollection(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  const aggregateVault = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);

  let epoch = BigInt.zero();
  /** getVaultState() */
  const vaultStateView = aggregateVault.delegateview(
    AGGREGATE_VAULT_HELPER_ADDRESS,
    Bytes.fromHexString("0x4a8c110a")
  );

  let vaultStateViewDecoded = ethereum.decode(
    "(int,bool,int[5],int[5],int[5][5],address)",
    vaultStateView.get_ret()
  );
  if (vaultStateViewDecoded !== null) {
    epoch = vaultStateViewDecoded.toTuple()[0].toBigInt();
  }
  entity.timestamp = event.block.timestamp;
  entity.block = event.block.number;
  entity.epoch = epoch;
  entity.totalVaultFee = event.params.totalVaultFee;
  entity.performanceFeeInAsset = event.params.performanceFeeInAsset;
  entity.managementFeeInAsset = event.params.managementFeeInAsset;
  entity.slowReleaseMintAmount = event.params.slowReleaseMintAmount;
  entity.vault = event.params._assetVault.toHexString();
  entity.save();
}

export function handleCompoundDistributeYield(
  event: CompoundDistributeYieldEvent
): void {
  let entity = new CompoundDistributeYield(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  const aggregateVault = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);

  let epoch = BigInt.zero();
  /** getVaultState() */
  const vaultStateView = aggregateVault.delegateview(
    AGGREGATE_VAULT_HELPER_ADDRESS,
    Bytes.fromHexString("0x4a8c110a")
  );

  let vaultStateViewDecoded = ethereum.decode(
    "(int,bool,int[5],int[5],int[5][5],address)",
    vaultStateView.get_ret()
  );
  if (vaultStateViewDecoded !== null) {
    epoch = vaultStateViewDecoded.toTuple()[0].toBigInt();
  }
  entity.timestamp = event.block.timestamp;
  entity.block = event.block.number;
  entity.epoch = epoch;
  entity.glpYieldPerVault = event.params.glpYieldPerVault;
  entity.save();
}

export function handleCycle(event: CycleEvent): void {
  let entity = new Cycle(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  const aggregateVault = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);

  let epoch = BigInt.zero();
  /** getVaultState() */
  const vaultStateView = aggregateVault.delegateview(
    AGGREGATE_VAULT_HELPER_ADDRESS,
    Bytes.fromHexString("0x4a8c110a")
  );

  let vaultStateViewDecoded = ethereum.decode(
    "(int,bool,int[5],int[5],int[5][5],address)",
    vaultStateView.get_ret()
  );
  if (vaultStateViewDecoded !== null) {
    epoch = vaultStateViewDecoded.toTuple()[0].toBigInt();
  }
  entity.timestamp = event.params.timestamp;
  entity.block = event.block.number;
  entity.epoch = epoch;
  entity.round = event.params.round;
  entity.save();
}

export function handleOpenRebalance(event: OpenRebalanceEvent): void {
  let entity = new OpenRebalance(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );

  const eventLabel = "open";
  const gmxVaultContract = GmxVault.bind(GMX_VAULT_ADDRESS);
  const glpManagerContract = Manager.bind(GLP_HANDLER_ADDRESS);

  const aggregateVault = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);

  let epoch = BigInt.zero();
  /** getVaultState() */
  const vaultStateView = aggregateVault.delegateview(
    AGGREGATE_VAULT_HELPER_ADDRESS,
    Bytes.fromHexString("0x4a8c110a")
  );

  let vaultStateViewDecoded = ethereum.decode(
    "(int,bool,int[5],int[5],int[5][5],address)",
    vaultStateView.get_ret()
  );
  if (vaultStateViewDecoded !== null) {
    epoch = vaultStateViewDecoded.toTuple()[0].toBigInt();
  }
  entity.timestamp = event.params.timestamp;
  entity.block = event.block.number;
  entity.epoch = epoch;
  entity.nextVaultGlpAlloc = event.params.nextVaultGlpAlloc;
  entity.nextGlpComp = event.params.nextGlpComp;
  entity.adjustedPositions = event.params.adjustedPositions;
  entity.save();

  const snapshot = new RebalanceSnapshot(event.transaction.hash.toHex());
  snapshot.block = event.block.number;
  snapshot.timestamp = event.block.timestamp;
  snapshot.epoch = epoch;
  snapshot.txHash = event.transaction.hash.toHex();
  snapshot.event = eventLabel;
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
  const rebalanceState = aggregateVault.getRebalanceState();
  snapshot.glpComposition = rebalanceState.getGlpComposition();
  snapshot.vaultsGlpAlloc = rebalanceState.getGlpAllocation();
  snapshot.aggregatePositions = rebalanceState.getAggregatePositions();
  snapshot.usdcVaultExternalPositions = rebalanceState.getExternalPositions()[0];
  snapshot.wethVaultExternalPositions = rebalanceState.getExternalPositions()[1];
  snapshot.wbtcVaultExternalPositions = rebalanceState.getExternalPositions()[2];
  snapshot.linkVaultExternalPositions = rebalanceState.getExternalPositions()[3];
  snapshot.uniVaultExternalPositions = rebalanceState.getExternalPositions()[4];
  const nettedPositionsView = aggregateVault.delegateview(
    AGGREGATE_VAULT_HELPER_ADDRESS,
    Bytes.fromHexString("0x6c2e656c")
  );

  let nettedPositionsViewDecoded = ethereum.decode(
    "int[5][5]",
    nettedPositionsView.get_ret()
  );
  if (nettedPositionsViewDecoded !== null) {
    const nettedPositionsMatrix = nettedPositionsViewDecoded.toBigIntMatrix();
    snapshot.usdcVaultNettedPositions = nettedPositionsMatrix[0];
    snapshot.wethVaultNettedPositions = nettedPositionsMatrix[1];
    snapshot.wbtcVaultNettedPositions = nettedPositionsMatrix[2];
    snapshot.linkVaultNettedPositions = nettedPositionsMatrix[3];
    snapshot.uniVaultNettedPositions = nettedPositionsMatrix[4];
  } else {
    log.info(
      "DECODE_NETTED_POSITIONS_OPEN_REBALANCE could not decode getNettedPositions at block {} ",
      [event.block.number.toString()]
    );
    const emptyArray = [
      BigInt.zero(),
      BigInt.zero(),
      BigInt.zero(),
      BigInt.zero(),
      BigInt.zero(),
    ];
    snapshot.wethVaultNettedPositions = emptyArray;
    snapshot.usdcVaultNettedPositions = emptyArray;
    snapshot.wbtcVaultNettedPositions = emptyArray;
    snapshot.linkVaultNettedPositions = emptyArray;
    snapshot.uniVaultNettedPositions = emptyArray;
  }
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
  usdcVaultPps.event = eventLabel;
  usdcVaultPps.txHash = event.transaction.hash.toHex();
  usdcVaultPps.vault = USDC_VAULT_ADDRESS.toHexString();
  const usdcVaultPpsTry = aggregateVault.try_getVaultPPS(USDC_VAULT_ADDRESS);
  if (usdcVaultPpsTry.reverted) {
    log.info("REVERT_PPS handleOpenRebalance USDC at block {} ", [
      block.number.toString(),
    ]);
  }
  usdcVaultPps.pricePerShare = usdcVaultPpsTry.reverted
    ? BigInt.zero()
    : usdcVaultPpsTry.value;
  usdcVaultPps.save();

  /** TVL */

  const usdcVaultTvl = new VaultTVL(usdcVaultEntityId);

  usdcVaultTvl.block = block.number;
  usdcVaultTvl.timestamp = block.timestamp;
  usdcVaultTvl.event = eventLabel;
  usdcVaultTvl.txHash = event.transaction.hash.toHex();
  usdcVaultTvl.vault = USDC_VAULT_ADDRESS.toHexString();
  const usdcVaultTVLTry = aggregateVault.try_getVaultTVL(USDC_VAULT_ADDRESS);
  if (usdcVaultTVLTry.reverted) {
    log.info("REVERT_TVL handleOpenRebalance USDC at block {} ", [
      block.number.toString(),
    ]);
  }
  usdcVaultTvl.tvl = usdcVaultTVLTry.reverted
    ? BigInt.zero()
    : usdcVaultTVLTry.value;
  usdcVaultTvl.save();

  /** WETH vault */
  /** Price per share */
  const wethVaultEntityId = `${block.number}:${
    block.timestamp
  }:${WETH_VAULT_ADDRESS.toHexString()}`;
  const wethVaultPps = new VaultPricePerShare(wethVaultEntityId);

  wethVaultPps.block = block.number;
  wethVaultPps.timestamp = block.timestamp;
  wethVaultPps.event = eventLabel;
  wethVaultPps.txHash = event.transaction.hash.toHex();
  wethVaultPps.vault = WETH_VAULT_ADDRESS.toHexString();
  const wethVaultPpsTry = aggregateVault.try_getVaultPPS(WETH_VAULT_ADDRESS);
  if (wethVaultPpsTry.reverted) {
    log.info("REVERT_PPS handleOpenRebalance wETH at block {} ", [
      block.number.toString(),
    ]);
  }
  wethVaultPps.pricePerShare = wethVaultPpsTry.reverted
    ? BigInt.zero()
    : wethVaultPpsTry.value;
  wethVaultPps.save();

  /** TVL */
  const wethVaulTvl = new VaultTVL(wethVaultEntityId);

  wethVaulTvl.block = block.number;
  wethVaulTvl.timestamp = block.timestamp;
  wethVaulTvl.event = eventLabel;
  wethVaulTvl.txHash = event.transaction.hash.toHex();
  wethVaulTvl.vault = WETH_VAULT_ADDRESS.toHexString();
  const wethVaultTVLTry = aggregateVault.try_getVaultTVL(WETH_VAULT_ADDRESS);
  if (wethVaultTVLTry.reverted) {
    log.info("REVERT_TVL handleOpenRebalance wETH at block {} ", [
      block.number.toString(),
    ]);
  }
  wethVaulTvl.tvl = wethVaultTVLTry.reverted
    ? BigInt.zero()
    : wethVaultTVLTry.value;
  wethVaulTvl.save();

  /** WBTC vault */
  /** Price per share */
  const wbtcVaultEntityId = `${block.number}:${
    block.timestamp
  }:${WBTC_VAULT_ADDRESS.toHexString()}`;
  const wbtcVaultPps = new VaultPricePerShare(wbtcVaultEntityId);

  wbtcVaultPps.block = block.number;
  wbtcVaultPps.timestamp = block.timestamp;
  wbtcVaultPps.event = eventLabel;
  wbtcVaultPps.txHash = event.transaction.hash.toHex();
  wbtcVaultPps.vault = WBTC_VAULT_ADDRESS.toHexString();
  const wbtcVaultPpsTry = aggregateVault.try_getVaultPPS(WBTC_VAULT_ADDRESS);
  if (wbtcVaultPpsTry.reverted) {
    log.info("REVERT_PPS handleOpenRebalance wBTC at block {} ", [
      block.number.toString(),
    ]);
  }
  wbtcVaultPps.pricePerShare = wbtcVaultPpsTry.reverted
    ? BigInt.zero()
    : wbtcVaultPpsTry.value;
  wbtcVaultPps.save();

  /** TVL */

  const wbtcVaultTvl = new VaultTVL(wbtcVaultEntityId);

  wbtcVaultTvl.block = block.number;
  wbtcVaultTvl.timestamp = block.timestamp;
  wbtcVaultTvl.event = eventLabel;
  wbtcVaultTvl.txHash = event.transaction.hash.toHex();
  wbtcVaultTvl.vault = WBTC_VAULT_ADDRESS.toHexString();
  const wbtcVaultTVLTry = aggregateVault.try_getVaultTVL(WBTC_VAULT_ADDRESS);
  if (wbtcVaultTVLTry.reverted) {
    log.info("REVERT_TVL handleOpenRebalance wBTC at block {} ", [
      block.number.toString(),
    ]);
  }
  wbtcVaultTvl.tvl = wbtcVaultTVLTry.reverted
    ? BigInt.zero()
    : wbtcVaultTVLTry.value;
  wbtcVaultTvl.save();

  /** UNI vault */
  /** Price per share */
  const uniVaultEntityId = `${block.number}:${
    block.timestamp
  }:${UNI_VAULT_ADDRESS.toHexString()}`;
  const uniVaultPps = new VaultPricePerShare(uniVaultEntityId);

  uniVaultPps.block = block.number;
  uniVaultPps.timestamp = block.timestamp;
  uniVaultPps.event = eventLabel;
  uniVaultPps.txHash = event.transaction.hash.toHex();
  uniVaultPps.vault = UNI_VAULT_ADDRESS.toHexString();
  const uniVaultPpsTry = aggregateVault.try_getVaultPPS(UNI_VAULT_ADDRESS);
  if (uniVaultPpsTry.reverted) {
    log.info("REVERT_PPS handleOpenRebalance UNI at block {} ", [
      block.number.toString(),
    ]);
  }
  uniVaultPps.pricePerShare = uniVaultPpsTry.reverted
    ? BigInt.zero()
    : uniVaultPpsTry.value;
  uniVaultPps.save();

  /** TVL */

  const uniVaultTvl = new VaultTVL(uniVaultEntityId);

  uniVaultTvl.block = block.number;
  uniVaultTvl.timestamp = block.timestamp;
  uniVaultTvl.event = eventLabel;
  uniVaultTvl.txHash = event.transaction.hash.toHex();
  uniVaultTvl.vault = UNI_VAULT_ADDRESS.toHexString();
  const uniVaultTVLTry = aggregateVault.try_getVaultTVL(UNI_VAULT_ADDRESS);
  if (uniVaultTVLTry.reverted) {
    log.info("REVERT_TVL handleOpenRebalance UNI at block {} ", [
      block.number.toString(),
    ]);
  }
  uniVaultTvl.tvl = uniVaultTVLTry.reverted
    ? BigInt.zero()
    : uniVaultTVLTry.value;
  uniVaultTvl.save();

  /** LINK vault */
  /** Price per share */
  const linkVaultEntityId = `${block.number}:${
    block.timestamp
  }:${LINK_VAULT_ADDRESS.toHexString()}`;

  const linkVaultPps = new VaultPricePerShare(linkVaultEntityId);

  linkVaultPps.block = block.number;
  linkVaultPps.timestamp = block.timestamp;
  linkVaultPps.event = eventLabel;
  linkVaultPps.txHash = event.transaction.hash.toHex();
  linkVaultPps.vault = LINK_VAULT_ADDRESS.toHexString();
  const linkVaultPpsTry = aggregateVault.try_getVaultPPS(LINK_VAULT_ADDRESS);
  if (linkVaultPpsTry.reverted) {
    log.info("REVERT_PPS handleOpenRebalance LINK at block {} ", [
      block.number.toString(),
    ]);
  }
  linkVaultPps.pricePerShare = linkVaultPpsTry.reverted
    ? BigInt.zero()
    : linkVaultPpsTry.value;
  linkVaultPps.save();

  /** TVL */

  const linkVaultTvl = new VaultTVL(linkVaultEntityId);

  linkVaultTvl.block = block.number;
  linkVaultTvl.timestamp = block.timestamp;
  linkVaultTvl.event = eventLabel;
  linkVaultTvl.txHash = event.transaction.hash.toHex();
  linkVaultTvl.vault = LINK_VAULT_ADDRESS.toHexString();
  const linkVaultTVLTry = aggregateVault.try_getVaultTVL(LINK_VAULT_ADDRESS);
  if (linkVaultTVLTry.reverted) {
    log.info("REVERT_TVL handleOpenRebalance LINK at block {} ", [
      block.number.toString(),
    ]);
  }
  linkVaultTvl.tvl = linkVaultTVLTry.reverted
    ? BigInt.zero()
    : linkVaultTVLTry.value;
  linkVaultTvl.save();
}

export function handleRebalanceGlpPosition(
  event: RebalanceGlpPositionEvent
): void {
  let entity = new RebalanceGlpPosition(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  const aggregateVault = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);

  let epoch = BigInt.zero();
  /** getVaultState() */
  const vaultStateView = aggregateVault.delegateview(
    AGGREGATE_VAULT_HELPER_ADDRESS,
    Bytes.fromHexString("0x4a8c110a")
  );

  let vaultStateViewDecoded = ethereum.decode(
    "(int,bool,int[5],int[5],int[5][5],address)",
    vaultStateView.get_ret()
  );
  if (vaultStateViewDecoded !== null) {
    epoch = vaultStateViewDecoded.toTuple()[0].toBigInt();
  }
  entity.timestamp = event.block.timestamp;
  entity.block = event.block.number;
  entity.epoch = epoch;
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
  const aggregateVault = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);

  let epoch = BigInt.zero();
  /** getVaultState() */
  const vaultStateView = aggregateVault.delegateview(
    AGGREGATE_VAULT_HELPER_ADDRESS,
    Bytes.fromHexString("0x4a8c110a")
  );

  let vaultStateViewDecoded = ethereum.decode(
    "(int,bool,int[5],int[5],int[5][5],address)",
    vaultStateView.get_ret()
  );
  if (vaultStateViewDecoded !== null) {
    epoch = vaultStateViewDecoded.toTuple()[0].toBigInt();
  }
  entity.timestamp = event.block.timestamp;
  entity.block = event.block.number;
  entity.epoch = epoch;
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
  const aggregateVault = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);

  let epoch = BigInt.zero();
  /** getVaultState() */
  const vaultStateView = aggregateVault.delegateview(
    AGGREGATE_VAULT_HELPER_ADDRESS,
    Bytes.fromHexString("0x4a8c110a")
  );

  let vaultStateViewDecoded = ethereum.decode(
    "(int,bool,int[5],int[5],int[5][5],address)",
    vaultStateView.get_ret()
  );
  if (vaultStateViewDecoded !== null) {
    epoch = vaultStateViewDecoded.toTuple()[0].toBigInt();
  }
  entity.timestamp = event.block.timestamp;
  entity.block = event.block.number;
  entity.epoch = epoch;
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
