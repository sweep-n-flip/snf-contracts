# Uniswap V2 NFT

[![Hardhat CI Actions Status](https://github.com/nftfy/uniswap-v2-nft/workflows/Hardhat%20CI/badge.svg)](https://github.com/nftfy/uniswap-v2-nft/actions)

A Uniswap V2 fork with minimal changes to support NFTs.

Para deploy de novas chains/subgraphs, ver [DEPLOYMENT.md](DEPLOYMENT.md).

## Deployed Contracts and Subgraphs

ADMIN multisig em todos os 4 deploys atuais: `0x789688F2a5AF4168A8Ddb90331b35c3130FAE892`.
Multicall3 universal: `0xcA11bde05977b3631167028862bE2a173976CA11`.

---

### Ethereum (1)

**Latest** — deployed 2026-04-15 (`deployments/1.json`)

| Contract | Address |
| -------- | ------- |
| FACTORY | [0x85039B2e95558aDdCCf4379728b8433C447E37bE](https://etherscan.io/address/0x85039B2e95558aDdCCf4379728b8433C447E37bE) |
| ROUTER  | [0xDc0088a282d225f8cb08D092950Dde6eBAa36E78](https://etherscan.io/address/0xDc0088a282d225f8cb08D092950Dde6eBAa36E78) |
| WETH    | [0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2](https://etherscan.io/address/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) |

**Legacy** — original criptorastas deploy

| Contract | Address |
| -------- | ------- |
| FACTORY | [0x16eD649675e6Ed9F1480091123409B4b8D228dC1](https://etherscan.io/address/0x16eD649675e6Ed9F1480091123409B4b8D228dC1) |
| ROUTER  | [0x151522484121f4e28eA24c8b5d827132775a93FE](https://etherscan.io/address/0x151522484121f4e28eA24c8b5d827132775a93FE) |

**Subgraphs** (Goldsky, schema canônico SnF v2)

| Versão | Slug | Conta | URL |
| ------ | ---- | ----- | --- |
| Latest | `snf-mainnet/1.0.0` | snf-1 | [api](https://api.goldsky.com/api/public/project_cmngb5qq6d79v01wba5bi7hdg/subgraphs/snf-mainnet/1.0.0/gn) |
| Legacy | `snf-mainnet-old/1.0.0` | snf-2 | [api](https://api.goldsky.com/api/public/project_cmnyu0s049bde01vr754rehxg/subgraphs/snf-mainnet-old/1.0.0/gn) |

---

### Base (8453)

**Latest**

| Contract | Address |
| -------- | ------- |
| FACTORY | [0x611103410C8021B51725ab38Cc79C8F0feD715c6](https://basescan.org/address/0x611103410C8021B51725ab38Cc79C8F0feD715c6) |
| ROUTER  | [0x1312488a7BF5aAF2B2EeBE8393c9616A1418CF04](https://basescan.org/address/0x1312488a7BF5aAF2B2EeBE8393c9616A1418CF04) |
| WETH    | [0x4200000000000000000000000000000000000006](https://basescan.org/address/0x4200000000000000000000000000000000000006) |

**Legacy**

| Contract | Address |
| -------- | ------- |
| FACTORY | [0xFc42221594c07F2EFCEDfb11f4763FCa03248B5A](https://basescan.org/address/0xFc42221594c07F2EFCEDfb11f4763FCa03248B5A) |
| ROUTER  | [0x46ed13B4EdDa147fA7eF018FB178300FA24C4Efc](https://basescan.org/address/0x46ed13B4EdDa147fA7eF018FB178300FA24C4Efc) |

**Subgraphs** (Goldsky, schema canônico SnF v2)

| Versão | Slug | Conta | URL |
| ------ | ---- | ----- | --- |
| Latest | `snf-base/1.0.0` | snf-1 | [api](https://api.goldsky.com/api/public/project_cmngb5qq6d79v01wba5bi7hdg/subgraphs/snf-base/1.0.0/gn) |
| Legacy | `snf-base-old/1.0.0` | snf-2 | [api](https://api.goldsky.com/api/public/project_cmnyu0s049bde01vr754rehxg/subgraphs/snf-base-old/1.0.0/gn) |

---

### Arbitrum One (42161)

**Latest** — deployed 2026-04-15 (`deployments/42161.json`)

| Contract | Address |
| -------- | ------- |
| FACTORY | [0x85039B2e95558aDdCCf4379728b8433C447E37bE](https://arbiscan.io/address/0x85039B2e95558aDdCCf4379728b8433C447E37bE) |
| ROUTER  | [0xDc0088a282d225f8cb08D092950Dde6eBAa36E78](https://arbiscan.io/address/0xDc0088a282d225f8cb08D092950Dde6eBAa36E78) |
| WETH    | [0x82aF49447D8a07e3bd95BD0d56f35241523fBab1](https://arbiscan.io/address/0x82aF49447D8a07e3bd95BD0d56f35241523fBab1) |

**Legacy**

| Contract | Address |
| -------- | ------- |
| FACTORY | [0xFc42221594c07F2EFCEDfb11f4763FCa03248B5A](https://arbiscan.io/address/0xFc42221594c07F2EFCEDfb11f4763FCa03248B5A) |
| ROUTER  | [0x46ed13B4EdDa147fA7eF018FB178300FA24C4Efc](https://arbiscan.io/address/0x46ed13B4EdDa147fA7eF018FB178300FA24C4Efc) |

**Subgraphs** (Goldsky, schema canônico SnF v2)

| Versão | Slug | Conta | URL |
| ------ | ---- | ----- | --- |
| Latest | `snf-arbitrum/1.0.0` | snf-3 | [api](https://api.goldsky.com/api/public/project_cmo0byz6wpdci01vt2k7p3l2q/subgraphs/snf-arbitrum/1.0.0/gn) |
| Legacy | `snf-arbitrum-old/1.0.0` | snf-1 | [api](https://api.goldsky.com/api/public/project_cmngb5qq6d79v01wba5bi7hdg/subgraphs/snf-arbitrum-old/1.0.0/gn) |

---

### Polygon (137)

**Latest** — deployed 2026-04-15 (`deployments/137.json`)

| Contract | Address |
| -------- | ------- |
| FACTORY | [0x85039B2e95558aDdCCf4379728b8433C447E37bE](https://polygonscan.com/address/0x85039B2e95558aDdCCf4379728b8433C447E37bE) |
| ROUTER  | [0xDc0088a282d225f8cb08D092950Dde6eBAa36E78](https://polygonscan.com/address/0xDc0088a282d225f8cb08D092950Dde6eBAa36E78) |
| WMATIC  | [0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270](https://polygonscan.com/address/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270) |

**Legacy**

| Contract | Address |
| -------- | ------- |
| FACTORY | [0x16eD649675e6Ed9F1480091123409B4b8D228dC1](https://polygonscan.com/address/0x16eD649675e6Ed9F1480091123409B4b8D228dC1) |
| ROUTER  | [0x151522484121f4e28eA24c8b5d827132775a93FE](https://polygonscan.com/address/0x151522484121f4e28eA24c8b5d827132775a93FE) |

**Subgraphs** (Goldsky, schema canônico SnF v2)

| Versão | Slug | Conta | URL |
| ------ | ---- | ----- | --- |
| Latest | `snf-polygon/1.0.0` | snf-3 | [api](https://api.goldsky.com/api/public/project_cmo0byz6wpdci01vt2k7p3l2q/subgraphs/snf-polygon/1.0.0/gn) |
| Legacy | `snf-polygon-old/1.0.0` | snf-2 | [api](https://api.goldsky.com/api/public/project_cmnyu0s049bde01vr754rehxg/subgraphs/snf-polygon-old/1.0.0/gn) |

---

## Goldsky accounts

Free tier limita 3 subgraphs por projeto. Distribuição atual:

| Conta | Project ID | Subgraphs |
| ----- | ---------- | --------- |
| `snf` (Account 1) | `cmngb5qq6d79v01wba5bi7hdg` | snf-base, snf-mainnet, snf-arbitrum-old |
| `snf-2` (Account 2) | `cmnyu0s049bde01vr754rehxg` | snf-base-old, snf-mainnet-old, snf-polygon-old |
| `snf-3` (Account 3) | `cmo0byz6wpdci01vt2k7p3l2q` | snf-polygon, snf-arbitrum |
