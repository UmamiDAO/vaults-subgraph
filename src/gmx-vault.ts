import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  ClosePosition as ClosePositionEvent,
  GmxVault,
} from "../generated/GmxVault/GmxVault";
import {
  GmxClosedPositionPnl,
  GmxState,
  VaultPpsLastTimestampSlow,
} from "../generated/schema";
import {
  GMX_VAULT_ADDRESS,
  LINK_ADDRESS,
  UNI_ADDRESS,
  USDC_ADDRESS,
  WBTC_ADDRESS,
  WETH_ADDRESS,
} from "./constants";

const ZERO = BigInt.fromI32(0);

export function handleBlock(block: ethereum.Block): void {
  let lastPpsTimestampSlow = VaultPpsLastTimestampSlow.load("timestamp-slow");

  /** Wait x hours to register a new snapshot */
  const hoursInterval = 4;
  if (
    lastPpsTimestampSlow == null ||
    block.timestamp.gt(
      lastPpsTimestampSlow.timestamp.plus(
        BigInt.fromString((hoursInterval * 3600).toString())
      )
    )
  ) {
    const event = "slow";
    if (lastPpsTimestampSlow == null) {
      lastPpsTimestampSlow = new VaultPpsLastTimestampSlow("timestamp-slow");
    }
    lastPpsTimestampSlow.timestamp = block.timestamp;
    lastPpsTimestampSlow.save();

    const gmxVaultContract = GmxVault.bind(GMX_VAULT_ADDRESS);

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
    const assetsPrices = [
      usdcMinPrice.plus(usdcMaxPrice).div(BigInt.fromString("2")),
      wethMinPrice.plus(wethMaxPrice).div(BigInt.fromString("2")),
      wbtcMinPrice.plus(wbtcMaxPrice).div(BigInt.fromString("2")),
      linkMinPrice.plus(linkMaxPrice).div(BigInt.fromString("2")),
      uniMinPrice.plus(uniMaxPrice).div(BigInt.fromString("2")),
    ];

    const gmxState = new GmxState(`${block.number}`);
    gmxState.block = block.number;
    gmxState.timestamp = block.timestamp;
    gmxState.event = event;
    gmxState.assetsPrices = assetsPrices;

    gmxState.reservedAmounts = [
      BigInt.zero(),
      gmxVaultContract.reservedAmounts(WETH_ADDRESS),
      gmxVaultContract.reservedAmounts(WBTC_ADDRESS),
      gmxVaultContract.reservedAmounts(LINK_ADDRESS),
      gmxVaultContract.reservedAmounts(UNI_ADDRESS),
    ];
    gmxState.guaranteedUsd = [
      BigInt.zero(),
      gmxVaultContract.guaranteedUsd(WETH_ADDRESS),
      gmxVaultContract.guaranteedUsd(WBTC_ADDRESS),
      gmxVaultContract.guaranteedUsd(LINK_ADDRESS),
      gmxVaultContract.guaranteedUsd(UNI_ADDRESS),
    ];
    gmxState.shortsAveragePrices = [
      BigInt.zero(),
      gmxVaultContract.globalShortAveragePrices(WETH_ADDRESS),
      gmxVaultContract.globalShortAveragePrices(WBTC_ADDRESS),
      gmxVaultContract.globalShortAveragePrices(LINK_ADDRESS),
      gmxVaultContract.globalShortAveragePrices(UNI_ADDRESS),
    ];
    gmxState.globalShortSizes = [
      BigInt.zero(),
      gmxVaultContract.globalShortSizes(WETH_ADDRESS),
      gmxVaultContract.globalShortSizes(WBTC_ADDRESS),
      gmxVaultContract.globalShortSizes(LINK_ADDRESS),
      gmxVaultContract.globalShortSizes(UNI_ADDRESS),
    ];

    gmxState.save();
  }
}

export function handleClosePosition(event: ClosePositionEvent): void {
  const timestamp = event.block.timestamp;
  const block = event.block.number;
  const pnl = event.params.realisedPnl;
  const id = `${event.transaction.hash.toHex()}:${event.params.key.toHexString()}`;

  let entity = new GmxClosedPositionPnl(id);

  entity.timestamp = timestamp;
  entity.block = block;
  entity.collateral = event.params.collateral;
  entity.reserveAmount = event.params.reserveAmount;
  if (pnl > ZERO) {
    entity.profit = pnl;
    entity.loss = BigInt.zero();
  } else {
    entity.loss = pnl;
    entity.profit = BigInt.zero();
  }

  entity.save();
}
