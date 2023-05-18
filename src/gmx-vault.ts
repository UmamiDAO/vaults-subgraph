import { BigInt } from "@graphprotocol/graph-ts";
import {
  ClosePosition as ClosePositionEvent,
  GmxVault,
} from "../generated/GmxVault/GmxVault";
import { GmxClosedPositionPnl, GmxState } from "../generated/schema";
import {
  GMX_VAULT_ADDRESS,
  USDC_ADDRESS,
  WETH_ADDRESS,
  WBTC_ADDRESS,
  LINK_ADDRESS,
  UNI_ADDRESS,
} from "./constants";

const ZERO = BigInt.fromI32(0);

export function handleClosePosition(event: ClosePositionEvent): void {
  const timestamp = event.block.timestamp;
  const block = event.block.number;
  const pnl = event.params.realisedPnl;
  const id = `${event.transaction.hash.toHex()}:${event.params.key.toHexString()}`;

  let closePositionEntity = new GmxClosedPositionPnl(id);

  closePositionEntity.timestamp = timestamp;
  closePositionEntity.block = block;
  closePositionEntity.collateral = event.params.collateral;
  closePositionEntity.reserveAmount = event.params.reserveAmount;
  if (pnl > ZERO) {
    closePositionEntity.profit = pnl;
    closePositionEntity.loss = BigInt.zero();
  } else {
    closePositionEntity.loss = pnl;
    closePositionEntity.profit = BigInt.zero();
  }

  closePositionEntity.save();

  // const gmxVaultContract = GmxVault.bind(GMX_VAULT_ADDRESS);

  // const usdcMinPrice = gmxVaultContract.getMinPrice(USDC_ADDRESS);
  // const usdcMaxPrice = gmxVaultContract.getMaxPrice(USDC_ADDRESS);
  // const wethMinPrice = gmxVaultContract.getMinPrice(WETH_ADDRESS);
  // const wethMaxPrice = gmxVaultContract.getMaxPrice(WETH_ADDRESS);
  // const wbtcMinPrice = gmxVaultContract.getMinPrice(WBTC_ADDRESS);
  // const wbtcMaxPrice = gmxVaultContract.getMaxPrice(WBTC_ADDRESS);
  // const linkMinPrice = gmxVaultContract.getMinPrice(LINK_ADDRESS);
  // const linkMaxPrice = gmxVaultContract.getMaxPrice(LINK_ADDRESS);
  // const uniMinPrice = gmxVaultContract.getMinPrice(UNI_ADDRESS);
  // const uniMaxPrice = gmxVaultContract.getMaxPrice(UNI_ADDRESS);
  // const assetsPrices = [
  //   usdcMinPrice.plus(usdcMaxPrice).div(BigInt.fromString("2")),
  //   wethMinPrice.plus(wethMaxPrice).div(BigInt.fromString("2")),
  //   wbtcMinPrice.plus(wbtcMaxPrice).div(BigInt.fromString("2")),
  //   linkMinPrice.plus(linkMaxPrice).div(BigInt.fromString("2")),
  //   uniMinPrice.plus(uniMaxPrice).div(BigInt.fromString("2")),
  // ];

  // const gmxState = new GmxState(`${event.block.number}`);
  // gmxState.block = event.block.number;
  // gmxState.timestamp = event.block.timestamp;
  // gmxState.event = "close-position";
  // gmxState.assetsPrices = assetsPrices;

  // gmxState.reservedAmounts = [
  //   BigInt.zero(),
  //   gmxVaultContract.reservedAmounts(WETH_ADDRESS),
  //   gmxVaultContract.reservedAmounts(WBTC_ADDRESS),
  //   gmxVaultContract.reservedAmounts(LINK_ADDRESS),
  //   gmxVaultContract.reservedAmounts(UNI_ADDRESS),
  // ];
  // gmxState.guaranteedUsd = [
  //   BigInt.zero(),
  //   gmxVaultContract.guaranteedUsd(WETH_ADDRESS),
  //   gmxVaultContract.guaranteedUsd(WBTC_ADDRESS),
  //   gmxVaultContract.guaranteedUsd(LINK_ADDRESS),
  //   gmxVaultContract.guaranteedUsd(UNI_ADDRESS),
  // ];
  // gmxState.shortsAveragePrices = [
  //   BigInt.zero(),
  //   gmxVaultContract.globalShortAveragePrices(WETH_ADDRESS),
  //   gmxVaultContract.globalShortAveragePrices(WBTC_ADDRESS),
  //   gmxVaultContract.globalShortAveragePrices(LINK_ADDRESS),
  //   gmxVaultContract.globalShortAveragePrices(UNI_ADDRESS),
  // ];
  // gmxState.globalShortSizes = [
  //   BigInt.zero(),
  //   gmxVaultContract.globalShortSizes(WETH_ADDRESS),
  //   gmxVaultContract.globalShortSizes(WBTC_ADDRESS),
  //   gmxVaultContract.globalShortSizes(LINK_ADDRESS),
  //   gmxVaultContract.globalShortSizes(UNI_ADDRESS),
  // ];

  // gmxState.save();
}
