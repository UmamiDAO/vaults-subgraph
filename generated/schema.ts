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

export class VaultPpsLastTimestampQuick extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save VaultPpsLastTimestampQuick entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type VaultPpsLastTimestampQuick must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("VaultPpsLastTimestampQuick", id.toString(), this);
    }
  }

  static load(id: string): VaultPpsLastTimestampQuick | null {
    return changetype<VaultPpsLastTimestampQuick | null>(
      store.get("VaultPpsLastTimestampQuick", id)
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

export class VaultPpsLastTimestampSlow extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save VaultPpsLastTimestampSlow entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type VaultPpsLastTimestampSlow must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("VaultPpsLastTimestampSlow", id.toString(), this);
    }
  }

  static load(id: string): VaultPpsLastTimestampSlow | null {
    return changetype<VaultPpsLastTimestampSlow | null>(
      store.get("VaultPpsLastTimestampSlow", id)
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

  get event(): string {
    let value = this.get("event");
    return value!.toString();
  }

  set event(value: string) {
    this.set("event", Value.fromString(value));
  }

  get txHash(): string {
    let value = this.get("txHash");
    return value!.toString();
  }

  set txHash(value: string) {
    this.set("txHash", Value.fromString(value));
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

  get event(): string {
    let value = this.get("event");
    return value!.toString();
  }

  set event(value: string) {
    this.set("event", Value.fromString(value));
  }

  get txHash(): string {
    let value = this.get("txHash");
    return value!.toString();
  }

  set txHash(value: string) {
    this.set("txHash", Value.fromString(value));
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

export class RebalanceSnapshot extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save RebalanceSnapshot entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type RebalanceSnapshot must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("RebalanceSnapshot", id.toString(), this);
    }
  }

  static load(id: string): RebalanceSnapshot | null {
    return changetype<RebalanceSnapshot | null>(
      store.get("RebalanceSnapshot", id)
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

  get epoch(): BigInt {
    let value = this.get("epoch");
    return value!.toBigInt();
  }

  set epoch(value: BigInt) {
    this.set("epoch", Value.fromBigInt(value));
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

  get usdcVaultExternalPositions(): Array<BigInt> {
    let value = this.get("usdcVaultExternalPositions");
    return value!.toBigIntArray();
  }

  set usdcVaultExternalPositions(value: Array<BigInt>) {
    this.set("usdcVaultExternalPositions", Value.fromBigIntArray(value));
  }

  get wethVaultExternalPositions(): Array<BigInt> {
    let value = this.get("wethVaultExternalPositions");
    return value!.toBigIntArray();
  }

  set wethVaultExternalPositions(value: Array<BigInt>) {
    this.set("wethVaultExternalPositions", Value.fromBigIntArray(value));
  }

  get wbtcVaultExternalPositions(): Array<BigInt> {
    let value = this.get("wbtcVaultExternalPositions");
    return value!.toBigIntArray();
  }

  set wbtcVaultExternalPositions(value: Array<BigInt>) {
    this.set("wbtcVaultExternalPositions", Value.fromBigIntArray(value));
  }

  get linkVaultExternalPositions(): Array<BigInt> {
    let value = this.get("linkVaultExternalPositions");
    return value!.toBigIntArray();
  }

  set linkVaultExternalPositions(value: Array<BigInt>) {
    this.set("linkVaultExternalPositions", Value.fromBigIntArray(value));
  }

  get uniVaultExternalPositions(): Array<BigInt> {
    let value = this.get("uniVaultExternalPositions");
    return value!.toBigIntArray();
  }

  set uniVaultExternalPositions(value: Array<BigInt>) {
    this.set("uniVaultExternalPositions", Value.fromBigIntArray(value));
  }

  get usdcVaultNettedPositions(): Array<BigInt> {
    let value = this.get("usdcVaultNettedPositions");
    return value!.toBigIntArray();
  }

  set usdcVaultNettedPositions(value: Array<BigInt>) {
    this.set("usdcVaultNettedPositions", Value.fromBigIntArray(value));
  }

  get wethVaultNettedPositions(): Array<BigInt> {
    let value = this.get("wethVaultNettedPositions");
    return value!.toBigIntArray();
  }

  set wethVaultNettedPositions(value: Array<BigInt>) {
    this.set("wethVaultNettedPositions", Value.fromBigIntArray(value));
  }

  get wbtcVaultNettedPositions(): Array<BigInt> {
    let value = this.get("wbtcVaultNettedPositions");
    return value!.toBigIntArray();
  }

  set wbtcVaultNettedPositions(value: Array<BigInt>) {
    this.set("wbtcVaultNettedPositions", Value.fromBigIntArray(value));
  }

  get linkVaultNettedPositions(): Array<BigInt> {
    let value = this.get("linkVaultNettedPositions");
    return value!.toBigIntArray();
  }

  set linkVaultNettedPositions(value: Array<BigInt>) {
    this.set("linkVaultNettedPositions", Value.fromBigIntArray(value));
  }

  get uniVaultNettedPositions(): Array<BigInt> {
    let value = this.get("uniVaultNettedPositions");
    return value!.toBigIntArray();
  }

  set uniVaultNettedPositions(value: Array<BigInt>) {
    this.set("uniVaultNettedPositions", Value.fromBigIntArray(value));
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

export class OpenRebalance extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save OpenRebalance entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type OpenRebalance must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("OpenRebalance", id.toString(), this);
    }
  }

  static load(id: string): OpenRebalance | null {
    return changetype<OpenRebalance | null>(store.get("OpenRebalance", id));
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

  get epoch(): BigInt {
    let value = this.get("epoch");
    return value!.toBigInt();
  }

  set epoch(value: BigInt) {
    this.set("epoch", Value.fromBigInt(value));
  }

  get nextVaultGlpAlloc(): Array<BigInt> {
    let value = this.get("nextVaultGlpAlloc");
    return value!.toBigIntArray();
  }

  set nextVaultGlpAlloc(value: Array<BigInt>) {
    this.set("nextVaultGlpAlloc", Value.fromBigIntArray(value));
  }

  get nextGlpComp(): Array<BigInt> {
    let value = this.get("nextGlpComp");
    return value!.toBigIntArray();
  }

  set nextGlpComp(value: Array<BigInt>) {
    this.set("nextGlpComp", Value.fromBigIntArray(value));
  }

  get adjustedPositions(): Array<BigInt> {
    let value = this.get("adjustedPositions");
    return value!.toBigIntArray();
  }

  set adjustedPositions(value: Array<BigInt>) {
    this.set("adjustedPositions", Value.fromBigIntArray(value));
  }
}

export class CloseRebalance extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save CloseRebalance entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type CloseRebalance must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("CloseRebalance", id.toString(), this);
    }
  }

  static load(id: string): CloseRebalance | null {
    return changetype<CloseRebalance | null>(store.get("CloseRebalance", id));
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

  get epoch(): BigInt {
    let value = this.get("epoch");
    return value!.toBigInt();
  }

  set epoch(value: BigInt) {
    this.set("epoch", Value.fromBigInt(value));
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

  get epoch(): BigInt {
    let value = this.get("epoch");
    return value!.toBigInt();
  }

  set epoch(value: BigInt) {
    this.set("epoch", Value.fromBigInt(value));
  }

  get totalVaultFee(): BigInt {
    let value = this.get("totalVaultFee");
    return value!.toBigInt();
  }

  set totalVaultFee(value: BigInt) {
    this.set("totalVaultFee", Value.fromBigInt(value));
  }

  get performanceFeeInAsset(): BigInt {
    let value = this.get("performanceFeeInAsset");
    return value!.toBigInt();
  }

  set performanceFeeInAsset(value: BigInt) {
    this.set("performanceFeeInAsset", Value.fromBigInt(value));
  }

  get managementFeeInAsset(): BigInt {
    let value = this.get("managementFeeInAsset");
    return value!.toBigInt();
  }

  set managementFeeInAsset(value: BigInt) {
    this.set("managementFeeInAsset", Value.fromBigInt(value));
  }

  get slowReleaseMintAmount(): BigInt {
    let value = this.get("slowReleaseMintAmount");
    return value!.toBigInt();
  }

  set slowReleaseMintAmount(value: BigInt) {
    this.set("slowReleaseMintAmount", Value.fromBigInt(value));
  }

  get vault(): string {
    let value = this.get("vault");
    return value!.toString();
  }

  set vault(value: string) {
    this.set("vault", Value.fromString(value));
  }
}

export class CompoundDistributeYield extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save CompoundDistributeYield entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type CompoundDistributeYield must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("CompoundDistributeYield", id.toString(), this);
    }
  }

  static load(id: string): CompoundDistributeYield | null {
    return changetype<CompoundDistributeYield | null>(
      store.get("CompoundDistributeYield", id)
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

  get epoch(): BigInt {
    let value = this.get("epoch");
    return value!.toBigInt();
  }

  set epoch(value: BigInt) {
    this.set("epoch", Value.fromBigInt(value));
  }

  get glpYieldPerVault(): Array<BigInt> {
    let value = this.get("glpYieldPerVault");
    return value!.toBigIntArray();
  }

  set glpYieldPerVault(value: Array<BigInt>) {
    this.set("glpYieldPerVault", Value.fromBigIntArray(value));
  }
}

export class Cycle extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Cycle entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Cycle must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Cycle", id.toString(), this);
    }
  }

  static load(id: string): Cycle | null {
    return changetype<Cycle | null>(store.get("Cycle", id));
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

  get epoch(): BigInt {
    let value = this.get("epoch");
    return value!.toBigInt();
  }

  set epoch(value: BigInt) {
    this.set("epoch", Value.fromBigInt(value));
  }

  get round(): BigInt {
    let value = this.get("round");
    return value!.toBigInt();
  }

  set round(value: BigInt) {
    this.set("round", Value.fromBigInt(value));
  }
}

