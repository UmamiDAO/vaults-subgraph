import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  AggregateVault,
  CloseRebalance,
  CollectVaultFees,
  Cycle,
  OpenRebalance,
  Paused,
  Unpaused,
} from "../generated/AggregateVault/AggregateVault";
import { GmxVault } from "../generated/GmxVault/GmxVault";
import { Manager } from "../generated/Manager/Manager";
import {
  TmpRebalanceSnapshot,
  VaultFeesCollection,
  VaultPpsLastTimestamp,
  VaultPricePerShare,
  VaultTVL,
} from "../generated/schema";
import {
  AGGREGATE_VAULT_ADDRESS,
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

    const aggregateVaultContract = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);

    /** USDC vault */
    /** USDC vault price per share */
    const usdcVaultEntityId = `${block.number}:${
      block.timestamp
    }:${USDC_VAULT_ADDRESS.toHexString()}`;
    const usdcVaultPps = new VaultPricePerShare(usdcVaultEntityId);

    usdcVaultPps.block = block.number;
    usdcVaultPps.timestamp = block.timestamp;
    usdcVaultPps.vault = USDC_VAULT_ADDRESS.toHexString();
    const usdcPpsTry = aggregateVaultContract.try_getVaultPPS(
      USDC_VAULT_ADDRESS
    );
    usdcVaultPps.pricePerShare = usdcPpsTry.reverted
      ? BigInt.zero()
      : usdcPpsTry.value;
    usdcVaultPps.save();

    /** TVL */

    const usdcVaultTvl = new VaultTVL(usdcVaultEntityId);

    usdcVaultTvl.block = block.number;
    usdcVaultTvl.timestamp = block.timestamp;
    usdcVaultTvl.vault = USDC_VAULT_ADDRESS.toHexString();
    const usdcTvlTry = aggregateVaultContract.try_getVaultTVL(
      USDC_VAULT_ADDRESS
    );
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
    const wethPpsTry = aggregateVaultContract.try_getVaultPPS(
      WETH_VAULT_ADDRESS
    );
    wethVaultPps.pricePerShare = wethPpsTry.reverted
      ? BigInt.zero()
      : wethPpsTry.value;
    wethVaultPps.save();

    /** TVL */
    const wethVaulTvl = new VaultTVL(wethVaultEntityId);

    wethVaulTvl.block = block.number;
    wethVaulTvl.timestamp = block.timestamp;
    wethVaulTvl.vault = WETH_VAULT_ADDRESS.toHexString();
    const wethTvlTry = aggregateVaultContract.try_getVaultTVL(
      WETH_VAULT_ADDRESS
    );
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
    const wbtcPpsTry = aggregateVaultContract.try_getVaultPPS(
      WBTC_VAULT_ADDRESS
    );
    wbtcVaultPps.pricePerShare = wbtcPpsTry.reverted
      ? BigInt.zero()
      : wbtcPpsTry.value;

    wbtcVaultPps.save();

    /** TVL */

    const wbtcVaultTvl = new VaultTVL(wbtcVaultEntityId);

    wbtcVaultTvl.block = block.number;
    wbtcVaultTvl.timestamp = block.timestamp;
    wbtcVaultTvl.vault = WBTC_VAULT_ADDRESS.toHexString();
    const wbtcTvlTry = aggregateVaultContract.try_getVaultTVL(
      WBTC_VAULT_ADDRESS
    );
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
    const uniPpsTry = aggregateVaultContract.try_getVaultPPS(UNI_VAULT_ADDRESS);
    uniVaultPps.pricePerShare = uniPpsTry.reverted
      ? BigInt.zero()
      : uniPpsTry.value;

    uniVaultPps.save();

    /** TVL */

    const uniVaultTvl = new VaultTVL(uniVaultEntityId);

    uniVaultTvl.block = block.number;
    uniVaultTvl.timestamp = block.timestamp;
    uniVaultTvl.vault = UNI_VAULT_ADDRESS.toHexString();
    const uniTvlTry = aggregateVaultContract.try_getVaultTVL(UNI_VAULT_ADDRESS);
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
    const linkPpsTry = aggregateVaultContract.try_getVaultPPS(
      LINK_VAULT_ADDRESS
    );
    linkVaultPps.pricePerShare = linkPpsTry.reverted
      ? BigInt.zero()
      : linkPpsTry.value;
    linkVaultPps.save();

    /** TVL */

    const linkVaultTvl = new VaultTVL(linkVaultEntityId);

    linkVaultTvl.block = block.number;
    linkVaultTvl.timestamp = block.timestamp;
    linkVaultTvl.vault = LINK_VAULT_ADDRESS.toHexString();
    const linkTvlTry = aggregateVaultContract.try_getVaultTVL(
      LINK_VAULT_ADDRESS
    );
    linkVaultTvl.tvl = linkTvlTry.reverted ? BigInt.zero() : linkTvlTry.value;
    linkVaultTvl.save();
  }
}

