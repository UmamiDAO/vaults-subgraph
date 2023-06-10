import { BigInt } from "@graphprotocol/graph-ts";
import { ClosePosition as ClosePositionEvent } from "../generated/GmxVault/GmxVault";
import { GmxClosedPositionPnl } from "../generated/schema";

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
}
