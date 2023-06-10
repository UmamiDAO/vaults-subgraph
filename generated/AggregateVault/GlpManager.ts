// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class GlpManager extends ethereum.SmartContract {
  static bind(address: Address): GlpManager {
    return new GlpManager("GlpManager", address);
  }

  GLP_HANDLER_CONFIG_SLOT(): Bytes {
    let result = super.call(
      "GLP_HANDLER_CONFIG_SLOT",
      "GLP_HANDLER_CONFIG_SLOT():(bytes32)",
      []
    );

    return result[0].toBytes();
  }

  try_GLP_HANDLER_CONFIG_SLOT(): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "GLP_HANDLER_CONFIG_SLOT",
      "GLP_HANDLER_CONFIG_SLOT():(bytes32)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  callbackSigs(): Array<Bytes> {
    let result = super.call("callbackSigs", "callbackSigs():(bytes4[])", []);

    return result[0].toBytesArray();
  }

  try_callbackSigs(): ethereum.CallResult<Array<Bytes>> {
    let result = super.tryCall("callbackSigs", "callbackSigs():(bytes4[])", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytesArray());
  }

  getGlpComposition(volatileTokens: Array<Address>): Array<BigInt> {
    let result = super.call(
      "getGlpComposition",
      "getGlpComposition(address[]):(uint256[])",
      [ethereum.Value.fromAddressArray(volatileTokens)]
    );

    return result[0].toBigIntArray();
  }

  try_getGlpComposition(
    volatileTokens: Array<Address>
  ): ethereum.CallResult<Array<BigInt>> {
    let result = super.tryCall(
      "getGlpComposition",
      "getGlpComposition(address[]):(uint256[])",
      [ethereum.Value.fromAddressArray(volatileTokens)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigIntArray());
  }

  getGlpPrice(_max: boolean): BigInt {
    let result = super.call("getGlpPrice", "getGlpPrice(bool):(uint256)", [
      ethereum.Value.fromBoolean(_max)
    ]);

    return result[0].toBigInt();
  }

  try_getGlpPrice(_max: boolean): ethereum.CallResult<BigInt> {
    let result = super.tryCall("getGlpPrice", "getGlpPrice(bool):(uint256)", [
      ethereum.Value.fromBoolean(_max)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getGlpPrice1(): BigInt {
    let result = super.call("getGlpPrice", "getGlpPrice():(uint256)", []);

    return result[0].toBigInt();
  }

  try_getGlpPrice1(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("getGlpPrice", "getGlpPrice():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getTokenPrice(_token: Address, decimals: BigInt): BigInt {
    let result = super.call(
      "getTokenPrice",
      "getTokenPrice(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(_token),
        ethereum.Value.fromUnsignedBigInt(decimals)
      ]
    );

    return result[0].toBigInt();
  }

  try_getTokenPrice(
    _token: Address,
    decimals: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getTokenPrice",
      "getTokenPrice(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(_token),
        ethereum.Value.fromUnsignedBigInt(decimals)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getUsdToToken(
    _usdAmount: BigInt,
    _usdDecimals: BigInt,
    _token: Address
  ): BigInt {
    let result = super.call(
      "getUsdToToken",
      "getUsdToToken(uint256,uint256,address):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(_usdAmount),
        ethereum.Value.fromUnsignedBigInt(_usdDecimals),
        ethereum.Value.fromAddress(_token)
      ]
    );

    return result[0].toBigInt();
  }

  try_getUsdToToken(
    _usdAmount: BigInt,
    _usdDecimals: BigInt,
    _token: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getUsdToToken",
      "getUsdToToken(uint256,uint256,address):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(_usdAmount),
        ethereum.Value.fromUnsignedBigInt(_usdDecimals),
        ethereum.Value.fromAddress(_token)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  glpManager(): Address {
    let result = super.call("glpManager", "glpManager():(address)", []);

    return result[0].toAddress();
  }

  try_glpManager(): ethereum.CallResult<Address> {
    let result = super.tryCall("glpManager", "glpManager():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  glpRewardRouter(): Address {
    let result = super.call(
      "glpRewardRouter",
      "glpRewardRouter():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_glpRewardRouter(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "glpRewardRouter",
      "glpRewardRouter():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  previewGlpBurn(_tokenOut: Address, _glpAmount: BigInt): BigInt {
    let result = super.call(
      "previewGlpBurn",
      "previewGlpBurn(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(_tokenOut),
        ethereum.Value.fromUnsignedBigInt(_glpAmount)
      ]
    );

    return result[0].toBigInt();
  }

  try_previewGlpBurn(
    _tokenOut: Address,
    _glpAmount: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "previewGlpBurn",
      "previewGlpBurn(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(_tokenOut),
        ethereum.Value.fromUnsignedBigInt(_glpAmount)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  priceFeed(): Address {
    let result = super.call("priceFeed", "priceFeed():(address)", []);

    return result[0].toAddress();
  }

  try_priceFeed(): ethereum.CallResult<Address> {
    let result = super.tryCall("priceFeed", "priceFeed():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  usdToGlp(_usdAmount: BigInt, _usdDecimals: BigInt, _max: boolean): BigInt {
    let result = super.call(
      "usdToGlp",
      "usdToGlp(uint256,uint256,bool):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(_usdAmount),
        ethereum.Value.fromUnsignedBigInt(_usdDecimals),
        ethereum.Value.fromBoolean(_max)
      ]
    );

    return result[0].toBigInt();
  }

  try_usdToGlp(
    _usdAmount: BigInt,
    _usdDecimals: BigInt,
    _max: boolean
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "usdToGlp",
      "usdToGlp(uint256,uint256,bool):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(_usdAmount),
        ethereum.Value.fromUnsignedBigInt(_usdDecimals),
        ethereum.Value.fromBoolean(_max)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  vault(): Address {
    let result = super.call("vault", "vault():(address)", []);

    return result[0].toAddress();
  }

  try_vault(): ethereum.CallResult<Address> {
    let result = super.tryCall("vault", "vault():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _priceFeed(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _glpManager(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class MintGlpTokenAmountCall extends ethereum.Call {
  get inputs(): MintGlpTokenAmountCall__Inputs {
    return new MintGlpTokenAmountCall__Inputs(this);
  }

  get outputs(): MintGlpTokenAmountCall__Outputs {
    return new MintGlpTokenAmountCall__Outputs(this);
  }
}

export class MintGlpTokenAmountCall__Inputs {
  _call: MintGlpTokenAmountCall;

  constructor(call: MintGlpTokenAmountCall) {
    this._call = call;
  }

  get _tokenIn(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _amountIn(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _minUsdg(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get _minGlp(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }
}

export class MintGlpTokenAmountCall__Outputs {
  _call: MintGlpTokenAmountCall;

  constructor(call: MintGlpTokenAmountCall) {
    this._call = call;
  }
}

export class MintGlpUsdgAmountCall extends ethereum.Call {
  get inputs(): MintGlpUsdgAmountCall__Inputs {
    return new MintGlpUsdgAmountCall__Inputs(this);
  }

  get outputs(): MintGlpUsdgAmountCall__Outputs {
    return new MintGlpUsdgAmountCall__Outputs(this);
  }
}

export class MintGlpUsdgAmountCall__Inputs {
  _call: MintGlpUsdgAmountCall;

  constructor(call: MintGlpUsdgAmountCall) {
    this._call = call;
  }

  get _tokenIn(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _amountIn(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _minGlp(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class MintGlpUsdgAmountCall__Outputs {
  _call: MintGlpUsdgAmountCall;

  constructor(call: MintGlpUsdgAmountCall) {
    this._call = call;
  }
}