export function handleCollectVaultFees(event: CollectVaultFees): void {
  const vaultAddress = event.params._assetVault;
  const entityId = `${event.block.timestamp}:${vaultAddress.toHexString()}`;

  /** Vault fees collection */
  const vaultFeesCollection = new VaultFeesCollection(entityId);
  vaultFeesCollection.block = event.block.number;
  vaultFeesCollection.timestamp = event.block.timestamp;
  vaultFeesCollection.vault = vaultAddress.toHexString();
  vaultFeesCollection.managementFees = event.params.managementFeeInAsset;
  vaultFeesCollection.performanceFees = event.params.performanceFeeInAsset;
  vaultFeesCollection.totalFees = event.params.totalVaultFee;
  vaultFeesCollection.save();
}

export function handleCycle(event: Cycle): void {}

export function handleOpenRebalance(event: OpenRebalance): void {
  const aggregateVaultContract = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);
  const gmxVault = GmxVault.bind(GMX_VAULT_ADDRESS);
  const glpManager = Manager.bind(GMX_VAULT_ADDRESS);
  const snapshot = new TmpRebalanceSnapshot(event.transaction.hash.toHex());
  snapshot.block = event.block.number;
  snapshot.timestamp = event.block.timestamp;
  snapshot.txHash = event.transaction.hash.toHex();
  snapshot.event = "open";

  const rebalanceState = aggregateVaultContract.getRebalanceState();
  const glpPrice1 = glpManager.try_getGlpPrice1();
  snapshot.glpPrice = glpPrice1.reverted ? BigInt.zero() : glpPrice1.value;

  snapshot.glpComposition = rebalanceState.getGlpComposition();
  snapshot.vaultsGlpAlloc = rebalanceState.getGlpAllocation();
  snapshot.vaultsPps = [
    aggregateVaultContract.getVaultPPS(USDC_VAULT_ADDRESS),
    aggregateVaultContract.getVaultPPS(WETH_VAULT_ADDRESS),
    aggregateVaultContract.getVaultPPS(WBTC_VAULT_ADDRESS),
    aggregateVaultContract.getVaultPPS(LINK_VAULT_ADDRESS),
    aggregateVaultContract.getVaultPPS(UNI_VAULT_ADDRESS),
  ];
  snapshot.vaultsTVL = [
    aggregateVaultContract.getVaultTVL(USDC_VAULT_ADDRESS),
    aggregateVaultContract.getVaultTVL(WETH_VAULT_ADDRESS),
    aggregateVaultContract.getVaultTVL(WBTC_VAULT_ADDRESS),
    aggregateVaultContract.getVaultTVL(LINK_VAULT_ADDRESS),
    aggregateVaultContract.getVaultTVL(UNI_VAULT_ADDRESS),
  ];
  snapshot.usdcHedgesAlloc = rebalanceState.getExternalPositions()[0];
  snapshot.wethHedgesAlloc = rebalanceState.getExternalPositions()[1];
  snapshot.wbtcHedgesAlloc = rebalanceState.getExternalPositions()[2];
  snapshot.linkHedgesAlloc = rebalanceState.getExternalPositions()[3];
  snapshot.uniHedgesAlloc = rebalanceState.getExternalPositions()[4];

  const usdcMinPrice = gmxVault.getMinPrice(USDC_ADDRESS);
  const usdcMaxPrice = gmxVault.getMaxPrice(USDC_ADDRESS);

  const wethMinPrice = gmxVault.getMinPrice(WETH_ADDRESS);
  const wethMaxPrice = gmxVault.getMaxPrice(WETH_ADDRESS);

  const wbtcMinPrice = gmxVault.getMinPrice(WBTC_ADDRESS);
  const wbtcMaxPrice = gmxVault.getMaxPrice(WBTC_ADDRESS);

  const linkMinPrice = gmxVault.getMinPrice(LINK_ADDRESS);
  const linkMaxPrice = gmxVault.getMaxPrice(LINK_ADDRESS);

  const uniMinPrice = gmxVault.getMinPrice(UNI_ADDRESS);
  const uniMaxPrice = gmxVault.getMaxPrice(UNI_ADDRESS);

  snapshot.assetsPrices = [
    usdcMinPrice.plus(usdcMaxPrice).div(BigInt.fromString("2")),
    wethMinPrice.plus(wethMaxPrice).div(BigInt.fromString("2")),
    wbtcMinPrice.plus(wbtcMaxPrice).div(BigInt.fromString("2")),
    linkMinPrice.plus(linkMaxPrice).div(BigInt.fromString("2")),
    uniMinPrice.plus(uniMaxPrice).div(BigInt.fromString("2")),
  ];

  snapshot.save();
}

