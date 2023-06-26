import { Address, BigInt } from "@graphprotocol/graph-ts";
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
import {
  CompoundDistributeYield,
  GlpRewardsClaim,
  VaultFeesCollection,
  VaultPricePerShare,
  VaultTVL,
} from "../generated/schema";
import {
  AGGREGATE_VAULT_ADDRESS,
  LINK_VAULT_ADDRESS,
  UNI_VAULT_ADDRESS,
  USDC_VAULT_ADDRESS,
  WBTC_VAULT_ADDRESS,
  WETH_VAULT_ADDRESS,
} from "./constants";

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
}

export function handleCloseRebalance(event: CloseRebalance): void {
  const aggregateVault = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);
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
}
