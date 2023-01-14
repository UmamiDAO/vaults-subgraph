import { ethereum } from "@graphprotocol/graph-ts";
import {
  AggregateVault,
  CloseRebalance,
  CollectVaultFees,
  Cycle,
  OpenRebalance,
  Paused,
  Unpaused,
} from "../generated/AggregateVault/AggregateVault";
import {
  VaultFeesCollection,
  VaultPricePerShare,
  VaultTVL,
} from "../generated/schema";
import { AGGREGATE_VAULT_ADDRESS, VAULTS_ARRAY } from "./constants";

// It is also possible to access smart contracts from mappings. For
// example, the contract that has emitted the event can be connected to
// with:
//
// let contract = Contract.bind(event.address)
//
// The following functions can then be called on this contract to access
// state variables and other data:
//
// - contract.ADMIN_ROLE(...)
// - contract.AUTH(...)
// - contract.SCALE(...)
// - contract.STORAGE_SLOT(...)
// - contract.WETH(...)
// - contract.currentCallbackHandler(...)
// - contract.defaultHandlers(...)
// - contract.executeSwap(...)
// - contract.fsGLP(...)
// - contract.getRebalanceState(...)
// - contract.getVaultFromAsset(...)
// - contract.getVaultIndex(...)
// - contract.getVaultPPS(...)
// - contract.getVaultTVL(...)
// - contract.glpCloseSlippage(...)
// - contract.handleDeposit(...)
// - contract.handleWithdraw(...)
// - contract.handlerContractCallbacks(...)
// - contract.handlerContracts(...)
// - contract.paused(...)
// - contract.previewDepositFee(...)
// - contract.previewWithdrawalFee(...)
// - contract.router(...)
// - contract.swapHandlers(...)
// - contract.vaultGlpAttribution(...)
// - contract.vaultGlpAttribution(...)

export function handleBlock(block: ethereum.Block): void {
  const aggregateVaultContract = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);
  VAULTS_ARRAY.map((vaultAddress) => {
    const entityId = `${block.timestamp}:${vaultAddress}`;

    /** Vault price per share */
    const vaultPps = new VaultPricePerShare(entityId);
    vaultPps.block = block.number;
    vaultPps.timestamp = block.timestamp;
    vaultPps.vault = vaultAddress.toString();
    vaultPps.pricePerShare = aggregateVaultContract.getVaultPPS(vaultAddress);
    vaultPps.save();
  });
}

export function handleCloseRebalance(event: CloseRebalance): void {
  const aggregateVaultContract = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);
  VAULTS_ARRAY.map((vaultAddress) => {
    const entityId = `${event.block.timestamp}:${vaultAddress}`;

    /** Vault TVL */
    const vaultTvl = new VaultTVL(entityId);
    vaultTvl.block = event.block.number;
    vaultTvl.timestamp = event.block.timestamp;
    vaultTvl.vault = vaultAddress.toString();
    vaultTvl.tvl = aggregateVaultContract.getVaultTVL(vaultAddress);
    vaultTvl.save();
  });
}

export function handleCollectVaultFees(event: CollectVaultFees): void {
  const vaultAddress = event.params._assetVault;
  const entityId = `${event.block.timestamp}:${vaultAddress}`;

  /** Vault fees collection */
  const vaultFeesCollection = new VaultFeesCollection(entityId);
  vaultFeesCollection.block = event.block.number;
  vaultFeesCollection.timestamp = event.block.timestamp;
  vaultFeesCollection.vault = vaultAddress.toString();
  vaultFeesCollection.managementFees = event.params.managementFeeInAsset;
  vaultFeesCollection.performanceFees = event.params.performanceFeeInAsset;
  vaultFeesCollection.totalFees = event.params.totalVaultFee;
  vaultFeesCollection.save();
}

export function handleCycle(event: Cycle): void {}

export function handleOpenRebalance(event: OpenRebalance): void {}

export function handlePaused(event: Paused): void {}

export function handleUnpaused(event: Unpaused): void {}
