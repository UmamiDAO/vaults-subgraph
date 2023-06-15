import { Address, BigInt, Bytes, ethereum, log } from "@graphprotocol/graph-ts";
import {
  CompoundDistributeYield as CompoundDistributeYieldEvent,
  GlpRewardClaimed as GlpRewardClaimedEvent,
} from "../generated/AggregateVault/AggregateVaultHelper";
import {
  AggregateVault,
  CloseRebalance,
  CollectVaultFees,
  OpenRebalance,
} from "../generated/AggregateVault/AggregateVault";
import { GlpManager } from "../generated/AggregateVault/GlpManager";
import {
  CompoundDistributeYield,
  GlpRewardsClaim,
  RebalanceSnapshot,
  VaultFeesCollection,
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
import { GmxVault } from "../generated/AggregateVault/GmxVault";

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

function getVaultTvlEntity(
  blockNumber: BigInt,
  timestamp: BigInt,
  vault: Address,
  event: string
): VaultTVL {
  const vaultEntityId = `${blockNumber}:${timestamp}:${vault.toHexString()}`;
  const vaultTvl = new VaultTVL(vaultEntityId);

  vaultTvl.block = blockNumber;
  vaultTvl.timestamp = timestamp;
  vaultTvl.vault = vault.toHexString();
  vaultTvl.txHash = "";
  vaultTvl.event = event;

  return vaultTvl as VaultTVL;
}

export function handleCollectVaultFees(event: CollectVaultFees): void {
  const feesCollection = new VaultFeesCollection(
    event.transaction.hash.toHex()
  );
  feesCollection.block = event.block.number;
  feesCollection.timestamp = event.block.timestamp;
  feesCollection.vault = event.params._assetVault.toHexString();
  feesCollection.managementFeeInAsset = event.params.managementFeeInAsset;
  feesCollection.performanceFeeInAsset = event.params.performanceFeeInAsset;
  feesCollection.totalVaultFee = event.params.totalVaultFee;
  feesCollection.save();
}

export function handleGlpRewardClaimed(event: GlpRewardClaimedEvent): void {
  const glpRewardsClaim = new GlpRewardsClaim(event.transaction.hash.toHex());

  glpRewardsClaim.block = event.block.number;
  glpRewardsClaim.timestamp = event.block.timestamp;
  glpRewardsClaim.claimed = event.params._amount;
  glpRewardsClaim.save();

  const aggregateVault = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);
  const eventName = "claim";

  const pricePerShareUSDC = aggregateVault.getVaultPPS(USDC_VAULT_ADDRESS);
  const pricePerShareWETH = aggregateVault.getVaultPPS(WETH_VAULT_ADDRESS);
  const pricePerShareWBTC = aggregateVault.getVaultPPS(WBTC_VAULT_ADDRESS);
  const pricePerShareLINK = aggregateVault.getVaultPPS(LINK_VAULT_ADDRESS);
  const pricePerShareUNI = aggregateVault.getVaultPPS(UNI_VAULT_ADDRESS);

  const usdcPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    USDC_VAULT_ADDRESS,
    eventName
  );
  usdcPpsEntity.pricePerShare = pricePerShareUSDC;
  usdcPpsEntity.save();

  const wethPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    WETH_VAULT_ADDRESS,
    eventName
  );
  wethPpsEntity.pricePerShare = pricePerShareWETH;
  wethPpsEntity.save();

  const wbtcPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    WBTC_VAULT_ADDRESS,
    eventName
  );
  wbtcPpsEntity.pricePerShare = pricePerShareWBTC;
  wbtcPpsEntity.save();

  const linkPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    LINK_VAULT_ADDRESS,
    eventName
  );
  linkPpsEntity.pricePerShare = pricePerShareLINK;
  linkPpsEntity.save();

  const uniPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    UNI_VAULT_ADDRESS,
    eventName
  );
  uniPpsEntity.pricePerShare = pricePerShareUNI;
  uniPpsEntity.save();

  const tvlUSDC = aggregateVault.getVaultTVL(USDC_VAULT_ADDRESS);
  const tvlWETH = aggregateVault.getVaultTVL(WETH_VAULT_ADDRESS);
  const tvlWBTC = aggregateVault.getVaultTVL(WBTC_VAULT_ADDRESS);
  const tvlLINK = aggregateVault.getVaultTVL(LINK_VAULT_ADDRESS);
  const tvlUNI = aggregateVault.getVaultTVL(UNI_VAULT_ADDRESS);

  const usdcTvlEntity = getVaultTvlEntity(
    event.block.number,
    event.block.timestamp,
    USDC_VAULT_ADDRESS,
    eventName
  );
  usdcTvlEntity.tvl = tvlUSDC;
  usdcTvlEntity.save();

  const wethTvlEntity = getVaultTvlEntity(
    event.block.number,
    event.block.timestamp,
    WETH_VAULT_ADDRESS,
    eventName
  );
  wethTvlEntity.tvl = tvlWETH;
  wethTvlEntity.save();

  const wbtcTvlEntity = getVaultTvlEntity(
    event.block.number,
    event.block.timestamp,
    WBTC_VAULT_ADDRESS,
    eventName
  );
  wbtcTvlEntity.tvl = tvlWBTC;
  wbtcTvlEntity.save();

  const linkTvlEntity = getVaultTvlEntity(
    event.block.number,
    event.block.timestamp,
    LINK_VAULT_ADDRESS,
    eventName
  );
  linkTvlEntity.tvl = tvlLINK;
  linkTvlEntity.save();

  const uniTvlEntity = getVaultTvlEntity(
    event.block.number,
    event.block.timestamp,
    UNI_VAULT_ADDRESS,
    eventName
  );
  uniTvlEntity.tvl = tvlUNI;
  uniTvlEntity.save();
}

