// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class VaultPricePerShare extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save VaultPricePerShare entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type VaultPricePerShare must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("VaultPricePerShare", id.toString(), this);
    }
  }

  static load(id: string): VaultPricePerShare | null {
    return changetype<VaultPricePerShare | null>(
      store.get("VaultPricePerShare", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get block(): BigInt {
    let value = this.get("block");
    return value!.toBigInt();
  }

  set block(value: BigInt) {
    this.set("block", Value.fromBigInt(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get vault(): string {
    let value = this.get("vault");
    return value!.toString();
  }

  set vault(value: string) {
    this.set("vault", Value.fromString(value));
  }

  get pricePerShare(): BigInt {
    let value = this.get("pricePerShare");
    return value!.toBigInt();
  }

  set pricePerShare(value: BigInt) {
    this.set("pricePerShare", Value.fromBigInt(value));
  }
}

export class VaultPpsLastTimestamp extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save VaultPpsLastTimestamp entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type VaultPpsLastTimestamp must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("VaultPpsLastTimestamp", id.toString(), this);
    }
  }

  static load(id: string): VaultPpsLastTimestamp | null {
    return changetype<VaultPpsLastTimestamp | null>(
      store.get("VaultPpsLastTimestamp", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }
}

export class VaultTVL extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save VaultTVL entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type VaultTVL must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("VaultTVL", id.toString(), this);
    }
  }

  static load(id: string): VaultTVL | null {
    return changetype<VaultTVL | null>(store.get("VaultTVL", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get block(): BigInt {
    let value = this.get("block");
    return value!.toBigInt();
  }

  set block(value: BigInt) {
    this.set("block", Value.fromBigInt(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get vault(): string {
    let value = this.get("vault");
    return value!.toString();
  }

  set vault(value: string) {
    this.set("vault", Value.fromString(value));
  }

  get tvl(): BigInt {
    let value = this.get("tvl");
    return value!.toBigInt();
  }

  set tvl(value: BigInt) {
    this.set("tvl", Value.fromBigInt(value));
  }
}

export class VaultFeesCollection extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save VaultFeesCollection entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type VaultFeesCollection must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("VaultFeesCollection", id.toString(), this);
    }
  }

  static load(id: string): VaultFeesCollection | null {
    return changetype<VaultFeesCollection | null>(
      store.get("VaultFeesCollection", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get block(): BigInt {
    let value = this.get("block");
    return value!.toBigInt();
  }

  set block(value: BigInt) {
    this.set("block", Value.fromBigInt(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get vault(): string {
    let value = this.get("vault");
    return value!.toString();
  }

  set vault(value: string) {
    this.set("vault", Value.fromString(value));
  }

  get performanceFees(): BigInt {
    let value = this.get("performanceFees");
    return value!.toBigInt();
  }

  set performanceFees(value: BigInt) {
    this.set("performanceFees", Value.fromBigInt(value));
  }

  get managementFees(): BigInt {
    let value = this.get("managementFees");
    return value!.toBigInt();
  }

  set managementFees(value: BigInt) {
    this.set("managementFees", Value.fromBigInt(value));
  }

  get totalFees(): BigInt {
    let value = this.get("totalFees");
    return value!.toBigInt();
  }

  set totalFees(value: BigInt) {
    this.set("totalFees", Value.fromBigInt(value));
  }
}

export class UserVaultBalanceTotal extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save UserVaultBalanceTotal entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type UserVaultBalanceTotal must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("UserVaultBalanceTotal", id.toString(), this);
    }
  }

  static load(id: string): UserVaultBalanceTotal | null {
    return changetype<UserVaultBalanceTotal | null>(
      store.get("UserVaultBalanceTotal", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get usdc(): BigInt {
    let value = this.get("usdc");
    return value!.toBigInt();
  }

  set usdc(value: BigInt) {
    this.set("usdc", Value.fromBigInt(value));
  }

  get weth(): BigInt {
    let value = this.get("weth");
    return value!.toBigInt();
  }

  set weth(value: BigInt) {
    this.set("weth", Value.fromBigInt(value));
  }

  get wbtc(): BigInt {
    let value = this.get("wbtc");
    return value!.toBigInt();
  }

  set wbtc(value: BigInt) {
    this.set("wbtc", Value.fromBigInt(value));
  }

  get link(): BigInt {
    let value = this.get("link");
    return value!.toBigInt();
  }

  set link(value: BigInt) {
    this.set("link", Value.fromBigInt(value));
  }

  get uni(): BigInt {
    let value = this.get("uni");
    return value!.toBigInt();
  }

  set uni(value: BigInt) {
    this.set("uni", Value.fromBigInt(value));
  }
}

export class UserVaultBalance extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save UserVaultBalance entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type UserVaultBalance must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("UserVaultBalance", id.toString(), this);
    }
  }

  static load(id: string): UserVaultBalance | null {
    return changetype<UserVaultBalance | null>(
      store.get("UserVaultBalance", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get block(): BigInt {
    let value = this.get("block");
    return value!.toBigInt();
  }

  set block(value: BigInt) {
    this.set("block", Value.fromBigInt(value));
  }

  get txHash(): string {
    let value = this.get("txHash");
    return value!.toString();
  }

  set txHash(value: string) {
    this.set("txHash", Value.fromString(value));
  }

  get event(): string {
    let value = this.get("event");
    return value!.toString();
  }

  set event(value: string) {
    this.set("event", Value.fromString(value));
  }

  get value(): BigInt {
    let value = this.get("value");
    return value!.toBigInt();
  }

  set value(value: BigInt) {
    this.set("value", Value.fromBigInt(value));
  }

  get user(): string {
    let value = this.get("user");
    return value!.toString();
  }

  set user(value: string) {
    this.set("user", Value.fromString(value));
  }

  get vault(): string {
    let value = this.get("vault");
    return value!.toString();
  }

  set vault(value: string) {
    this.set("vault", Value.fromString(value));
  }
}

export class TmpRebalanceSnapshot extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save TmpRebalanceSnapshot entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type TmpRebalanceSnapshot must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("TmpRebalanceSnapshot", id.toString(), this);
    }
  }

  static load(id: string): TmpRebalanceSnapshot | null {
    return changetype<TmpRebalanceSnapshot | null>(
      store.get("TmpRebalanceSnapshot", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get block(): BigInt {
    let value = this.get("block");
    return value!.toBigInt();
  }

  set block(value: BigInt) {
    this.set("block", Value.fromBigInt(value));
  }

  get txHash(): string {
    let value = this.get("txHash");
    return value!.toString();
  }

  set txHash(value: string) {
    this.set("txHash", Value.fromString(value));
  }

  get event(): string {
    let value = this.get("event");
    return value!.toString();
  }

  set event(value: string) {
    this.set("event", Value.fromString(value));
  }

  get glpPrice(): BigInt {
    let value = this.get("glpPrice");
    return value!.toBigInt();
  }

  set glpPrice(value: BigInt) {
    this.set("glpPrice", Value.fromBigInt(value));
  }

  get vaultsTVL(): Array<BigInt> {
    let value = this.get("vaultsTVL");
    return value!.toBigIntArray();
  }

  set vaultsTVL(value: Array<BigInt>) {
    this.set("vaultsTVL", Value.fromBigIntArray(value));
  }

  get vaultsPps(): Array<BigInt> {
    let value = this.get("vaultsPps");
    return value!.toBigIntArray();
  }

  set vaultsPps(value: Array<BigInt>) {
    this.set("vaultsPps", Value.fromBigIntArray(value));
  }

  get vaultsGlpAlloc(): Array<BigInt> {
    let value = this.get("vaultsGlpAlloc");
    return value!.toBigIntArray();
  }

  set vaultsGlpAlloc(value: Array<BigInt>) {
    this.set("vaultsGlpAlloc", Value.fromBigIntArray(value));
  }

  get aggregatePositions(): Array<BigInt> {
    let value = this.get("aggregatePositions");
    return value!.toBigIntArray();
  }

  set aggregatePositions(value: Array<BigInt>) {
    this.set("aggregatePositions", Value.fromBigIntArray(value));
  }

  get usdcVaultExposures(): Array<BigInt> {
    let value = this.get("usdcVaultExposures");
    return value!.toBigIntArray();
  }

  set usdcVaultExposures(value: Array<BigInt>) {
    this.set("usdcVaultExposures", Value.fromBigIntArray(value));
  }

  get wethVaultExposures(): Array<BigInt> {
    let value = this.get("wethVaultExposures");
    return value!.toBigIntArray();
  }

  set wethVaultExposures(value: Array<BigInt>) {
    this.set("wethVaultExposures", Value.fromBigIntArray(value));
  }

  get wbtcVaultExposures(): Array<BigInt> {
    let value = this.get("wbtcVaultExposures");
    return value!.toBigIntArray();
  }

  set wbtcVaultExposures(value: Array<BigInt>) {
    this.set("wbtcVaultExposures", Value.fromBigIntArray(value));
  }

  get linkVaultExposures(): Array<BigInt> {
    let value = this.get("linkVaultExposures");
    return value!.toBigIntArray();
  }

  set linkVaultExposures(value: Array<BigInt>) {
    this.set("linkVaultExposures", Value.fromBigIntArray(value));
  }

  get uniVaultExposures(): Array<BigInt> {
    let value = this.get("uniVaultExposures");
    return value!.toBigIntArray();
  }

  set uniVaultExposures(value: Array<BigInt>) {
    this.set("uniVaultExposures", Value.fromBigIntArray(value));
  }

  get usdcVaultInternalNetting(): Array<BigInt> {
    let value = this.get("usdcVaultInternalNetting");
    return value!.toBigIntArray();
  }

  set usdcVaultInternalNetting(value: Array<BigInt>) {
    this.set("usdcVaultInternalNetting", Value.fromBigIntArray(value));
  }

  get wethVaultInternalNetting(): Array<BigInt> {
    let value = this.get("wethVaultInternalNetting");
    return value!.toBigIntArray();
  }

  set wethVaultInternalNetting(value: Array<BigInt>) {
    this.set("wethVaultInternalNetting", Value.fromBigIntArray(value));
  }

  get wbtcVaultInternalNetting(): Array<BigInt> {
    let value = this.get("wbtcVaultInternalNetting");
    return value!.toBigIntArray();
  }

  set wbtcVaultInternalNetting(value: Array<BigInt>) {
    this.set("wbtcVaultInternalNetting", Value.fromBigIntArray(value));
  }

  get linkVaultInternalNetting(): Array<BigInt> {
    let value = this.get("linkVaultInternalNetting");
    return value!.toBigIntArray();
  }

  set linkVaultInternalNetting(value: Array<BigInt>) {
    this.set("linkVaultInternalNetting", Value.fromBigIntArray(value));
  }

  get uniVaultInternalNetting(): Array<BigInt> {
    let value = this.get("uniVaultInternalNetting");
    return value!.toBigIntArray();
  }

  set uniVaultInternalNetting(value: Array<BigInt>) {
    this.set("uniVaultInternalNetting", Value.fromBigIntArray(value));
  }

  get glpComposition(): Array<BigInt> {
    let value = this.get("glpComposition");
    return value!.toBigIntArray();
  }

  set glpComposition(value: Array<BigInt>) {
    this.set("glpComposition", Value.fromBigIntArray(value));
  }

  get assetsPrices(): Array<BigInt> {
    let value = this.get("assetsPrices");
    return value!.toBigIntArray();
  }

  set assetsPrices(value: Array<BigInt>) {
    this.set("assetsPrices", Value.fromBigIntArray(value));
  }
}
