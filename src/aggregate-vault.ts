import { BigInt, Bytes, ethereum, log } from "@graphprotocol/graph-ts";
import {
  AggregateVault,
  CloseRebalance,
  CollectVaultFees,
  Cycle,
  OpenRebalance,
  Paused,
  Unpaused,
} from "../generated/AggregateVault/AggregateVault";
import { GmxVault } from "../generated/AggregateVault/GmxVault";
import { Manager } from "../generated/AggregateVault/Manager";
import {
  VaultHelper,
  VaultHelper__getVaultStateResult_vaultStateStruct,
} from "../generated/AggregateVault/VaultHelper";
import {
  TmpRebalanceSnapshot,
  VaultFeesCollection,
  VaultPpsLastTimestamp,
  VaultPricePerShare,
  VaultTVL,
} from "../generated/schema";
import {
  AGGREGATE_VAULT_ADDRESS,
  GLP_HANDLER_ADDRESS,
  GMX_VAULT_ADDRESS,
  KEEPER_ADDRESS,
  LINK_ADDRESS,
  LINK_VAULT_ADDRESS,
  UNI_ADDRESS,
  UNI_VAULT_ADDRESS,
  USDC_ADDRESS,
  USDC_VAULT_ADDRESS,
  VAULT_HELPER_ADDRESS,
  WBTC_ADDRESS,
  WBTC_VAULT_ADDRESS,
  WETH_ADDRESS,
  WETH_VAULT_ADDRESS,
} from "./constants";

