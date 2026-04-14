# snf-contracts — Smart Contracts + Indexers

**GitHub**: snf-contracts
**Status**: Active — deployed on Base and 15+ networks

## What This Is

Solidity smart contracts (Uniswap V2 fork adapted for NFTs) + The Graph subgraph definitions + Subsquid indexer. Core AMM protocol: Factory creates pairs, Router executes swaps, WERC721 wraps NFTs for AMM compatibility.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Hardhat 2.22 |
| Language | Solidity 0.8.9 (core), 0.8.20 (tokens) |
| Dependencies | @openzeppelin/contracts 5.4, erc721a 4.3 |
| Indexing | The Graph (15+ networks), Subsquid (alternative) |
| Chains | Base (primary), Ethereum, BNB, Polygon, Ape Chain, Berachain, + testnets |

## Key Directories

- `contracts/core/` — UniswapV2Pair, UniswapV2Factory, WERC721, Delegation
- `contracts/periphery/` — UniswapV2Router01, UniswapV2Router01Collection, RoyaltyHelper
- `contracts/tokens/` — ERC721A NFT contracts (Genesis HL-OGs, Mockdrop)
- `subgraph/` — The Graph schema, mappings, per-network configs (20+)
- `subsquid/` — Alternative indexer
- `scripts/` — Deploy, verify, generate metadata

## Deployed Contracts (Base — 8453)

| Contract | Address |
|----------|---------|
| Factory | `0x611103410C8021B51725ab38Cc79C8F0feD715c6` |
| Router02 | `0x1312488a7BF5aAF2B2EeBE8393c9616A1418CF04` |
| WETH | `0x4200000000000000000000000000000000000006` |
| Multicall3 | `0xcA11bde05977b3631167028862bE2a173976CA11` |

## Key Concepts

- **WERC721**: Wraps ERC721 NFTs to ERC20 (1 NFT = 1e18 tokens) for AMM
- **Delegation**: Routes standard ERC20 pairs to upstream DEXes (SushiSwap, PancakeSwap, etc.)
- **Discrete tokens**: `discrete0`/`discrete1` flags on pairs indicate NFT-backed assets
- **Marketplace fee**: Configurable via `Router.marketplaceFee()` (currently 2.5% on Base)
- **EIP-2981**: Royalty support in Collection router

## Rules

- Read workspace CLAUDE.md (parent directory) for full rules
- Never deploy without verifying Delegation config matches target chain
- All contracts are immutable (no proxy pattern)
- Test discrete token edge cases before any rounding logic changes
- **Contracts max ~300 lines** — split complex logic into libraries
- **Interfaces in separate files** — `interfaces/IContract.sol`, not inline
- **Subgraph mappings**: keep handler functions focused, extract helpers
- **Never commit to `main`** — work on `dev`, merge to `main` only for production releases