export function handleCloseRebalance(event: CloseRebalance): void {
  const aggregateVaultContract = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);
  const gmxVault = GmxVault.bind(GMX_VAULT_ADDRESS);
  const glpManager = Manager.bind(GMX_VAULT_ADDRESS);
  const snapshot = new TmpRebalanceSnapshot(event.transaction.hash.toHex());
  snapshot.block = event.block.number;
  snapshot.timestamp = event.block.timestamp;
  snapshot.txHash = event.transaction.hash.toHex();
  snapshot.event = "close";

  const rebalanceState = aggregateVaultContract.getRebalanceState();
  const glpPrice1 = glpManager.try_getGlpPrice1();
  snapshot.glpPrice = glpPrice1.reverted ? BigInt.zero() : glpPrice1.value;

  snapshot.glpComposition = rebalanceState.getGlpComposition();
  snapshot.vaultsGlpAlloc = rebalanceState.getGlpAllocation();
  snapshot.vaultsPps = [
    aggregateVaultContract.getVaultPPS(USDC_VAULT_ADDRESS),
    aggregateVaultContract.getVaultPPS(WETH_VAULT_ADDRESS),
    aggregateVaultContract.getVaultPPS(WBTC_VAULT_ADDRESS),
    aggregateVaultContract.getVaultPPS(LINK_VAULT_ADDRESS),
    aggregateVaultContract.getVaultPPS(UNI_VAULT_ADDRESS),
  ];
  snapshot.vaultsTVL = [
    aggregateVaultContract.getVaultTVL(USDC_VAULT_ADDRESS),
    aggregateVaultContract.getVaultTVL(WETH_VAULT_ADDRESS),
    aggregateVaultContract.getVaultTVL(WBTC_VAULT_ADDRESS),
    aggregateVaultContract.getVaultTVL(LINK_VAULT_ADDRESS),
    aggregateVaultContract.getVaultTVL(UNI_VAULT_ADDRESS),
  ];
  snapshot.usdcHedgesAlloc = rebalanceState.getExternalPositions()[0];
  snapshot.wethHedgesAlloc = rebalanceState.getExternalPositions()[1];
  snapshot.wbtcHedgesAlloc = rebalanceState.getExternalPositions()[2];
  snapshot.linkHedgesAlloc = rebalanceState.getExternalPositions()[3];
  snapshot.uniHedgesAlloc = rebalanceState.getExternalPositions()[4];

  const usdcMinPrice = gmxVault.getMinPrice(USDC_ADDRESS);
  const usdcMaxPrice = gmxVault.getMaxPrice(USDC_ADDRESS);

  const wethMinPrice = gmxVault.getMinPrice(WETH_ADDRESS);
  const wethMaxPrice = gmxVault.getMaxPrice(WETH_ADDRESS);

  const wbtcMinPrice = gmxVault.getMinPrice(WBTC_ADDRESS);
  const wbtcMaxPrice = gmxVault.getMaxPrice(WBTC_ADDRESS);

  const linkMinPrice = gmxVault.getMinPrice(LINK_ADDRESS);
  const linkMaxPrice = gmxVault.getMaxPrice(LINK_ADDRESS);

  const uniMinPrice = gmxVault.getMinPrice(UNI_ADDRESS);
  const uniMaxPrice = gmxVault.getMaxPrice(UNI_ADDRESS);

  snapshot.assetsPrices = [
    usdcMinPrice.plus(usdcMaxPrice).div(BigInt.fromString("2")),
    wethMinPrice.plus(wethMaxPrice).div(BigInt.fromString("2")),
    wbtcMinPrice.plus(wbtcMaxPrice).div(BigInt.fromString("2")),
    linkMinPrice.plus(linkMaxPrice).div(BigInt.fromString("2")),
    uniMinPrice.plus(uniMaxPrice).div(BigInt.fromString("2")),
  ];

  snapshot.save();
}

export function handlePaused(event: Paused): void {}

export function handleUnpaused(event: Unpaused): void {}