export function handleBlock(block: ethereum.Block): void {
  let lastPpsTimestamp = VaultPpsLastTimestamp.load("timestamp");
  const encodedFunction =
    "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000178a79da65c364f0ce0000000000000000000000000000000000000000000000113df00d90cebf80e700000000000000000000000000000000000000000000000c12fe610f9043084c000000000000000000000000000000000000000000000000b33aa75c3a1cd8250000000000000000000000000000000000000000000000007c11da0de5c1962f0000000000000000000000000000000000000000000000113df00d90cebf472300000000000000000000000000000000000000000000000d8ced23fe82e3cab20000000000000000000000000000000000000000000000097d3886e3853f355e0000000000000000000000000000000000000000000000008cdb4f38b3c6d6e50000000000000000000000000000000000000000000000006181bb089385ecc400000000000000000000000000000000000000000000000c12fe610f9042fc05000000000000000000000000000000000000000000000009dc488ab405e3b4be000000000000000000000000000000000000000000000006e7b4b87b20048fab000000000000000000000000000000000000000000000000667fcb77b8e4a31700000000000000000000000000000000000000000000000046f442ace18aab50000000000000000000000000000000000000000000000000b33aa75c3a1cda620000000000000000000000000000000000000000000000008a2a946a697444ce00000000000000000000000000000000000000000000000060c1521118f12393000000000000000000000000000000000000000000000000059c3b57fe1c075800000000000000000000000000000000000000000000000003e237edc980792f0000000000000000000000000000000000000000000000007c11da0de5c195b900000000000000000000000000000000000000000000000060d02b37bd506cf400000000000000000000000000000000000000000000000043cbdd8d6e599b6b00000000000000000000000000000000000000000000000003ee5e26916b70c300000000000000000000000000000000000000000000000002b8a623d591c040";
  let decoded = ethereum.decode(
    "int[5][5]",
    Bytes.fromHexString(encodedFunction)
  );
  if (decoded != null) {
    log.error("decoded !", [decoded.toBigIntMatrix().toString()]);
  } else {
    log.error("decoded null", []);
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
  const gmxVaultContract = GmxVault.bind(GMX_VAULT_ADDRESS);
  const glpManagerContract = Manager.bind(GLP_HANDLER_ADDRESS);
  const vaultHelperContract = VaultHelper.bind(VAULT_HELPER_ADDRESS);

  const snapshot = new TmpRebalanceSnapshot(event.transaction.hash.toHex());

  snapshot.block = event.block.number;
  snapshot.timestamp = event.block.timestamp;
  snapshot.txHash = event.transaction.hash.toHex();
  snapshot.event = "open";

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

  const rebalanceState = aggregateVaultContract.getRebalanceState();

  snapshot.glpComposition = rebalanceState.getGlpComposition();
  snapshot.vaultsGlpAlloc = rebalanceState.getGlpAllocation();
  snapshot.aggregatePositions = rebalanceState.getAggregatePositions();

  snapshot.usdcVaultExposures = rebalanceState.getExternalPositions()[0];
  snapshot.wethVaultExposures = rebalanceState.getExternalPositions()[1];
  snapshot.wbtcVaultExposures = rebalanceState.getExternalPositions()[2];
  snapshot.linkVaultExposures = rebalanceState.getExternalPositions()[3];
  snapshot.uniVaultExposures = rebalanceState.getExternalPositions()[4];

  snapshot.usdcVaultInternalNetting = vaultHelperContract.getNettedPositions()[0];
  snapshot.wethVaultInternalNetting = vaultHelperContract.getNettedPositions()[1];
  snapshot.wbtcVaultInternalNetting = vaultHelperContract.getNettedPositions()[2];
  snapshot.linkVaultInternalNetting = vaultHelperContract.getNettedPositions()[3];
  snapshot.uniVaultInternalNetting = vaultHelperContract.getNettedPositions()[4];

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
}

export function handleCloseRebalance(event: CloseRebalance): void {
  const aggregateVaultContract = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);
  const gmxVaultContract = GmxVault.bind(GMX_VAULT_ADDRESS);
  const glpManagerContract = Manager.bind(GLP_HANDLER_ADDRESS);
  const vaultHelperContract = VaultHelper.bind(VAULT_HELPER_ADDRESS);

  const snapshot = new TmpRebalanceSnapshot(event.transaction.hash.toHex());

  snapshot.block = event.block.number;
  snapshot.timestamp = event.block.timestamp;
  snapshot.txHash = event.transaction.hash.toHex();
  snapshot.event = "close";

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

  const rebalanceState = aggregateVaultContract.getRebalanceState();

  snapshot.glpComposition = rebalanceState.getGlpComposition();
  snapshot.vaultsGlpAlloc = rebalanceState.getGlpAllocation();

  snapshot.aggregatePositions = rebalanceState.getAggregatePositions();
  snapshot.usdcVaultExposures = rebalanceState.getExternalPositions()[0];
  snapshot.wethVaultExposures = rebalanceState.getExternalPositions()[1];
  snapshot.wbtcVaultExposures = rebalanceState.getExternalPositions()[2];
  snapshot.linkVaultExposures = rebalanceState.getExternalPositions()[3];
  snapshot.uniVaultExposures = rebalanceState.getExternalPositions()[4];

  const encodedFunction =
    "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000178a79da65c364f0ce0000000000000000000000000000000000000000000000113df00d90cebf80e700000000000000000000000000000000000000000000000c12fe610f9043084c000000000000000000000000000000000000000000000000b33aa75c3a1cd8250000000000000000000000000000000000000000000000007c11da0de5c1962f0000000000000000000000000000000000000000000000113df00d90cebf472300000000000000000000000000000000000000000000000d8ced23fe82e3cab20000000000000000000000000000000000000000000000097d3886e3853f355e0000000000000000000000000000000000000000000000008cdb4f38b3c6d6e50000000000000000000000000000000000000000000000006181bb089385ecc400000000000000000000000000000000000000000000000c12fe610f9042fc05000000000000000000000000000000000000000000000009dc488ab405e3b4be000000000000000000000000000000000000000000000006e7b4b87b20048fab000000000000000000000000000000000000000000000000667fcb77b8e4a31700000000000000000000000000000000000000000000000046f442ace18aab50000000000000000000000000000000000000000000000000b33aa75c3a1cda620000000000000000000000000000000000000000000000008a2a946a697444ce00000000000000000000000000000000000000000000000060c1521118f12393000000000000000000000000000000000000000000000000059c3b57fe1c075800000000000000000000000000000000000000000000000003e237edc980792f0000000000000000000000000000000000000000000000007c11da0de5c195b900000000000000000000000000000000000000000000000060d02b37bd506cf400000000000000000000000000000000000000000000000043cbdd8d6e599b6b00000000000000000000000000000000000000000000000003ee5e26916b70c300000000000000000000000000000000000000000000000002b8a623d591c040";
  let decoded = ethereum.decode(
    "int[5][5]",
    Bytes.fromHexString(encodedFunction)
  );
  if (decoded) {
    log.error("decoded :", [decoded.toBigIntMatrix().toString()]);

    const matrix = decoded.toBigIntMatrix();
    snapshot.usdcVaultInternalNetting = matrix[0];
    snapshot.wethVaultInternalNetting = matrix[1];
    snapshot.wbtcVaultInternalNetting = matrix[2];
    snapshot.linkVaultInternalNetting = matrix[3];
    snapshot.uniVaultInternalNetting = matrix[4];
  } else {
    log.error("decoded undefined", []);
    const emptyArray = [
      BigInt.zero(),
      BigInt.zero(),
      BigInt.zero(),
      BigInt.zero(),
      BigInt.zero(),
    ];
    snapshot.usdcVaultInternalNetting = emptyArray;
    snapshot.wethVaultInternalNetting = emptyArray;
    snapshot.wbtcVaultInternalNetting = emptyArray;
    snapshot.linkVaultInternalNetting = emptyArray;
    snapshot.uniVaultInternalNetting = emptyArray;
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
}

export function handlePaused(event: Paused): void {}

export function handleUnpaused(event: Unpaused): void {}
