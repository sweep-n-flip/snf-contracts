import { Address, BigInt, BigDecimal, Bytes } from '@graphprotocol/graph-ts';

import { Collection, Currency, Pair, PairDay, PairMonth, Swap, Counter } from '../types/schema';
import { Pair as PairTemplate, Wrapper as WrapperTemplate } from '../types/templates';
import { PairCreated as PairCreatedEvent, WrapperCreated as WrapperCreatedEvent } from '../types/Factory/IUniswapV2Factory';
import { Swap as SwapEvent, Sync as SyncEvent } from '../types/templates/Pair/IUniswapV2Pair';
import { Mint as MintEvent, Burn as BurnEvent } from '../types/templates/Wrapper/IWERC721';
import { IERC20 } from '../types/Factory/IERC20';
import { IERC721 } from '../types/Factory/IERC721';
import {
  ZERO_BD, loadBundle, updateEthPrice, refreshCurrencyEthFromPair,
  computeReserveETH, computeVolumeETH, findEthPerToken,
} from './pricing';

let ZERO_BIGINT = BigInt.fromI32(0);
let ZERO_BIGDECIMAL = ZERO_BIGINT.toBigDecimal();
let ZERO_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000');

function coins(amount: BigInt, decimals: i32): BigDecimal {
  if (decimals > 0) {
    let scale = BigInt.fromI32(10).pow(decimals as u8).toBigDecimal();
    return amount.toBigDecimal().div(scale);
  }
  if (decimals < 0) {
    let scale = BigInt.fromI32(10).pow((-decimals) as u8).toBigDecimal();
    return amount.toBigDecimal().times(scale);
  }
  return amount.toBigDecimal();
}

function registerCollection(address: Address, wrapper: Currency): Collection {
  let collectionId = address.toHexString();
  let collection = Collection.load(collectionId);
  if (collection == null) {
    let contract = IERC721.bind(address);
    let name = contract.try_name();
    let symbol = contract.try_symbol();
    collection = new Collection(collectionId);
    collection.name = name.reverted ? null : name.value;
    collection.symbol = symbol.reverted ? null : symbol.value;
    collection.wrapper = wrapper.id;
    collection.save();
  }
  return collection as Collection;
}

function registerCurrency(address: Address): Currency {
  let currencyId = address.toHexString();
  let currency = Currency.load(currencyId);
  if (currency == null) {
    let contract = IERC20.bind(address);
    let name = contract.try_name();
    let symbol = contract.try_symbol();
    let decimals = contract.try_decimals();
    currency = new Currency(currencyId);
    currency.name = name.reverted ? null : name.value;
    currency.symbol = symbol.reverted ? null : symbol.value;
    currency.decimals = decimals.reverted ? 0 : decimals.value;
    currency.wrapping = false;
    currency.collection = null;
    currency.tokenIds = [];
    currency.derivedETH = ZERO_BD;
    currency.save();
  }
  return currency as Currency;
}

function registerPair(address: Address, token0: Currency, token1: Currency, timestamp: BigInt, blockNumber: BigInt): Pair {
  let pairId = address.toHexString();
  let pair = Pair.load(pairId);
  if (pair == null) {
    pair = new Pair(pairId);
    pair.token0 = token0.id;
    pair.token1 = token1.id;
    pair.discrete0 = token0.wrapping;
    pair.discrete1 = token1.wrapping;
    pair.reserve0 = ZERO_BIGDECIMAL;
    pair.reserve1 = ZERO_BIGDECIMAL;
    pair.totalSupply = ZERO_BIGDECIMAL;
    pair.reserveETH = ZERO_BIGDECIMAL;
    pair.reserveUSD = ZERO_BIGDECIMAL;
    pair.volumeToken0 = ZERO_BIGDECIMAL;
    pair.volumeToken1 = ZERO_BIGDECIMAL;
    pair.volumeUSD = ZERO_BIGDECIMAL;
    pair.txCount = ZERO_BIGINT;
    pair.isNFTPool = token0.wrapping || token1.wrapping;
    pair.createdAtTimestamp = timestamp;
    pair.createdAtBlockNumber = blockNumber;
    pair.save();
  }
  return pair as Pair;
}

function updateCurrencyAsWrapper(wrapper: Currency, collection: Collection): void {
  wrapper.wrapping = true;
  wrapper.collection = collection.id;
  wrapper.tokenIds = [];
  wrapper.save();
}