export function handleCompoundDistributeYield(
  event: CompoundDistributeYieldEvent
): void {
  let entity = new CompoundDistributeYield(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  const aggregateVault = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);
  const eventName = "compound-yield";

  entity.timestamp = event.block.timestamp;
  entity.block = event.block.number;
  entity.glpYieldPerVault = event.params.glpYieldPerVault;
  entity.save();

  const pricePerShareUSDC = aggregateVault.getVaultPPS(USDC_VAULT_ADDRESS);
  const pricePerShareWETH = aggregateVault.getVaultPPS(WETH_VAULT_ADDRESS);
  const pricePerShareWBTC = aggregateVault.getVaultPPS(WBTC_VAULT_ADDRESS);
  const pricePerShareLINK = aggregateVault.getVaultPPS(LINK_VAULT_ADDRESS);
  const pricePerShareUNI = aggregateVault.getVaultPPS(UNI_VAULT_ADDRESS);

  const usdcPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    USDC_VAULT_ADDRESS,
    eventName
  );
  usdcPpsEntity.pricePerShare = pricePerShareUSDC;
  usdcPpsEntity.save();

  const wethPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    WETH_VAULT_ADDRESS,
    eventName
  );
  wethPpsEntity.pricePerShare = pricePerShareWETH;
  wethPpsEntity.save();

  const wbtcPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    WBTC_VAULT_ADDRESS,
    eventName
  );
  wbtcPpsEntity.pricePerShare = pricePerShareWBTC;
  wbtcPpsEntity.save();

  const linkPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    LINK_VAULT_ADDRESS,
    eventName
  );
  linkPpsEntity.pricePerShare = pricePerShareLINK;
  linkPpsEntity.save();

  const uniPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    UNI_VAULT_ADDRESS,
    eventName
  );
  uniPpsEntity.pricePerShare = pricePerShareUNI;
  uniPpsEntity.save();

  const tvlUSDC = aggregateVault.getVaultTVL(USDC_VAULT_ADDRESS);
  const tvlWETH = aggregateVault.getVaultTVL(WETH_VAULT_ADDRESS);
  const tvlWBTC = aggregateVault.getVaultTVL(WBTC_VAULT_ADDRESS);
  const tvlLINK = aggregateVault.getVaultTVL(LINK_VAULT_ADDRESS);
  const tvlUNI = aggregateVault.getVaultTVL(UNI_VAULT_ADDRESS);

  const usdcTvlEntity = getVaultTvlEntity(
    event.block.number,
    event.block.timestamp,
    USDC_VAULT_ADDRESS,
    eventName
  );
  usdcTvlEntity.tvl = tvlUSDC;
  usdcTvlEntity.save();

  const wethTvlEntity = getVaultTvlEntity(
    event.block.number,
    event.block.timestamp,
    WETH_VAULT_ADDRESS,
    eventName
  );
  wethTvlEntity.tvl = tvlWETH;
  wethTvlEntity.save();

  const wbtcTvlEntity = getVaultTvlEntity(
    event.block.number,
    event.block.timestamp,
    WBTC_VAULT_ADDRESS,
    eventName
  );
  wbtcTvlEntity.tvl = tvlWBTC;
  wbtcTvlEntity.save();

  const linkTvlEntity = getVaultTvlEntity(
    event.block.number,
    event.block.timestamp,
    LINK_VAULT_ADDRESS,
    eventName
  );
  linkTvlEntity.tvl = tvlLINK;
  linkTvlEntity.save();

  const uniTvlEntity = getVaultTvlEntity(
    event.block.number,
    event.block.timestamp,
    UNI_VAULT_ADDRESS,
    eventName
  );
  uniTvlEntity.tvl = tvlUNI;
  uniTvlEntity.save();
}

