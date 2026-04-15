/**
 * Per-chain delegate configuration used to generate `contracts/core/Delegation.sol`.
 *
 * The `Delegation.sol` constants are used by both `UniswapV2Pair` (via library inlining)
 * and the Router's swap-routing logic. Each chain deploys the SnF AMM on top of an
 * existing Uniswap-V2-compatible DEX (SushiSwap, Uniswap V2, PancakeSwap, etc.), so
 * these values must match that upstream DEX exactly.
 *
 * Values were extracted from the legacy `Delegation.sol` header comments and from
 * on-chain queries against the respective factories.
 */

export interface DelegateConfig {
  /** Human-readable name of the upstream DEX. Used in generated file comments. */
  dexName: string;
  /** Upstream factory address. Used for CREATE2 pair address derivation. */
  factory: string;
  /** keccak256(type(UpstreamPair).creationCode) for the upstream DEX. */
  initCodeHash: string;
  /**
   * Swap fee as a fraction of 10000, minus the LP fee part.
   * 9970 = 0.30% total fee (Uniswap V2 / SushiSwap)
   * 9975 = 0.25% (PancakeSwap / StellaSwap)
   * 9998 = 0.02% (Velodrome)
   * 9997 = 0.03% (ModeSwap)
   * 9970 = 0.30% (Blasterswap / Kodiak / IceSwap / HyperSwap)
   */
  netFee: number;
  /** True iff the chain uses zkSync's non-standard CREATE2 semantics. */
  createZksync: boolean;
  /** True iff the upstream DEX uses Velodrome's stable-pool CREATE2 salt form. */
  velodrome: boolean;
}

export const DELEGATE_CONFIGS: Record<number, DelegateConfig> = {
  // Ethereum mainnet — SushiSwap
  1: {
    dexName: 'SushiSwap (Ethereum mainnet)',
    factory: '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac',
    initCodeHash: '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303',
    netFee: 9970,
    createZksync: false,
    velodrome: false,
  },
  // Base mainnet — Uniswap V2
  8453: {
    dexName: 'Uniswap V2 (Base mainnet)',
    factory: '0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6',
    initCodeHash: '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
    netFee: 9970,
    createZksync: false,
    velodrome: false,
  },
  // Polygon — SushiSwap
  137: {
    dexName: 'SushiSwap (Polygon mainnet)',
    factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    initCodeHash: '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303',
    netFee: 9970,
    createZksync: false,
    velodrome: false,
  },
  // BNB Smart Chain — SushiSwap
  56: {
    dexName: 'SushiSwap (BNB mainnet)',
    factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    initCodeHash: '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303',
    netFee: 9970,
    createZksync: false,
    velodrome: false,
  },
  // Avalanche — SushiSwap
  43114: {
    dexName: 'SushiSwap (Avalanche mainnet)',
    factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    initCodeHash: '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303',
    netFee: 9970,
    createZksync: false,
    velodrome: false,
  },
  // Fantom — SushiSwap
  250: {
    dexName: 'SushiSwap (Fantom mainnet)',
    factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    initCodeHash: '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303',
    netFee: 9970,
    createZksync: false,
    velodrome: false,
  },
  // Arbitrum — SushiSwap
  42161: {
    dexName: 'SushiSwap (Arbitrum mainnet)',
    factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    initCodeHash: '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303',
    netFee: 9970,
    createZksync: false,
    velodrome: false,
  },
  // Linea — PancakeSwap
  59144: {
    dexName: 'PancakeSwap (Linea mainnet)',
    factory: '0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E',
    initCodeHash: '0x57224589c67f3f30a6b0d7a1b54cf3153ab84563bc609ef41dfb34f8b2974d2d',
    netFee: 9975,
    createZksync: false,
    velodrome: false,
  },
  // zkSync Era — PancakeSwap
  324: {
    dexName: 'PancakeSwap (zkSync mainnet)',
    factory: '0xd03D8D566183F0086d8D09A84E1e30b58Dd5619d',
    initCodeHash: '0x0100045707a42494392b3558029b9869f865ff9df8f375dc1bf20b0555093f43',
    netFee: 9975,
    createZksync: true,
    velodrome: false,
  },
  // Blast — Blasterswap
  81457: {
    dexName: 'Blasterswap (Blast mainnet)',
    factory: '0x9CC1599D4378Ea41d444642D18AA9Be44f709ffD',
    initCodeHash: '0x9895581041f0c2ea658b6c2e615187fa4eaa05e55ab576ce8164a1090d8e6575',
    netFee: 9970,
    createZksync: false,
    velodrome: false,
  },
  // Optimism — Velodrome
  10: {
    dexName: 'Velodrome (Optimism mainnet)',
    factory: '0x25CbdDb98b35ab1FF77413456B31EC81A6B6B746',
    initCodeHash: '0xc1ac28b1c4ebe53c0cff67bab5878c4eb68759bb1e9f73977cd266b247d149f0',
    netFee: 9998,
    createZksync: false,
    velodrome: true,
  },
  // Mode — ModeSwap
  34443: {
    dexName: 'ModeSwap (Mode mainnet)',
    factory: '0xfb926356BAf861c93C3557D7327Dbe8734A71891',
    initCodeHash: '0x337ec3ca78ed47c450332dd308033d9900832b31b7539f3befcbc556bff3a4a8',
    netFee: 9997,
    createZksync: false,
    velodrome: false,
  },
  // Moonbeam — StellaSwap
  1284: {
    dexName: 'StellaSwap (Moonbeam mainnet)',
    factory: '0x68A384D826D3678f78BB9FB1533c7E9577dACc0E',
    initCodeHash: '0x48a6ca3d52d0d0a6c53a83cc3c8688dd46ea4cb786b169ee959b95ad30f61643',
    netFee: 9975,
    createZksync: false,
    velodrome: false,
  },
  // Apechain — Camelot
  33139: {
    dexName: 'Camelot (Apechain)',
    factory: '0x7d8c6B58BA2d40FC6E34C25f9A488067Fe0D2dB4',
    initCodeHash: '0x0000000000000000000000000000000000000000000000000000000000000000', // TODO: fill from camelot factory
    netFee: 9970,
    createZksync: false,
    velodrome: false,
  },
  // Hyperliquid — HyperSwap
  999: {
    dexName: 'HyperSwap (Hyperliquid mainnet)',
    factory: '0x724412C00059bf7d6ee7d4a1d0D5cd4de3ea1C48',
    initCodeHash: '0xc83d9df19c8c8a0a1229bd3122cbb86fd8ff56f79cc6781c15999d39425466e9',
    netFee: 9970,
    createZksync: false,
    velodrome: false,
  },
  // Berachain bartio (testnet) — Kodiak
  80084: {
    dexName: 'Kodiak (Berachain testnet)',
    factory: '0xb08Bfed214ba87d5d5D07B7DA573010016C44488',
    initCodeHash: '0x0489c85ed300c1a9636d09ada5e1bea0e331f778464d45f24cb365c92cafbcb5',
    netFee: 9970,
    createZksync: false,
    velodrome: false,
  },
};

export function getDelegateConfig(chainId: number): DelegateConfig {
  const config = DELEGATE_CONFIGS[chainId];
  if (!config) throw new Error(`No delegate config for chainId ${chainId}. Add it to scripts/delegate-configs.ts before deploying.`);
  return config;
}