function updateDailyVolume(
  address: Address,
  timestamp: BigInt,
  volume0: BigDecimal,
  volume1: BigDecimal,
  volumeUSD: BigDecimal,
): void {
  let pairId = address.toHexString();
  let pair = loadPair(address.toHexString());
  let DAY = 24 * 60 * 60;
  let day = (timestamp.toI32() / DAY) * DAY;
  let pairDayId = pairId.concat(':').concat(day.toString());
  let pairDay = PairDay.load(pairDayId);
  if (pairDay == null) {
    pairDay = new PairDay(pairDayId);
    pairDay.pair = pairId;
    pairDay.day = day;
    pairDay.volume0 = ZERO_BIGDECIMAL;
    pairDay.volume1 = ZERO_BIGDECIMAL;
    pairDay.volumeUSD = ZERO_BIGDECIMAL;
    pairDay.reserve0 = pair.reserve0;
    pairDay.reserve1 = pair.reserve1;
    pairDay.reserveUSD = pair.reserveUSD;
    pairDay.totalSupply = pair.totalSupply;
    pairDay.txCount = ZERO_BIGINT;
  }
  pairDay.volume0 = pairDay.volume0.plus(volume0);
  pairDay.volume1 = pairDay.volume1.plus(volume1);
  pairDay.volumeUSD = pairDay.volumeUSD.plus(volumeUSD);
  pairDay.reserve0 = pair.reserve0;
  pairDay.reserve1 = pair.reserve1;
  pairDay.reserveUSD = pair.reserveUSD;
  pairDay.totalSupply = pair.totalSupply;
  pairDay.txCount = pairDay.txCount.plus(BigInt.fromI32(1));
  pairDay.save();
}

function updateMonthlyVolume(
  address: Address,
  timestamp: BigInt,
  volume0: BigDecimal,
  volume1: BigDecimal,
  volumeUSD: BigDecimal,
): void {
  let pairId = address.toHexString();
  let pair = loadPair(pairId);
  let MONTH = 730 * 60 * 60;
  let month = (timestamp.toI32() / MONTH) * MONTH;
  let pairMonthId = pairId.concat(':').concat(month.toString());
  let pairMonth = PairMonth.load(pairMonthId);
  if (pairMonth == null) {
    pairMonth = new PairMonth(pairMonthId);
    pairMonth.pair = pairId;
    pairMonth.month = month;
    pairMonth.volume0 = ZERO_BIGDECIMAL;
    pairMonth.volume1 = ZERO_BIGDECIMAL;
    pairMonth.volumeUSD = ZERO_BIGDECIMAL;
    pairMonth.reserve0 = pair.reserve0;
    pairMonth.reserve1 = pair.reserve1;
    pairMonth.reserveUSD = pair.reserveUSD;
    pairMonth.totalSupply = pair.totalSupply;
    pairMonth.txCount = ZERO_BIGINT;
  }
  pairMonth.volume0 = pairMonth.volume0.plus(volume0);
  pairMonth.volume1 = pairMonth.volume1.plus(volume1);
  pairMonth.volumeUSD = pairMonth.volumeUSD.plus(volumeUSD);
  pairMonth.reserve0 = pair.reserve0;
  pairMonth.reserve1 = pair.reserve1;
  pairMonth.reserveUSD = pair.reserveUSD;
  pairMonth.totalSupply = pair.totalSupply;
  pairMonth.txCount = pairMonth.txCount.plus(BigInt.fromI32(1));
  pairMonth.save();
}

function updatePairState(address: Address, reserve0: BigInt, reserve1: BigInt): void {
  let contract = IERC20.bind(address);
  let totalSupply = contract.try_totalSupply();
  let pairId = address.toHexString();
  let pair = loadPair(pairId);
  let token0 = loadCurrency(pair.token0);
  let token1 = loadCurrency(pair.token1);
  pair.reserve0 = coins(reserve0, token0.decimals);
  pair.reserve1 = coins(reserve1, token1.decimals);
  if (!totalSupply.reverted) {
    pair.totalSupply = coins(totalSupply.value, 18);
  }
  // If this is a WETH pair, refresh the other side's derivedETH from reserve ratio.
  refreshCurrencyEthFromPair(pair);
  // Reserve aggregates.
  pair.reserveETH = computeReserveETH(pair);
  let bundle = loadBundle();
  pair.reserveUSD = pair.reserveETH.times(bundle.ethPrice);
  pair.save();
  // If this pair is a stable/WETH anchor, bump ethPrice.
  updateEthPrice();
}

function insertWrapperItems(address: Address, items: BigInt[]): void {
  let currencyId = address.toHexString();
  let currency = loadCurrency(currencyId);
  let list = currency.tokenIds;

  if (list === null) {
    list = [];
  }

  for (let i = 0; i < items.length; i++) {
    let index = list.indexOf(items[i]);
    if (index < 0) {
      list.push(items[i]);
    }
  }
  currency.tokenIds = list;
  currency.save();
}

function removeWrapperItems(address: Address, items: BigInt[]): void {
  let currencyId = address.toHexString();
  let currency = loadCurrency(currencyId);
  let list = currency.tokenIds;

  if (list === null) {
    list = [];
  }

  for (let i = 0; i < items.length; i++) {
    let index = list.indexOf(items[i]);
    if (index >= 0) {
      list.splice(index, 1);
    }
  }
  currency.tokenIds = list;
  currency.save();
}

function nextSwapId(): BigInt {
  let counter = Counter.load('SwapCount');
  if (counter == null) {
    counter = new Counter('SwapCount');
    counter.value = ZERO_BIGINT;
  }
  let swapId = counter.value.plus(BigInt.fromI32(1));
  counter.value = swapId;
  counter.save();
  return swapId;
}

