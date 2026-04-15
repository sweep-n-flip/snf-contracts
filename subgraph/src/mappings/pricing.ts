/**
 * Pricing — derives ETH/USD and per-token ETH prices from pool reserves.
 *
 * The mapping runs per-chain, and graph-ts exposes `dataSource.network()`
 * to branch lookups. This module keeps the constants (WETH address, stable
 * pool addresses) centralized and chain-aware in ONE place, so the rest of
 * the mapping never has to care about chain-specific addresses.
 *
 * Conventions:
 *   - All addresses are lowercase hex, matching the format used as entity IDs.
 *   - Missing stable pools → bundle.ethPrice stays 0 (USD fields remain 0).
 *     Reserves and volumes in token units still populate normally.
 *
 * Stable pool addresses are the **SnF Pair addresses** (from this subgraph's
 * Factory) that wrap WETH with a stablecoin — NOT the upstream Uniswap V2
 * pools. If no such pool exists on a chain (e.g. chain deployed but no one
 * created a WETH/USDC pair yet), ethPrice is 0 until someone creates one.
 */

import { Address, BigDecimal, dataSource } from '@graphprotocol/graph-ts';
import { Bundle, Currency, Pair } from '../types/schema';

export const ZERO_BD: BigDecimal = BigDecimal.fromString('0');
export const ONE_BD:  BigDecimal = BigDecimal.fromString('1');
export const TWO_BD:  BigDecimal = BigDecimal.fromString('2');

const ZERO_ADDR = '0x0000000000000000000000000000000000000000';

/** Returns the canonical WETH (wrapped native) token address for the current chain, lowercase. */
export function getWethAddress(): string {
  let net = dataSource.network();
  if (net == 'mainnet')      return '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
  if (net == 'base')         return '0x4200000000000000000000000000000000000006';
  if (net == 'arbitrum-one') return '0x82af49447d8a07e3bd95bd0d56f35241523fbab1';
  if (net == 'matic')        return '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'; // WMATIC (Polygon native)
  if (net == 'bsc')          return '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'; // WBNB
  if (net == 'avalanche')    return '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7'; // WAVAX
  if (net == 'optimism')     return '0x4200000000000000000000000000000000000006';
  if (net == 'fantom')       return '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83'; // WFTM
  if (net == 'linea')        return '0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f';
  if (net == 'blast')        return '0x4300000000000000000000000000000000000004';
  if (net == 'moonbeam')     return '0xacc15dc74880c9944775448304b263d191c6077f'; // WGLMR
  return '';
}

/**
 * SnF Pair addresses (lowercase) of WETH↔stablecoin pools on each chain,
 * listed in priority order. The first one that exists and has non-zero
 * reserves wins. Empty list = no USD price derivation on that chain.
 *
 * Update this when new stable pools are created. Entries that haven't been
 * deployed yet can coexist — load() returns null harmlessly.
 */
export function getStableWethPairs(): string[] {
  let net = dataSource.network();
  let out: string[] = [];
  // On each chain, "WETH" means the wrapped native token (WETH / WMATIC / WBNB / ...).
  // These are SnF Pair addresses (via our Factory) that wrap WETH with a stable.
  // Verified on-chain 2026-04-15 via factory.getPair(WETH, STABLE).
  if (net == 'matic') {
    // WMATIC/USDC.e — largest pool, ~484k WMATIC / 41k USDCe → $0.085/MATIC
    out.push('0xcd353f79d9fade311fc3119b841e1f456b54e858');
    // WMATIC/USDT — fallback, ~57k WMATIC / 4.9k USDT → consistent $0.085/MATIC
    out.push('0x55ff76bffc3cdd9d5fdbbc2ece4528ecce45047e');
  }
  // base, arbitrum-one, mainnet: no WETH/stable pool created via our Factory yet.
  // USD fields stay 0 on those chains until someone creates one — update this
  // file and redeploy the subgraph when that happens.
  return out;
}

/** Whether `address` is a stablecoin (used to decide numerator/denominator in a WETH/stable pool). */
export function isStablecoin(address: string): boolean {
  let net = dataSource.network();
  let a = address.toLowerCase();
  if (net == 'mainnet') {
    if (a == '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48') return true; // USDC
    if (a == '0xdac17f958d2ee523a2206206994597c13d831ec7') return true; // USDT
    if (a == '0x6b175474e89094c44da98b954eedeac495271d0f') return true; // DAI
  }
  if (net == 'base') {
    if (a == '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913') return true; // USDC
    if (a == '0xfde4c96c8593536e31f229ea8f37b2ada2699bb2') return true; // USDT
    if (a == '0x50c5725949a6f0c72e6c4a641f24049a917db0cb') return true; // DAI
  }
  if (net == 'arbitrum-one') {
    if (a == '0xaf88d065e77c8cc2239327c5edb3a432268e5831') return true; // USDC
    if (a == '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9') return true; // USDT
    if (a == '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1') return true; // DAI
  }
  if (net == 'matic') {
    if (a == '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359') return true; // USDC
    if (a == '0x2791bca1f2de4661ed88a30c99a7a9449aa84174') return true; // USDC.e (bridged)
    if (a == '0xc2132d05d31c914a87c6611c10748aeb04b58e8f') return true; // USDT
    if (a == '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063') return true; // DAI
  }
  return false;
}

