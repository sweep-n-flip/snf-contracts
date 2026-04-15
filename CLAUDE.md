# snf-contracts — Smart Contracts + Indexers

**GitHub**: snf-contracts
**Status**: Active — current deploys on Base, Ethereum, Arbitrum, Polygon (latest); legacy deploys still running on the same chains for backward compatibility

## What This Is

Solidity smart contracts (Uniswap V2 fork adapted for NFTs) + The Graph subgraph definitions + Subsquid indexer. Core AMM protocol: Factory creates pairs, Router executes swaps, WERC721 wraps NFTs for AMM compatibility.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Hardhat 2.22 |
| Language | Solidity 0.8.9 (core), 0.8.20 (tokens) |
| Dependencies | @openzeppelin/contracts 5.4, erc721a 4.3 |
| Indexing | Goldsky (canonical, all live chains use SnF custom v2 schema). The Graph Studio used historically — Hosted Service decommissioned 2024. |
| Chains live (latest) | Base, Ethereum, Arbitrum, Polygon |
| Chains live (legacy) | Same 4 — `*-old` Goldsky subgraphs indexing pre-redeploy contracts |

## Key Directories

- `contracts/core/` — UniswapV2Pair, UniswapV2Factory, WERC721, Delegation
- `contracts/periphery/` — UniswapV2Router01, UniswapV2Router01Collection, RoyaltyHelper
- `contracts/tokens/` — ERC721A NFT contracts (Genesis HL-OGs, Mockdrop)
- `subgraph/` — Goldsky/The Graph schema (canonical SnF v2), mappings, per-network configs
- `subsquid/` — Alternative indexer (Strato, Bitfinity)
- `scripts/` — Deploy, verify, prepare (writes Delegation.sol + UniswapV2Library.sol per chain), delegate-configs (DEX upstream by chainId), deployments-io (persists addresses to `deployments/<chainId>.json` after each successful step)
- `deployments/` — One JSON per chain with addresses, factoryFrom, initCodeHash, updatedAt. Committed (public info, not secrets).

## Deployed Contracts (canonical — current)

Mesma Factory + Router em Ethereum, Arbitrum, Polygon (CREATE determinístico — deployer com nonce 0/1 nas 3). Base mantém Factory original (1ª chain deployada com o código atual).

| Chain | Factory | Router02 | Source |
|-------|---------|----------|--------|
| Base (8453) | `0x611103410C8021B51725ab38Cc79C8F0feD715c6` | `0x1312488a7BF5aAF2B2EeBE8393c9616A1418CF04` | — |
| Ethereum (1) | `0x85039B2e95558aDdCCf4379728b8433C447E37bE` | `0xDc0088a282d225f8cb08D092950Dde6eBAa36E78` | `deployments/1.json` |
| Arbitrum (42161) | `0x85039B2e95558aDdCCf4379728b8433C447E37bE` | `0xDc0088a282d225f8cb08D092950Dde6eBAa36E78` | `deployments/42161.json` |
| Polygon (137) | `0x85039B2e95558aDdCCf4379728b8433C447E37bE` | `0xDc0088a282d225f8cb08D092950Dde6eBAa36E78` | `deployments/137.json` |

**ADMIN multisig**: `0x789688F2a5AF4168A8Ddb90331b35c3130FAE892` (controls fees, marketplaceWallet, routerSetter on all 4 chains).

**Multicall3**: `0xcA11bde05977b3631167028862bE2a173976CA11` (canonical, same on every chain).

Legacy contracts ainda live (LPs antigos têm liquidez): documentados em [README.md](README.md).

## Key Concepts

- **WERC721**: Wraps ERC721 NFTs to ERC20 (1 NFT = 1e18 tokens) for AMM. Versão atual expõe `name()`/`symbol()` dinâmicos (resolvendo via collection underlying); versão legada (em chains -old) tem `symbol="WNFT"` constante — UI lê `token.collection.symbol` do subgraph para evitar isso.
- **Delegation**: Routes standard ERC20 pairs to upstream DEXes (SushiSwap, PancakeSwap, etc.). Constantes geradas por chain via `scripts/prepare.ts` a partir de `scripts/delegate-configs.ts`.
- **Discrete tokens**: `discrete0`/`discrete1` flags on pairs indicate NFT-backed assets
- **Marketplace fee**: Configurable via `Router.marketplaceFee()` (currently 2.5% across all latest deploys, 0.5% nos legados)
- **EIP-2981**: Royalty support in Collection router
- **Subgraph schema v2**: schema.graphql canônico inclui campos USD agregados (`reserveUSD`, `volumeUSD`, `txCount`, `isNFTPool`, `createdAt*`) calculados pelos mappings + `Bundle.ethPrice`. USD fica 0 até `pricing.ts:getStableWethPairs()` ser populado com SnF pairs WETH/USDC para a chain.

## Rules

- Read workspace CLAUDE.md (parent directory) for full rules
- See [DEPLOYMENT.md](DEPLOYMENT.md) para runbook completo (deploy de chain nova + deploy de subgraph)
- **SEMPRE rodar `scripts/prepare.ts` antes de `scripts/deploy.ts`** — prepare reescreve `Delegation.sol` e atualiza initCodeHash em `UniswapV2Library.sol`. Pular = sanity checks falham.
- All contracts are immutable (no proxy pattern)
- Test discrete token edge cases before any rounding logic changes
- **Contracts max ~300 lines** — split complex logic into libraries
- **Interfaces in separate files** — `interfaces/IContract.sol`, not inline
- **Subgraph mappings**: keep handler functions focused, extract helpers
- **Never commit to `main`** — work on `dev`, merge to `main` only for production releases
- **`PairDay`/`PairMonth` NÃO podem ser `@entity(immutable: true)`** — handler faz `load + acumula + save`. Sempre mutáveis.
- **Adicionar uma chain ao subgraph?** Atualizar `scripts/delegate-configs.ts`, `subgraph/config/<chain>.json`, registrar `set:<chain>` e `deploy:goldsky:<chain>` no `subgraph/package.json`. Detalhes em [DEPLOYMENT.md](DEPLOYMENT.md).
