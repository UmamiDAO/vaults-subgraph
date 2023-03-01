import { BigInt, ethereum, log } from "@graphprotocol/graph-ts";
import { AggregateVaultHelper } from "../generated/AggregateVault/AggregateVaultHelper";

import {
  VaultPpsLastTimestamp,
  VaultPricePerShare,
  VaultTVL,
} from "../generated/schema";
import {
  AGGREGATE_VAULT_HELPER_ADDRESS,
  LINK_VAULT_ADDRESS,
  UNI_VAULT_ADDRESS,
  USDC_VAULT_ADDRESS,
  WBTC_VAULT_ADDRESS,
  WETH_VAULT_ADDRESS,
} from "./constants";

export function handleBlock(block: ethereum.Block): void {
  return;
  // if (block.number.mod(BigInt.fromString("500")).gt(BigInt.zero())) {
  //   return;
  // }

  // let lastPpsTimestamp = VaultPpsLastTimestamp.load("timestamp");
  // /** Wait a minute to register a new PPS */
  // if (
  //   lastPpsTimestamp == null ||
  //   block.timestamp.gt(
  //     lastPpsTimestamp.timestamp.plus(BigInt.fromString("1800"))
  //   )
  // ) {
  //   log.warning("Success handle block !", []);

  //   if (lastPpsTimestamp == null) {
  //     lastPpsTimestamp = new VaultPpsLastTimestamp("timestamp");
  //   }
  //   lastPpsTimestamp.timestamp = block.timestamp;
  //   lastPpsTimestamp.save();

  //   const aggregateVaultHelper = AggregateVaultHelper.bind(
  //     AGGREGATE_VAULT_HELPER_ADDRESS
  //   );

  //   /** USDC vault */
  //   /** USDC vault price per share */
  //   const usdcVaultEntityId = `${block.number}:${
  //     block.timestamp
  //   }:${USDC_VAULT_ADDRESS.toHexString()}`;
  //   const usdcVaultPps = new VaultPricePerShare(usdcVaultEntityId);

  //   usdcVaultPps.block = block.number;
  //   usdcVaultPps.timestamp = block.timestamp;
  //   usdcVaultPps.vault = USDC_VAULT_ADDRESS.toHexString();
  //   usdcVaultPps.pricePerShare = aggregateVaultHelper.getVaultPPS(
  //     USDC_VAULT_ADDRESS
  //   );
  //   usdcVaultPps.save();

  //   /** TVL */

  //   const usdcVaultTvl = new VaultTVL(usdcVaultEntityId);

  //   usdcVaultTvl.block = block.number;
  //   usdcVaultTvl.timestamp = block.timestamp;
  //   usdcVaultTvl.vault = USDC_VAULT_ADDRESS.toHexString();
  //   usdcVaultTvl.tvl = aggregateVaultHelper.getVaultTVL(USDC_VAULT_ADDRESS);
  //   usdcVaultTvl.save();

  //   /** WETH vault */
  //   /** Price per share */
  //   const wethVaultEntityId = `${block.number}:${
  //     block.timestamp
  //   }:${WETH_VAULT_ADDRESS.toHexString()}`;
  //   const wethVaultPps = new VaultPricePerShare(wethVaultEntityId);

  //   wethVaultPps.block = block.number;
  //   wethVaultPps.timestamp = block.timestamp;
  //   wethVaultPps.vault = WETH_VAULT_ADDRESS.toHexString();
  //   wethVaultPps.pricePerShare = aggregateVaultHelper.getVaultPPS(
  //     WETH_VAULT_ADDRESS
  //   );
  //   wethVaultPps.save();

  //   /** TVL */
  //   const wethVaulTvl = new VaultTVL(wethVaultEntityId);

  //   wethVaulTvl.block = block.number;
  //   wethVaulTvl.timestamp = block.timestamp;
  //   wethVaulTvl.vault = WETH_VAULT_ADDRESS.toHexString();
  //   wethVaulTvl.tvl = aggregateVaultHelper.getVaultTVL(WETH_VAULT_ADDRESS);
  //   wethVaulTvl.save();

  //   /** WBTC vault */
  //   /** Price per share */
  //   const wbtcVaultEntityId = `${block.number}:${
  //     block.timestamp
  //   }:${WBTC_VAULT_ADDRESS.toHexString()}`;
  //   const wbtcVaultPps = new VaultPricePerShare(wbtcVaultEntityId);

  //   wbtcVaultPps.block = block.number;
  //   wbtcVaultPps.timestamp = block.timestamp;
  //   wbtcVaultPps.vault = WBTC_VAULT_ADDRESS.toHexString();
  //   wbtcVaultPps.pricePerShare = aggregateVaultHelper.getVaultPPS(
  //     WBTC_VAULT_ADDRESS
  //   );
  //   wbtcVaultPps.save();

  //   /** TVL */

  //   const wbtcVaultTvl = new VaultTVL(wbtcVaultEntityId);

  //   wbtcVaultTvl.block = block.number;
  //   wbtcVaultTvl.timestamp = block.timestamp;
  //   wbtcVaultTvl.vault = WBTC_VAULT_ADDRESS.toHexString();
  //   wbtcVaultTvl.tvl = aggregateVaultHelper.getVaultTVL(WBTC_VAULT_ADDRESS);
  //   wbtcVaultTvl.save();

  //   /** UNI vault */
  //   /** Price per share */
  //   const uniVaultEntityId = `${block.number}:${
  //     block.timestamp
  //   }:${UNI_VAULT_ADDRESS.toHexString()}`;
  //   const uniVaultPps = new VaultPricePerShare(uniVaultEntityId);

  //   uniVaultPps.block = block.number;
  //   uniVaultPps.timestamp = block.timestamp;
  //   uniVaultPps.vault = UNI_VAULT_ADDRESS.toHexString();
  //   uniVaultPps.pricePerShare = aggregateVaultHelper.getVaultPPS(
  //     UNI_VAULT_ADDRESS
  //   );
  //   uniVaultPps.save();

  //   /** TVL */

  //   const uniVaultTvl = new VaultTVL(uniVaultEntityId);

  //   uniVaultTvl.block = block.number;
  //   uniVaultTvl.timestamp = block.timestamp;
  //   uniVaultTvl.vault = UNI_VAULT_ADDRESS.toHexString();
  //   uniVaultTvl.tvl = aggregateVaultHelper.getVaultTVL(UNI_VAULT_ADDRESS);
  //   uniVaultTvl.save();

  //   /** LINK vault */
  //   /** Price per share */
  //   const linkVaultEntityId = `${block.number}:${
  //     block.timestamp
  //   }:${LINK_VAULT_ADDRESS.toHexString()}`;

  //   const linkVaultPps = new VaultPricePerShare(linkVaultEntityId);

  //   linkVaultPps.block = block.number;
  //   linkVaultPps.timestamp = block.timestamp;
  //   linkVaultPps.vault = LINK_VAULT_ADDRESS.toHexString();
  //   linkVaultPps.pricePerShare = aggregateVaultHelper.getVaultPPS(
  //     LINK_VAULT_ADDRESS
  //   );
  //   linkVaultPps.save();

  //   /** TVL */

  //   const linkVaultTvl = new VaultTVL(linkVaultEntityId);

  //   linkVaultTvl.block = block.number;
  //   linkVaultTvl.timestamp = block.timestamp;
  //   linkVaultTvl.vault = LINK_VAULT_ADDRESS.toHexString();
  //   linkVaultTvl.tvl = aggregateVaultHelper.getVaultTVL(LINK_VAULT_ADDRESS);
  //   linkVaultTvl.save();
  // }
}