export function handleOpenRebalance(event: OpenRebalance): void {
  const aggregateVault = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);
  const gmxVaultContract = GmxVault.bind(GMX_VAULT_ADDRESS);
  const glpManagerContract = GlpManager.bind(GLP_HANDLER_ADDRESS);
  const eventName = "open";

  const pricePerShareUSDC = aggregateVault.getVaultPPS(USDC_VAULT_ADDRESS);
  const pricePerShareWETH = aggregateVault.getVaultPPS(WETH_VAULT_ADDRESS);
  const pricePerShareWBTC = aggregateVault.getVaultPPS(WBTC_VAULT_ADDRESS);
  const pricePerShareLINK = aggregateVault.getVaultPPS(LINK_VAULT_ADDRESS);
  const pricePerShareUNI = aggregateVault.getVaultPPS(UNI_VAULT_ADDRESS);

  const usdcPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    USDC_VAULT_ADDRESS,
    eventName
  );
  usdcPpsEntity.pricePerShare = pricePerShareUSDC;
  usdcPpsEntity.save();

  const wethPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    WETH_VAULT_ADDRESS,
    eventName
  );
  wethPpsEntity.pricePerShare = pricePerShareWETH;
  wethPpsEntity.save();

  const wbtcPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    WBTC_VAULT_ADDRESS,
    eventName
  );
  wbtcPpsEntity.pricePerShare = pricePerShareWBTC;
  wbtcPpsEntity.save();

  const linkPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    LINK_VAULT_ADDRESS,
    eventName
  );
  linkPpsEntity.pricePerShare = pricePerShareLINK;
  linkPpsEntity.save();

  const uniPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    UNI_VAULT_ADDRESS,
    eventName
  );
  uniPpsEntity.pricePerShare = pricePerShareUNI;
  uniPpsEntity.save();

  const tvlUSDC = aggregateVault.getVaultTVL(USDC_VAULT_ADDRESS);
  const tvlWETH = aggregateVault.getVaultTVL(WETH_VAULT_ADDRESS);
  const tvlWBTC = aggregateVault.getVaultTVL(WBTC_VAULT_ADDRESS);
  const tvlLINK = aggregateVault.getVaultTVL(LINK_VAULT_ADDRESS);
  const tvlUNI = aggregateVault.getVaultTVL(UNI_VAULT_ADDRESS);

  const usdcTvlEntity = getVaultTvlEntity(
    event.block.number,
    event.block.timestamp,
    USDC_VAULT_ADDRESS,
    eventName
  );
  usdcTvlEntity.tvl = tvlUSDC;
  usdcTvlEntity.save();

  const wethTvlEntity = getVaultTvlEntity(
    event.block.number,
    event.block.timestamp,
    WETH_VAULT_ADDRESS,
    eventName
  );
  wethTvlEntity.tvl = tvlWETH;
  wethTvlEntity.save();

  const wbtcTvlEntity = getVaultTvlEntity(
    event.block.number,
    event.block.timestamp,
    WBTC_VAULT_ADDRESS,
    eventName
  );
  wbtcTvlEntity.tvl = tvlWBTC;
  wbtcTvlEntity.save();

  const linkTvlEntity = getVaultTvlEntity(
    event.block.number,
    event.block.timestamp,
    LINK_VAULT_ADDRESS,
    eventName
  );
  linkTvlEntity.tvl = tvlLINK;
  linkTvlEntity.save();

  const uniTvlEntity = getVaultTvlEntity(
    event.block.number,
    event.block.timestamp,
    UNI_VAULT_ADDRESS,
    eventName
  );
  uniTvlEntity.tvl = tvlUNI;
  uniTvlEntity.save();

  const snapshot = new RebalanceSnapshot(event.transaction.hash.toHex());
  snapshot.block = event.block.number;
  snapshot.timestamp = event.block.timestamp;
  snapshot.txHash = event.transaction.hash.toHex();
  snapshot.event = eventName;

  snapshot.vaultsPps = [
    pricePerShareUSDC,
    pricePerShareWETH,
    pricePerShareWBTC,
    pricePerShareLINK,
    pricePerShareUNI,
  ];
  snapshot.vaultsTVL = [tvlUSDC, tvlWETH, tvlWBTC, tvlLINK, tvlUNI];

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
}

