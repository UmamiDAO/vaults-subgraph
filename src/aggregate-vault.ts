import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import {
  CollectVaultFees as CollectVaultFeesEvent,
  CompoundDistributeYield as CompoundDistributeYieldEvent,
} from "../generated/AggregateVault/AggregateVaultHelper";
import { AggregateVault } from "../generated/AggregateVault/AggregateVault";
import {
  CompoundDistributeYield,
  VaultFeesCollection,
  VaultPricePerShare,
} from "../generated/schema";
import {
  AGGREGATE_VAULT_ADDRESS,
  AGGREGATE_VAULT_HELPER_ADDRESS,
  LINK_VAULT_ADDRESS,
  UNI_VAULT_ADDRESS,
  USDC_VAULT_ADDRESS,
  WBTC_VAULT_ADDRESS,
  WETH_VAULT_ADDRESS,
} from "./constants";

function getVaultPpsEntity(
  blockNumber: BigInt,
  timestamp: BigInt,
  vault: Address
): VaultPricePerShare {
  const vaultEntityId = `${blockNumber}:${timestamp}:${vault.toHexString()}`;
  const vaultPps = new VaultPricePerShare(vaultEntityId);

  vaultPps.block = blockNumber;
  vaultPps.timestamp = timestamp;
  vaultPps.vault = vault.toHexString();

  return vaultPps as VaultPricePerShare;
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
    USDC_VAULT_ADDRESS
  );
  usdcPpsEntity.pricePerShare = pricePerShareUSDC;
  usdcPpsEntity.save();

  const wethPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    WETH_VAULT_ADDRESS
  );
  wethPpsEntity.pricePerShare = pricePerShareWETH;
  wethPpsEntity.save();

  const wbtcPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    WBTC_VAULT_ADDRESS
  );
  wbtcPpsEntity.pricePerShare = pricePerShareWBTC;
  wbtcPpsEntity.save();

  const linkPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    LINK_VAULT_ADDRESS
  );
  linkPpsEntity.pricePerShare = pricePerShareLINK;
  linkPpsEntity.save();

  const uniPpsEntity = getVaultPpsEntity(
    event.block.number,
    event.block.timestamp,
    UNI_VAULT_ADDRESS
  );
  uniPpsEntity.pricePerShare = pricePerShareUNI;
  uniPpsEntity.save();
}
