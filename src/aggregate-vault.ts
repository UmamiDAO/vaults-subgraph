import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  CompoundDistributeYield as CompoundDistributeYieldEvent,
  GlpRewardClaimed as GlpRewardClaimedEvent,
} from "../generated/AggregateVault/AggregateVaultHelper";
import { AggregateVault } from "../generated/AggregateVault/AggregateVault";
import {
  CompoundDistributeYield,
  GlpRewardsClaim,
  VaultPricePerShare,
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

export function handleGlpRewardClaimed(event: GlpRewardClaimedEvent): void {
  const glpRewardsClaim = new GlpRewardsClaim(event.transaction.hash.toHex());

  glpRewardsClaim.block = event.block.number;
  glpRewardsClaim.timestamp = event.block.timestamp;
  glpRewardsClaim.claimed = event.params._amount;
  glpRewardsClaim.save();

  const aggregateVault = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);

  const pricePerShareUSDC = aggregateVault.getVaultPPS(USDC_VAULT_ADDRESS);
  const pricePerShareWETH = aggregateVault.getVaultPPS(WETH_VAULT_ADDRESS);
  const pricePerShareWBTC = aggregateVault.getVaultPPS(WBTC_VAULT_ADDRESS);
  const pricePerShareLINK = aggregateVault.getVaultPPS(LINK_VAULT_ADDRESS);
  const pricePerShareUNI = aggregateVault.getVaultPPS(UNI_VAULT_ADDRESS);

  const usdcPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    USDC_VAULT_ADDRESS,
    "close"
  );
  usdcPpsEntity.pricePerShare = pricePerShareUSDC;
  usdcPpsEntity.save();

  const wethPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    WETH_VAULT_ADDRESS,
    "close"
  );
  wethPpsEntity.pricePerShare = pricePerShareWETH;
  wethPpsEntity.save();

  const wbtcPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    WBTC_VAULT_ADDRESS,
    "close"
  );
  wbtcPpsEntity.pricePerShare = pricePerShareWBTC;
  wbtcPpsEntity.save();

  const linkPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    LINK_VAULT_ADDRESS,
    "close"
  );
  linkPpsEntity.pricePerShare = pricePerShareLINK;
  linkPpsEntity.save();

  const uniPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    UNI_VAULT_ADDRESS,
    "close"
  );
  uniPpsEntity.pricePerShare = pricePerShareUNI;
  uniPpsEntity.save();
}

export function handleCompoundDistributeYield(
  event: CompoundDistributeYieldEvent
): void {
  let entity = new CompoundDistributeYield(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  const aggregateVault = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);

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
    "compound-yield"
  );
  usdcPpsEntity.pricePerShare = pricePerShareUSDC;
  usdcPpsEntity.save();

  const wethPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    WETH_VAULT_ADDRESS,
    "compound-yield"
  );
  wethPpsEntity.pricePerShare = pricePerShareWETH;
  wethPpsEntity.save();

  const wbtcPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    WBTC_VAULT_ADDRESS,
    "compound-yield"
  );
  wbtcPpsEntity.pricePerShare = pricePerShareWBTC;
  wbtcPpsEntity.save();

  const linkPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    LINK_VAULT_ADDRESS,
    "compound-yield"
  );
  linkPpsEntity.pricePerShare = pricePerShareLINK;
  linkPpsEntity.save();

  const uniPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    UNI_VAULT_ADDRESS,
    "compound-yield"
  );
  uniPpsEntity.pricePerShare = pricePerShareUNI;
  uniPpsEntity.save();
}
