import { Address, ethereum } from "@graphprotocol/graph-ts";
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
import {
  AGGREGATE_VAULT_ADDRESS,
  LINK_VAULT_ADDRESS,
  UNI_VAULT_ADDRESS,
  USDC_VAULT_ADDRESS,
  VAULTS_ARRAY,
  WBTC_VAULT_ADDRESS,
  WETH_VAULT_ADDRESS,
} from "./constants";

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

  /** USDC vault price per share */
  const usdcVaultEntityId = `${block.timestamp}:${USDC_VAULT_ADDRESS}`;
  const usdcVaultPps = new VaultPricePerShare(usdcVaultEntityId);

  usdcVaultPps.block = block.number;
  usdcVaultPps.timestamp = block.timestamp;
  usdcVaultPps.vault = USDC_VAULT_ADDRESS.toString();
  usdcVaultPps.pricePerShare = aggregateVaultContract.getVaultPPS(
    USDC_VAULT_ADDRESS
  );
  usdcVaultPps.save();

  /** WETH vault price per share */
  const wethVaultEntityId = `${block.timestamp}:${WETH_VAULT_ADDRESS}`;
  const wethVaultPps = new VaultPricePerShare(wethVaultEntityId);

  wethVaultPps.block = block.number;
  wethVaultPps.timestamp = block.timestamp;
  wethVaultPps.vault = WETH_VAULT_ADDRESS.toString();
  wethVaultPps.pricePerShare = aggregateVaultContract.getVaultPPS(
    WETH_VAULT_ADDRESS
  );
  wethVaultPps.save();

  /** WBTC vault price per share */
  const wbtcVaultEntityId = `${block.timestamp}:${WBTC_VAULT_ADDRESS}`;
  const wbtcVaultPps = new VaultPricePerShare(wbtcVaultEntityId);

  wbtcVaultPps.block = block.number;
  wbtcVaultPps.timestamp = block.timestamp;
  wbtcVaultPps.vault = WBTC_VAULT_ADDRESS.toString();
  wbtcVaultPps.pricePerShare = aggregateVaultContract.getVaultPPS(
    WBTC_VAULT_ADDRESS
  );
  wbtcVaultPps.save();

  /** UNI vault price per share */
  const uniVaultEntityId = `${block.timestamp}:${UNI_VAULT_ADDRESS}`;
  const uniVaultPps = new VaultPricePerShare(uniVaultEntityId);

  uniVaultPps.block = block.number;
  uniVaultPps.timestamp = block.timestamp;
  uniVaultPps.vault = UNI_VAULT_ADDRESS.toString();
  uniVaultPps.pricePerShare = aggregateVaultContract.getVaultPPS(
    UNI_VAULT_ADDRESS
  );
  uniVaultPps.save();

  /** LINK vault price per share */
  const linkVaultEntityId = `${block.timestamp}:${LINK_VAULT_ADDRESS}`;
  const linkVaultPps = new VaultPricePerShare(linkVaultEntityId);

  linkVaultPps.block = block.number;
  linkVaultPps.timestamp = block.timestamp;
  linkVaultPps.vault = LINK_VAULT_ADDRESS.toString();
  linkVaultPps.pricePerShare = aggregateVaultContract.getVaultPPS(
    LINK_VAULT_ADDRESS
  );
  linkVaultPps.save();
}

export function handleCloseRebalance(event: CloseRebalance): void {
  const aggregateVaultContract = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);
  /** USDC vault price per share */
  const usdcVaultEntityId = `${event.block.timestamp}:${USDC_VAULT_ADDRESS}`;
  const usdcVaultTvl = new VaultTVL(usdcVaultEntityId);

  usdcVaultTvl.block = event.block.number;
  usdcVaultTvl.timestamp = event.block.timestamp;
  usdcVaultTvl.vault = USDC_VAULT_ADDRESS.toString();
  usdcVaultTvl.tvl = aggregateVaultContract.getVaultTVL(USDC_VAULT_ADDRESS);
  usdcVaultTvl.save();

  /** WETH vault TVL */
  const wethVaultEntityId = `${event.block.timestamp}:${WETH_VAULT_ADDRESS}`;
  const wethVaulTvl = new VaultTVL(wethVaultEntityId);

  wethVaulTvl.block = event.block.number;
  wethVaulTvl.timestamp = event.block.timestamp;
  wethVaulTvl.vault = WETH_VAULT_ADDRESS.toString();
  wethVaulTvl.tvl = aggregateVaultContract.getVaultTVL(WETH_VAULT_ADDRESS);
  wethVaulTvl.save();

  /** WBTC vault TVL */
  const wbtcVaultEntityId = `${event.block.timestamp}:${WBTC_VAULT_ADDRESS}`;
  const wbtcVaultTvl = new VaultTVL(wbtcVaultEntityId);

  wbtcVaultTvl.block = event.block.number;
  wbtcVaultTvl.timestamp = event.block.timestamp;
  wbtcVaultTvl.vault = WBTC_VAULT_ADDRESS.toString();
  wbtcVaultTvl.tvl = aggregateVaultContract.getVaultTVL(WBTC_VAULT_ADDRESS);
  wbtcVaultTvl.save();

  /** UNI vault TVL */
  const uniVaultEntityId = `${event.block.timestamp}:${UNI_VAULT_ADDRESS}`;
  const uniVaultTvl = new VaultTVL(uniVaultEntityId);

  uniVaultTvl.block = event.block.number;
  uniVaultTvl.timestamp = event.block.timestamp;
  uniVaultTvl.vault = UNI_VAULT_ADDRESS.toString();
  uniVaultTvl.tvl = aggregateVaultContract.getVaultTVL(UNI_VAULT_ADDRESS);
  uniVaultTvl.save();

  /** LINK vault TVL */
  const linkVaultEntityId = `${event.block.timestamp}:${LINK_VAULT_ADDRESS}`;
  const linkVaultTvl = new VaultTVL(linkVaultEntityId);

  linkVaultTvl.block = event.block.number;
  linkVaultTvl.timestamp = event.block.timestamp;
  linkVaultTvl.vault = LINK_VAULT_ADDRESS.toString();
  linkVaultTvl.tvl = aggregateVaultContract.getVaultTVL(LINK_VAULT_ADDRESS);
  linkVaultTvl.save();
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