export function handleCloseRebalance(event: CloseRebalance): void {
  const aggregateVault = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);
  const gmxVaultContract = GmxVault.bind(GMX_VAULT_ADDRESS);
  const glpManagerContract = GlpManager.bind(GLP_HANDLER_ADDRESS);
  const eventName = "close";

  const pricePerShareUSDC = aggregateVault.getVaultPPS(USDC_VAULT_ADDRESS);
  const pricePerShareWETH = aggregateVault.getVaultPPS(WETH_VAULT_ADDRESS);
  const pricePerShareWBTC = aggregateVault.getVaultPPS(WBTC_VAULT_ADDRESS);
  const pricePerShareLINK = aggregateVault.getVaultPPS(LINK_VAULT_ADDRESS);
  const pricePerShareUNI = aggregateVault.getVaultPPS(UNI_VAULT_ADDRESS);

  const usdcPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    USDC_VAULT_ADDRESS,
    eventName
  );
  usdcPpsEntity.pricePerShare = pricePerShareUSDC;
  usdcPpsEntity.save();

  const wethPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    WETH_VAULT_ADDRESS,
    eventName
  );
  wethPpsEntity.pricePerShare = pricePerShareWETH;
  wethPpsEntity.save();

  const wbtcPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    WBTC_VAULT_ADDRESS,
    eventName
  );
  wbtcPpsEntity.pricePerShare = pricePerShareWBTC;
  wbtcPpsEntity.save();

  const linkPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    LINK_VAULT_ADDRESS,
    eventName
  );
  linkPpsEntity.pricePerShare = pricePerShareLINK;
  linkPpsEntity.save();

  const uniPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    UNI_VAULT_ADDRESS,
    eventName
  );
  uniPpsEntity.pricePerShare = pricePerShareUNI;
  uniPpsEntity.save();

  const tvlUSDC = aggregateVault.getVaultTVL(USDC_VAULT_ADDRESS);
  const tvlWETH = aggregateVault.getVaultTVL(WETH_VAULT_ADDRESS);
  const tvlWBTC = aggregateVault.getVaultTVL(WBTC_VAULT_ADDRESS);
  const tvlLINK = aggregateVault.getVaultTVL(LINK_VAULT_ADDRESS);
  const tvlUNI = aggregateVault.getVaultTVL(UNI_VAULT_ADDRESS);

  const usdcTvlEntity = getVaultTvlEntity(
    event.block.number,
    event.block.timestamp,
    USDC_VAULT_ADDRESS,
    eventName
  );
  usdcTvlEntity.tvl = tvlUSDC;
  usdcTvlEntity.save();

  const wethTvlEntity = getVaultTvlEntity(
    event.block.number,
    event.block.timestamp,
    WETH_VAULT_ADDRESS,
    eventName
  );
  wethTvlEntity.tvl = tvlWETH;
  wethTvlEntity.save();

  const wbtcTvlEntity = getVaultTvlEntity(
    event.block.number,
    event.block.timestamp,
    WBTC_VAULT_ADDRESS,
    eventName
  );
  wbtcTvlEntity.tvl = tvlWBTC;
  wbtcTvlEntity.save();

  const linkTvlEntity = getVaultTvlEntity(
    event.block.number,
    event.block.timestamp,
    LINK_VAULT_ADDRESS,
    eventName
  );
  linkTvlEntity.tvl = tvlLINK;
  linkTvlEntity.save();

  const uniTvlEntity = getVaultTvlEntity(
    event.block.number,
    event.block.timestamp,
    UNI_VAULT_ADDRESS,
    eventName
  );
  uniTvlEntity.tvl = tvlUNI;
  uniTvlEntity.save();

  const snapshot = new RebalanceSnapshot(event.transaction.hash.toHex());
  snapshot.block = event.block.number;
  snapshot.timestamp = event.block.timestamp;
  snapshot.txHash = event.transaction.hash.toHex();
  snapshot.event = eventName;

  snapshot.vaultsPps = [
    pricePerShareUSDC,
    pricePerShareWETH,
    pricePerShareWBTC,
    pricePerShareLINK,
    pricePerShareUNI,
  ];
  snapshot.vaultsTVL = [tvlUSDC, tvlWETH, tvlWBTC, tvlLINK, tvlUNI];

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
}