/**
 * Recomputes `Bundle.ethPrice` by scanning the configured stable/WETH pools
 * and taking the reserve-weighted price from the pool with the most WETH.
 * Called from handleSync so it stays fresh.
 */
export function updateEthPrice(): void {
  let pairs = getStableWethPairs();
  if (pairs.length == 0) {
    let b = loadBundle();
    b.ethPrice = ZERO_BD;
    b.save();
    return;
  }

  let weth = getWethAddress();
  let bestWethReserve = ZERO_BD;
  let bestPrice = ZERO_BD;

  for (let i = 0; i < pairs.length; i++) {
    let pair = Pair.load(pairs[i]);
    if (pair == null) continue;
    // Which side is WETH?
    let token0IsWeth = pair.token0 == weth;
    let token1IsWeth = pair.token1 == weth;
    if (!token0IsWeth && !token1IsWeth) continue;
    let wethReserve  = token0IsWeth ? pair.reserve0 : pair.reserve1;
    let stableReserve = token0IsWeth ? pair.reserve1 : pair.reserve0;
    if (wethReserve.le(ZERO_BD) || stableReserve.le(ZERO_BD)) continue;
    if (wethReserve.gt(bestWethReserve)) {
      bestWethReserve = wethReserve;
      bestPrice = stableReserve.div(wethReserve);
    }
  }

  let bundle = loadBundle();
  bundle.ethPrice = bestPrice;
  bundle.save();
}

/**
 * Computes the derivedETH for a currency by searching a direct WETH pool.
 * Returns 1 for WETH itself, reserve-ratio price for tokens paired with WETH,
 * and 0 if no WETH pool exists. Intentionally NOT recursive — keeps mapping
 * cheap and avoids infinite loops on circular refs.
 */
export function findEthPerToken(currencyId: string): BigDecimal {
  let weth = getWethAddress();
  if (weth == '' || currencyId == ZERO_ADDR) return ZERO_BD;
  if (currencyId == weth) return ONE_BD;
  // Search all pairs for one that contains this token + WETH is expensive.
  // Instead we rely on Sync handler to refresh the currency's derivedETH
  // whenever a pool it belongs to resyncs. See `refreshCurrencyEthFromPair`.
  let c = Currency.load(currencyId);
  if (c == null) return ZERO_BD;
  return c.derivedETH;
}

/**
 * When a Pair's reserves sync, if the pair is token ↔ WETH, we can update
 * the non-WETH currency's `derivedETH` from the reserve ratio. Applies to
 * both regular ERC20/WETH pools and SnF WNFT/WETH pools.
 */
export function refreshCurrencyEthFromPair(pair: Pair): void {
  let weth = getWethAddress();
  if (weth == '') return;
  if (pair.token0 == weth && pair.reserve0.gt(ZERO_BD)) {
    let other = Currency.load(pair.token1);
    if (other != null) {
      other.derivedETH = pair.reserve0.div(pair.reserve1.gt(ZERO_BD) ? pair.reserve1 : ONE_BD);
      other.save();
    }
  } else if (pair.token1 == weth && pair.reserve1.gt(ZERO_BD)) {
    let other = Currency.load(pair.token0);
    if (other != null) {
      other.derivedETH = pair.reserve1.div(pair.reserve0.gt(ZERO_BD) ? pair.reserve0 : ONE_BD);
      other.save();
    }
  }
}

/**
 * Computes the ETH-denominated reserve of a pair from both sides.
 * ETH(reserve0) + ETH(reserve1). Either term is 0 when that side has no
 * derivable price.
 */
export function computeReserveETH(pair: Pair): BigDecimal {
  let t0EthPer = findEthPerToken(pair.token0);
  let t1EthPer = findEthPerToken(pair.token1);
  let side0 = pair.reserve0.times(t0EthPer);
  let side1 = pair.reserve1.times(t1EthPer);
  return side0.plus(side1);
}

/**
 * Computes the ETH-denominated volume of a single swap: uses the side whose
 * price is known (WETH side preferred). Returns 0 when neither side has a
 * price.
 */
export function computeVolumeETH(pair: Pair, volume0: BigDecimal, volume1: BigDecimal): BigDecimal {
  let t0EthPer = findEthPerToken(pair.token0);
  let t1EthPer = findEthPerToken(pair.token1);
  // If both sides priced, average the two legs (matches Uniswap V2 convention).
  if (t0EthPer.gt(ZERO_BD) && t1EthPer.gt(ZERO_BD)) {
    let leg0 = volume0.times(t0EthPer);
    let leg1 = volume1.times(t1EthPer);
    return leg0.plus(leg1).div(TWO_BD);
  }
  if (t0EthPer.gt(ZERO_BD)) return volume0.times(t0EthPer);
  if (t1EthPer.gt(ZERO_BD)) return volume1.times(t1EthPer);
  return ZERO_BD;
}

export function loadBundle(): Bundle {
  let bundle = Bundle.load('1');
  if (bundle == null) {
    bundle = new Bundle('1');
    bundle.ethPrice = ZERO_BD;
    bundle.save();
  }
  return bundle as Bundle;
}