function registerSwap(
  _swapId: BigInt,
  txId: Bytes,
  origin: Address,
  address: Address,
  type: string,
  volume0: BigDecimal,
  volume1: BigDecimal,
  volumeUSD: BigDecimal,
  timestamp: BigInt,
): void {
  let pairId = address.toHexString();
  let pair = loadPair(pairId);
  let swapId = _swapId.toString();
  let swap = new Swap(swapId);
  swap.txId = txId;
  swap.origin = origin;
  swap.pair = pair.id;
  swap.type = type;
  swap.volume0 = volume0;
  swap.volume1 = volume1;
  swap.volumeUSD = volumeUSD;
  swap.timestamp = timestamp.toI32();
  swap.save();
}

export function handlePairCreated(event: PairCreatedEvent): void {
  loadBundle(); // ensure singleton exists
  let token0 = registerCurrency(event.params.token0);
  let token1 = registerCurrency(event.params.token1);
  registerPair(event.params.pair, token0, token1, event.block.timestamp, event.block.number);
  PairTemplate.create(event.params.pair);
}

export function handleWrapperCreated(event: WrapperCreatedEvent): void {
  let wrapper = registerCurrency(event.params.wrapper);
  let collection = registerCollection(event.params.collection, wrapper);
  updateCurrencyAsWrapper(wrapper, collection);
  WrapperTemplate.create(event.params.wrapper);
}

export function handleSwap(event: SwapEvent): void {
  let sell0 = event.params.amount0In > event.params.amount0Out;
  let sell1 = event.params.amount1In > event.params.amount1Out;
  let volume0Raw = sell0 ? event.params.amount0In.minus(event.params.amount0Out) : event.params.amount0Out.minus(event.params.amount0In);
  let volume1Raw = sell1 ? event.params.amount1In.minus(event.params.amount1Out) : event.params.amount1Out.minus(event.params.amount1In);

  let pair = loadPair(event.address.toHexString());
  let token0 = loadCurrency(pair.token0);
  let token1 = loadCurrency(pair.token1);

  let volume0 = coins(volume0Raw, token0.decimals);
  let volume1 = coins(volume1Raw, token1.decimals);

  // USD value for this swap.
  let volumeETH = computeVolumeETH(pair, volume0, volume1);
  let bundle = loadBundle();
  let volumeUSD = volumeETH.times(bundle.ethPrice);

  // Pair aggregates.
  pair.volumeToken0 = pair.volumeToken0.plus(volume0);
  pair.volumeToken1 = pair.volumeToken1.plus(volume1);
  pair.volumeUSD = pair.volumeUSD.plus(volumeUSD);
  pair.txCount = pair.txCount.plus(BigInt.fromI32(1));
  pair.save();

  updateDailyVolume(event.address, event.block.timestamp, volume0, volume1, volumeUSD);
  updateMonthlyVolume(event.address, event.block.timestamp, volume0, volume1, volumeUSD);

  let swapId = nextSwapId();
  let type = !sell0 && sell1 ? 'BUY0_SELL1' : sell0 && !sell1 ? 'SELL0_BUY1' : 'OTHER';
  registerSwap(swapId, event.transaction.hash, event.transaction.from, event.address, type, volume0, volume1, volumeUSD, event.block.timestamp);
}

export function handleSync(event: SyncEvent): void {
  updatePairState(event.address, event.params.reserve0, event.params.reserve1);
}

export function handleMint(event: MintEvent): void {
  insertWrapperItems(event.address, event.params.tokenIds);
}

export function handleBurn(event: BurnEvent): void {
  removeWrapperItems(event.address, event.params.tokenIds);
}

function loadPair(hexAddress: string): Pair {
  let pairId = hexAddress
  let pair = Pair.load(pairId);

  if (pair == null) {
    pair = new Pair(pairId);
    pair.token0 = '';
    pair.token1 = '';
    pair.discrete0 = false;
    pair.discrete1 = false;
    pair.reserve0 = ZERO_BIGDECIMAL;
    pair.reserve1 = ZERO_BIGDECIMAL;
    pair.totalSupply = ZERO_BIGDECIMAL;
    pair.reserveETH = ZERO_BIGDECIMAL;
    pair.reserveUSD = ZERO_BIGDECIMAL;
    pair.volumeToken0 = ZERO_BIGDECIMAL;
    pair.volumeToken1 = ZERO_BIGDECIMAL;
    pair.volumeUSD = ZERO_BIGDECIMAL;
    pair.txCount = ZERO_BIGINT;
    pair.isNFTPool = false;
    pair.createdAtTimestamp = ZERO_BIGINT;
    pair.createdAtBlockNumber = ZERO_BIGINT;
  }

  return pair;
}

function loadCurrency(hexAddress: string): Currency {
  let currencyId = hexAddress;
  let currency = Currency.load(currencyId);

  if (currency == null) {
    currency = new Currency(currencyId);
    currency.name = '';
    currency.symbol = '';
    currency.decimals = 0;
    currency.wrapping = false;
    currency.collection = '';
    currency.tokenIds = [];
    currency.derivedETH = ZERO_BIGDECIMAL;
  }

  return currency;
}
