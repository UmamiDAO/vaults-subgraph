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
  const usdcVaultEntityId = `${
    block.timestamp
  }:${USDC_VAULT_ADDRESS.toHexString()}`;
  const usdcVaultPps = new VaultPricePerShare(usdcVaultEntityId);

  usdcVaultPps.block = block.number;
  usdcVaultPps.timestamp = block.timestamp;
  usdcVaultPps.vault = USDC_VAULT_ADDRESS.toHexString();
  const usdcPpsTry = aggregateVaultContract.try_getVaultPPS(USDC_VAULT_ADDRESS);
  usdcVaultPps.pricePerShare = usdcPpsTry.reverted
    ? BigInt.zero()
    : usdcPpsTry.value;
  usdcVaultPps.save();

  /** WETH vault price per share */
  const wethVaultEntityId = `${
    block.timestamp
  }:${WETH_VAULT_ADDRESS.toHexString()}`;
  const wethVaultPps = new VaultPricePerShare(wethVaultEntityId);

  wethVaultPps.block = block.number;
  wethVaultPps.timestamp = block.timestamp;
  wethVaultPps.vault = WETH_VAULT_ADDRESS.toHexString();
  const wethPpsTry = aggregateVaultContract.try_getVaultPPS(WETH_VAULT_ADDRESS);
  wethVaultPps.pricePerShare = wethPpsTry.reverted
    ? BigInt.zero()
    : wethPpsTry.value;
  wethVaultPps.save();

  /** WBTC vault price per share */
  const wbtcVaultEntityId = `${
    block.timestamp
  }:${WBTC_VAULT_ADDRESS.toHexString()}`;
  const wbtcVaultPps = new VaultPricePerShare(wbtcVaultEntityId);

  wbtcVaultPps.block = block.number;
  wbtcVaultPps.timestamp = block.timestamp;
  wbtcVaultPps.vault = WBTC_VAULT_ADDRESS.toHexString();
  const wbtcPpsTry = aggregateVaultContract.try_getVaultPPS(WBTC_VAULT_ADDRESS);
  wbtcVaultPps.pricePerShare = wbtcPpsTry.reverted
    ? BigInt.zero()
    : wbtcPpsTry.value;

  wbtcVaultPps.save();

  /** UNI vault price per share */
  const uniVaultEntityId = `${
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

  /** LINK vault price per share */
  const linkVaultEntityId = `${
    block.timestamp
  }:${LINK_VAULT_ADDRESS.toHexString()}`;
  const linkVaultPps = new VaultPricePerShare(linkVaultEntityId);

  linkVaultPps.block = block.number;
  linkVaultPps.timestamp = block.timestamp;
  linkVaultPps.vault = LINK_VAULT_ADDRESS.toHexString();
  const linkPpsTry = aggregateVaultContract.try_getVaultPPS(LINK_VAULT_ADDRESS);
  linkVaultPps.pricePerShare = linkPpsTry.reverted
    ? BigInt.zero()
    : linkPpsTry.value;
  linkVaultPps.save();
}

export function handleCloseRebalance(event: CloseRebalance): void {
  const aggregateVaultContract = AggregateVault.bind(AGGREGATE_VAULT_ADDRESS);
  /** USDC vault price per share */
  const usdcVaultEntityId = `${
    event.block.timestamp
  }:${USDC_VAULT_ADDRESS.toHexString()}`;
  const usdcVaultTvl = new VaultTVL(usdcVaultEntityId);

  usdcVaultTvl.block = event.block.number;
  usdcVaultTvl.timestamp = event.block.timestamp;
  usdcVaultTvl.vault = USDC_VAULT_ADDRESS.toHexString();
  const usdcTvlTry = aggregateVaultContract.try_getVaultTVL(USDC_VAULT_ADDRESS);
  usdcVaultTvl.tvl = usdcTvlTry.reverted ? BigInt.zero() : usdcTvlTry.value;
  usdcVaultTvl.save();

  /** WETH vault TVL */
  const wethVaultEntityId = `${
    event.block.timestamp
  }:${WETH_VAULT_ADDRESS.toHexString()}`;
  const wethVaulTvl = new VaultTVL(wethVaultEntityId);

  wethVaulTvl.block = event.block.number;
  wethVaulTvl.timestamp = event.block.timestamp;
  wethVaulTvl.vault = WETH_VAULT_ADDRESS.toHexString();
  const wethTvlTry = aggregateVaultContract.try_getVaultTVL(WETH_VAULT_ADDRESS);
  wethVaulTvl.tvl = wethTvlTry.reverted ? BigInt.zero() : wethTvlTry.value;
  wethVaulTvl.save();

  /** WBTC vault TVL */
  const wbtcVaultEntityId = `${
    event.block.timestamp
  }:${WBTC_VAULT_ADDRESS.toHexString()}`;
  const wbtcVaultTvl = new VaultTVL(wbtcVaultEntityId);

  wbtcVaultTvl.block = event.block.number;
  wbtcVaultTvl.timestamp = event.block.timestamp;
  wbtcVaultTvl.vault = WBTC_VAULT_ADDRESS.toHexString();
  const wbtcTvlTry = aggregateVaultContract.try_getVaultTVL(WBTC_VAULT_ADDRESS);
  wbtcVaultTvl.tvl = wbtcTvlTry.reverted ? BigInt.zero() : wbtcTvlTry.value;
  wbtcVaultTvl.save();

  /** UNI vault TVL */
  const uniVaultEntityId = `${
    event.block.timestamp
  }:${UNI_VAULT_ADDRESS.toHexString()}`;
  const uniVaultTvl = new VaultTVL(uniVaultEntityId);

  uniVaultTvl.block = event.block.number;
  uniVaultTvl.timestamp = event.block.timestamp;
  uniVaultTvl.vault = UNI_VAULT_ADDRESS.toHexString();
  const uniTvlTry = aggregateVaultContract.try_getVaultTVL(UNI_VAULT_ADDRESS);
  uniVaultTvl.tvl = uniTvlTry.reverted ? BigInt.zero() : uniTvlTry.value;
  uniVaultTvl.save();

  /** LINK vault TVL */
  const linkVaultEntityId = `${
    event.block.timestamp
  }:${LINK_VAULT_ADDRESS.toHexString()}`;
  const linkVaultTvl = new VaultTVL(linkVaultEntityId);

  linkVaultTvl.block = event.block.number;
  linkVaultTvl.timestamp = event.block.timestamp;
  linkVaultTvl.vault = LINK_VAULT_ADDRESS.toHexString();
  const linkTvlTry = aggregateVaultContract.try_getVaultTVL(LINK_VAULT_ADDRESS);
  linkVaultTvl.tvl = linkTvlTry.reverted ? BigInt.zero() : linkTvlTry.value;
  linkVaultTvl.save();
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

export function handleOpenRebalance(event: OpenRebalance): void {}

export function handlePaused(event: Paused): void {}

export function handleUnpaused(event: Unpaused): void {}