export class RebalanceGlpPosition extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save RebalanceGlpPosition entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type RebalanceGlpPosition must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("RebalanceGlpPosition", id.toString(), this);
    }
  }

  static load(id: string): RebalanceGlpPosition | null {
    return changetype<RebalanceGlpPosition | null>(
      store.get("RebalanceGlpPosition", id)
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

  get epoch(): BigInt {
    let value = this.get("epoch");
    return value!.toBigInt();
  }

  set epoch(value: BigInt) {
    this.set("epoch", Value.fromBigInt(value));
  }

  get vaultGlpAttributionBefore(): Array<BigInt> {
    let value = this.get("vaultGlpAttributionBefore");
    return value!.toBigIntArray();
  }

  set vaultGlpAttributionBefore(value: Array<BigInt>) {
    this.set("vaultGlpAttributionBefore", Value.fromBigIntArray(value));
  }

  get vaultGlpAttributionAfter(): Array<BigInt> {
    let value = this.get("vaultGlpAttributionAfter");
    return value!.toBigIntArray();
  }

  set vaultGlpAttributionAfter(value: Array<BigInt>) {
    this.set("vaultGlpAttributionAfter", Value.fromBigIntArray(value));
  }

  get targetGlpAllocation(): Array<BigInt> {
    let value = this.get("targetGlpAllocation");
    return value!.toBigIntArray();
  }

  set targetGlpAllocation(value: Array<BigInt>) {
    this.set("targetGlpAllocation", Value.fromBigIntArray(value));
  }

  get vaultGlpDeltaToExecute(): Array<BigInt> {
    let value = this.get("vaultGlpDeltaToExecute");
    return value!.toBigIntArray();
  }

  set vaultGlpDeltaToExecute(value: Array<BigInt>) {
    this.set("vaultGlpDeltaToExecute", Value.fromBigIntArray(value));
  }

  get totalVaultGlpDelta(): Array<BigInt> {
    let value = this.get("totalVaultGlpDelta");
    return value!.toBigIntArray();
  }

  set totalVaultGlpDelta(value: Array<BigInt>) {
    this.set("totalVaultGlpDelta", Value.fromBigIntArray(value));
  }
}

export class SettleNettedPositionPnl extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save SettleNettedPositionPnl entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type SettleNettedPositionPnl must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("SettleNettedPositionPnl", id.toString(), this);
    }
  }

  static load(id: string): SettleNettedPositionPnl | null {
    return changetype<SettleNettedPositionPnl | null>(
      store.get("SettleNettedPositionPnl", id)
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

  get epoch(): BigInt {
    let value = this.get("epoch");
    return value!.toBigInt();
  }

  set epoch(value: BigInt) {
    this.set("epoch", Value.fromBigInt(value));
  }

  get previousGlpAmount(): Array<BigInt> {
    let value = this.get("previousGlpAmount");
    return value!.toBigIntArray();
  }

  set previousGlpAmount(value: Array<BigInt>) {
    this.set("previousGlpAmount", Value.fromBigIntArray(value));
  }

  get settledGlpAmount(): Array<BigInt> {
    let value = this.get("settledGlpAmount");
    return value!.toBigIntArray();
  }

  set settledGlpAmount(value: Array<BigInt>) {
    this.set("settledGlpAmount", Value.fromBigIntArray(value));
  }

  get glpPnl(): Array<BigInt> {
    let value = this.get("glpPnl");
    return value!.toBigIntArray();
  }

  set glpPnl(value: Array<BigInt>) {
    this.set("glpPnl", Value.fromBigIntArray(value));
  }

  get dollarPnl(): Array<BigInt> {
    let value = this.get("dollarPnl");
    return value!.toBigIntArray();
  }

  set dollarPnl(value: Array<BigInt>) {
    this.set("dollarPnl", Value.fromBigIntArray(value));
  }

  get percentPriceChange(): Array<BigInt> {
    let value = this.get("percentPriceChange");
    return value!.toBigIntArray();
  }

  set percentPriceChange(value: Array<BigInt>) {
    this.set("percentPriceChange", Value.fromBigIntArray(value));
  }
}

export class UpdateNettingCheckpointPrice extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save UpdateNettingCheckpointPrice entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type UpdateNettingCheckpointPrice must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("UpdateNettingCheckpointPrice", id.toString(), this);
    }
  }

  static load(id: string): UpdateNettingCheckpointPrice | null {
    return changetype<UpdateNettingCheckpointPrice | null>(
      store.get("UpdateNettingCheckpointPrice", id)
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

  get epoch(): BigInt {
    let value = this.get("epoch");
    return value!.toBigInt();
  }

  set epoch(value: BigInt) {
    this.set("epoch", Value.fromBigInt(value));
  }

  get oldPrices_stable(): BigInt {
    let value = this.get("oldPrices_stable");
    return value!.toBigInt();
  }

  set oldPrices_stable(value: BigInt) {
    this.set("oldPrices_stable", Value.fromBigInt(value));
  }

  get oldPrices_eth(): BigInt {
    let value = this.get("oldPrices_eth");
    return value!.toBigInt();
  }

  set oldPrices_eth(value: BigInt) {
    this.set("oldPrices_eth", Value.fromBigInt(value));
  }

  get oldPrices_btc(): BigInt {
    let value = this.get("oldPrices_btc");
    return value!.toBigInt();
  }

  set oldPrices_btc(value: BigInt) {
    this.set("oldPrices_btc", Value.fromBigInt(value));
  }

  get oldPrices_link(): BigInt {
    let value = this.get("oldPrices_link");
    return value!.toBigInt();
  }

  set oldPrices_link(value: BigInt) {
    this.set("oldPrices_link", Value.fromBigInt(value));
  }

  get oldPrices_uni(): BigInt {
    let value = this.get("oldPrices_uni");
    return value!.toBigInt();
  }

  set oldPrices_uni(value: BigInt) {
    this.set("oldPrices_uni", Value.fromBigInt(value));
  }

  get newPrices_stable(): BigInt {
    let value = this.get("newPrices_stable");
    return value!.toBigInt();
  }

  set newPrices_stable(value: BigInt) {
    this.set("newPrices_stable", Value.fromBigInt(value));
  }

  get newPrices_eth(): BigInt {
    let value = this.get("newPrices_eth");
    return value!.toBigInt();
  }

  set newPrices_eth(value: BigInt) {
    this.set("newPrices_eth", Value.fromBigInt(value));
  }

  get newPrices_btc(): BigInt {
    let value = this.get("newPrices_btc");
    return value!.toBigInt();
  }

  set newPrices_btc(value: BigInt) {
    this.set("newPrices_btc", Value.fromBigInt(value));
  }

  get newPrices_link(): BigInt {
    let value = this.get("newPrices_link");
    return value!.toBigInt();
  }

  set newPrices_link(value: BigInt) {
    this.set("newPrices_link", Value.fromBigInt(value));
  }

  get newPrices_uni(): BigInt {
    let value = this.get("newPrices_uni");
    return value!.toBigInt();
  }

  set newPrices_uni(value: BigInt) {
    this.set("newPrices_uni", Value.fromBigInt(value));
  }
}

export class GmxState extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save GmxState entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type GmxState must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("GmxState", id.toString(), this);
    }
  }

  static load(id: string): GmxState | null {
    return changetype<GmxState | null>(store.get("GmxState", id));
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

  get assetsPrices(): Array<BigInt> {
    let value = this.get("assetsPrices");
    return value!.toBigIntArray();
  }

  set assetsPrices(value: Array<BigInt>) {
    this.set("assetsPrices", Value.fromBigIntArray(value));
  }

  get glpPrice(): BigInt {
    let value = this.get("glpPrice");
    return value!.toBigInt();
  }

  set glpPrice(value: BigInt) {
    this.set("glpPrice", Value.fromBigInt(value));
  }

  get glpComposition(): Array<BigInt> {
    let value = this.get("glpComposition");
    return value!.toBigIntArray();
  }

  set glpComposition(value: Array<BigInt>) {
    this.set("glpComposition", Value.fromBigIntArray(value));
  }
}
