import { BigInt } from "@graphprotocol/graph-ts";
import { ClosePosition as ClosePositionEvent } from "../generated/AggregateVault/GmxVault";
import { GmxClosedPositionPnl } from "../generated/schema";

const ZERO = BigInt.fromI32(0);

export function handleClosePosition(event: ClosePositionEvent): void {
  const timestamp = event.block.timestamp;
  const block = event.block.number;
  const pnl = event.params.realisedPnl;
  const id = `${event.transaction.hash.toHex()}:${event.params.key.toHexString()}`;

  let entity = new GmxClosedPositionPnl(id);

  entity.timestamp = timestamp;
  entity.block = block;
  if (pnl > ZERO) {
    entity.profit = pnl;
  } else {
    entity.loss = pnl;
  }

  entity.save();
}
