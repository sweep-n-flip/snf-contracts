# Uniswap V2 NFT

[![Hardhat CI Actions Status](https://github.com/nftfy/uniswap-v2-nft/workflows/Hardhat%20CI/badge.svg)](https://github.com/nftfy/uniswap-v2-nft/actions)

A Uniswap V2 fork with minimal changes to support NFTs.

## Deployed Contracts and Subgraphs

Ethereum:

| Contract     | Network (ID)      | Address                                                                                                                         |
| ------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| ROUTER       | mainnet (1)       | [0xDc0088a282d225f8cb08D092950Dde6eBAa36E78](https://etherscan.io/address/0xDc0088a282d225f8cb08D092950Dde6eBAa36E78)           |
| FACTORY      | mainnet (1)       | [0x85039B2e95558aDdCCf4379728b8433C447E37bE](https://etherscan.io/address/0x85039B2e95558aDdCCf4379728b8433C447E37bE)           |

| Subgraph                        | Target  | Network (ID)      | Endpoint                                                                                                                                           |
| ------------------------------- | ------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ALL](/subgraph/schema.graphql) | Goldsky | mainnet (1)       | [`snf-mainnet/1.0.0`](https://api.goldsky.com/api/public/project_cmngb5qq6d79v01wba5bi7hdg/subgraphs/snf-mainnet/1.0.0/gn) — deployment `QmU4PoBj6vQ2Mg3Wqcj4JDvKszBZxy12uTjxekigTUKmQo` |

Ethereum (old - criptorastas):

| Contract     | Network (ID)      | Address                                                                                                                         |
| ------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| ROUTER       | mainnet (1)       | [0x151522484121f4e28eA24c8b5d827132775a93FE](https://etherscan.io/address/0x151522484121f4e28eA24c8b5d827132775a93FE)           |
| FACTORY      | mainnet (1)       | [0x16eD649675e6Ed9F1480091123409B4b8D228dC1](https://etherscan.io/address/0x16eD649675e6Ed9F1480091123409B4b8D228dC1)           |
| ROUTER       | goerli (5)        | [0x151522484121f4e28eA24c8b5d827132775a93FE](https://goerli.etherscan.io/address/0x151522484121f4e28eA24c8b5d827132775a93FE)    |
| FACTORY      | goerli (5)        | [0x16eD649675e6Ed9F1480091123409B4b8D228dC1](https://goerli.etherscan.io/address/0x16eD649675e6Ed9F1480091123409B4b8D228dC1)    |

| Subgraph                        | Target  | Network (ID)      | Endpoint                                                                                                                                                 |
| ------------------------------- | ------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ALL](/subgraph/schema.graphql) | Goldsky | mainnet (1)       | [`snf-mainnet-old/1.0.0`](https://api.goldsky.com/api/public/project_cmnyu0s049bde01vr754rehxg/subgraphs/snf-mainnet-old/1.0.0/gn) — conta snf-2, schema v2 |

Polygon Matic:

| Contract     | Network (ID)      | Address                                                                                                                         |
| ------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| ROUTER       | maticmain (137)   | [0xDc0088a282d225f8cb08D092950Dde6eBAa36E78](https://polygonscan.com/address/0xDc0088a282d225f8cb08D092950Dde6eBAa36E78)         |
| FACTORY      | maticmain (137)   | [0x85039B2e95558aDdCCf4379728b8433C447E37bE](https://polygonscan.com/address/0x85039B2e95558aDdCCf4379728b8433C447E37bE)         |

| Subgraph                        | Target  | Network (ID)      | Endpoint                                                                                                                                                                            |
| ------------------------------- | ------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ALL](/subgraph/schema.graphql) | Goldsky | maticmain (137)   | [`snf-polygon/1.0.0`](https://api.goldsky.com/api/public/project_cmo0byz6wpdci01vt2k7p3l2q/subgraphs/snf-polygon/1.0.0/gn) — conta snf-3, schema v2                                  |
| [LEGACY]                        | Goldsky | maticmain (137)   | [`snf-polygon-old/1.0.0`](https://api.goldsky.com/api/public/project_cmnyu0s049bde01vr754rehxg/subgraphs/snf-polygon-old/1.0.0/gn) — conta snf-2, indexa contratos antigos           |

Polygon Matic (old):

| Contract     | Network (ID)      | Address                                                                                                                         |
| ------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| ROUTER       | maticmain (137)   | [0x151522484121f4e28eA24c8b5d827132775a93FE](https://polygonscan.com/address/0x151522484121f4e28eA24c8b5d827132775a93FE)        |
| FACTORY      | maticmain (137)   | [0x16eD649675e6Ed9F1480091123409B4b8D228dC1](https://polygonscan.com/address/0x16eD649675e6Ed9F1480091123409B4b8D228dC1)        |
| ROUTER       | matictest (80001) | [0x151522484121f4e28eA24c8b5d827132775a93FE](https://mumbai.polygonscan.com/address/0x151522484121f4e28eA24c8b5d827132775a93FE) |
| FACTORY      | matictest (80001) | [0x16eD649675e6Ed9F1480091123409B4b8D228dC1](https://mumbai.polygonscan.com/address/0x16eD649675e6Ed9F1480091123409B4b8D228dC1) |

Arbitrum One:

| Contract     | Network (ID)      | Address                                                                                                                         |
| ------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| ROUTER       | arbmain (42161)   | [0xDc0088a282d225f8cb08D092950Dde6eBAa36E78](https://arbiscan.io/address/0xDc0088a282d225f8cb08D092950Dde6eBAa36E78)            |
| FACTORY      | arbmain (42161)   | [0x85039B2e95558aDdCCf4379728b8433C447E37bE](https://arbiscan.io/address/0x85039B2e95558aDdCCf4379728b8433C447E37bE)            |

| Subgraph                        | Target  | Network (ID)      | Endpoint                                                                                                                                                                       |
| ------------------------------- | ------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [ALL](/subgraph/schema.graphql) | Goldsky | arbmain (42161)   | [`snf-arbitrum/1.0.0`](https://api.goldsky.com/api/public/project_cmo0byz6wpdci01vt2k7p3l2q/subgraphs/snf-arbitrum/1.0.0/gn) — conta snf-3, schema v2                            |
| [LEGACY]                        | Goldsky | arbmain (42161)   | [`snf-arbitrum-old/1.0.0`](https://api.goldsky.com/api/public/project_cmngb5qq6d79v01wba5bi7hdg/subgraphs/snf-arbitrum-old/1.0.0/gn) — conta snf-1, indexa contratos legados    |

Arbitrum One (old):

| Contract     | Network (ID)      | Address                                                                                                                         |
| ------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| ROUTER       | arbmain (42161)   | [0x46ed13B4EdDa147fA7eF018FB178300FA24C4Efc](https://arbiscan.io/address/0x46ed13B4EdDa147fA7eF018FB178300FA24C4Efc)            |
| FACTORY      | arbmain (42161)   | [0xFc42221594c07F2EFCEDfb11f4763FCa03248B5A](https://arbiscan.io/address/0xFc42221594c07F2EFCEDfb11f4763FCa03248B5A)            |

Avalanche:

| Contract     | Network (ID)      | Address                                                                                                                       |
| ------------ | ----------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| ROUTER       | avaxmain (43114)  | [0x46ed13B4EdDa147fA7eF018FB178300FA24C4Efc](https://snowtrace.io/address/0x46ed13B4EdDa147fA7eF018FB178300FA24C4Efc)         |
| FACTORY      | avaxmain (43114)  | [0xFc42221594c07F2EFCEDfb11f4763FCa03248B5A](https://snowtrace.io/address/0xFc42221594c07F2EFCEDfb11f4763FCa03248B5A)         |
| ROUTER       | avaxtest (43113)  | [0x151522484121f4e28eA24c8b5d827132775a93FE](https://testnet.snowtrace.io/address/0x151522484121f4e28eA24c8b5d827132775a93FE) |
| FACTORY      | avaxtest (43113)  | [0x16eD649675e6Ed9F1480091123409B4b8D228dC1](https://testnet.snowtrace.io/address/0x16eD649675e6Ed9F1480091123409B4b8D228dC1) |

| Subgraph                        | Target | Network (ID)      | Endpoint                                                                                                                                 |
| ------------------------------- | ------ | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| [ALL](/subgraph/schema.graphql) | Studio | avaxmain (43114)  | [`QmUx9N8xcXmWkaxSrXN7Kf4EDVuWuPM3ZQx9HDfFR2d8xv`](https://api.thegraph.com/subgraphs/id/QmUx9N8xcXmWkaxSrXN7Kf4EDVuWuPM3ZQx9HDfFR2d8xv) |
| [ALL](/subgraph/schema.graphql) | Studio | avaxtest (43113)  | [`QmPvxBrugKkus8syHyNrjSD9zY7qG82SFFe2wWLcA5HZAg`](https://api.thegraph.com/subgraphs/id/QmPvxBrugKkus8syHyNrjSD9zY7qG82SFFe2wWLcA5HZAg) |

Base:

| Contract     | Network (ID)      | Address                                                                                                                       |
| ------------ | ----------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| ROUTER       | basemain (8453)   | [0x1312488a7BF5aAF2B2EeBE8393c9616A1418CF04](https://basescan.org/address/0x1312488a7BF5aAF2B2EeBE8393c9616A1418CF04)         |
| FACTORY      | basemain (8453)   | [0x611103410C8021B51725ab38Cc79C8F0feD715c6](https://basescan.org/address/0x611103410C8021B51725ab38Cc79C8F0feD715c6)         |

| Subgraph                        | Target  | Network (ID)      | Endpoint                                                                                                                                           |
| ------------------------------- | ------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ALL](/subgraph/schema.graphql) | Goldsky | basemain (8453)   | [`snf-base/1.0.0`](https://api.goldsky.com/api/public/project_cmngb5qq6d79v01wba5bi7hdg/subgraphs/snf-base/1.0.0/gn)                             |
| [LEGACY]                        | Goldsky | basemain (8453)   | [`snf-base-old/1.0.0`](https://api.goldsky.com/api/public/project_cmnyu0s049bde01vr754rehxg/subgraphs/snf-base-old/1.0.0/gn) — conta snf-2, clonado do Studio (schema v1) |

BNB Smart Chain:

| Contract     | Network (ID)      | Address                                                                                                                       |
| ------------ | ----------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| ROUTER       | bscmain (56)      | [0x790488868E4b2eDb166778D67142035091eb130A](https://bscscan.com/address/0x790488868E4b2eDb166778D67142035091eb130A)          |
| FACTORY      | bscmain (56)      | [0x1fC0D65ae98F69cD8DCDA4ec0F6155A5F2a7b0ab](https://bscscan.com/address/0x1fC0D65ae98F69cD8DCDA4ec0F6155A5F2a7b0ab)          |

| Subgraph                        | Target | Network (ID)      | Endpoint                                                                                                                                |
| ------------------------------- | ------ | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| [ALL](/subgraph/schema.graphql) | Studio | bscmain (56)      | [`QmNQBgfJRuGUvZXPzRPBGiBTboFpMW7VEXDFFF8BLyNyt1`](https://api.studio.thegraph.com/query/93076/sweep-n-flip-amm/version/latest) |

Linea:

| Contract     | Network (ID)      | Address                                                                                                                       |
| ------------ | ----------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| ROUTER       | lineamain (59144) | [0x46ed13B4EdDa147fA7eF018FB178300FA24C4Efc](https://lineascan.build/address/0x46ed13B4EdDa147fA7eF018FB178300FA24C4Efc)      |
| FACTORY      | lineamain (59144) | [0xFc42221594c07F2EFCEDfb11f4763FCa03248B5A](https://lineascan.build/address/0xFc42221594c07F2EFCEDfb11f4763FCa03248B5A)      |

| Subgraph                        | Target | Network (ID)      | Endpoint                                                                                                                                        |
| ------------------------------- | ------ | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| [ALL](/subgraph/schema.graphql) | Studio | lineamain (59144) | [`QmW1GcAFPsBD8vjjtgbTs5xvtq76oa5XvyTFAFNegBv6cy`](https://graph-query.linea.build/subgraphs/id/QmW1GcAFPsBD8vjjtgbTs5xvtq76oa5XvyTFAFNegBv6cy) |

Blast:

| Contract     | Network (ID)      | Address                                                                                                                    |
| ------------ | ----------------- | -------------------------------------------------------------------------------------------------------------------------- |
| ROUTER       | blastmain (81457) | [0x151522484121f4e28eA24c8b5d827132775a93FE](https://blastscan.io/address/0x151522484121f4e28eA24c8b5d827132775a93FE)      |
| FACTORY      | blastmain (81457) | [0x16eD649675e6Ed9F1480091123409B4b8D228dC1](https://blastscan.io/address/0x16eD649675e6Ed9F1480091123409B4b8D228dC1)      |

| Subgraph                        | Target | Network (ID)      | Endpoint                                                                                                                                 |
| ------------------------------- | ------ | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| [ALL](/subgraph/schema.graphql) | Studio | blastmain (81457) | [`Qmc6eQvp3yFnfLxQdLEYj6mLmGEBaBvMFHYi99xBfBieEx`](https://api.thegraph.com/subgraphs/id/Qmc6eQvp3yFnfLxQdLEYj6mLmGEBaBvMFHYi99xBfBieEx) |

Optimism:

| Contract     | Network (ID) | Address                                                                                                                          |
| ------------ | ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| ROUTER       | optmain (10) | [0xB18e06D9eBC9dBa28D56C112D44c6AC9b343E2Cb](https://optimistic.etherscan.io/address/0xB18e06D9eBC9dBa28D56C112D44c6AC9b343E2Cb) |
| FACTORY      | optmain (10) | [0x7962223D940E1b099AbAe8F54caBFB8a3a0887AB](https://optimistic.etherscan.io/address/0x7962223D940E1b099AbAe8F54caBFB8a3a0887AB) |

| Subgraph                        | Target | Network (ID)      | Endpoint                                                                                                                                 |
| ------------------------------- | ------ | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| [ALL](/subgraph/schema.graphql) | Studio | optmain (10)      | [`QmeNdCFKzNTac7FSFGMxbTvkevZwLanwMcGGeidoWqySCp`](https://api.thegraph.com/subgraphs/id/QmeNdCFKzNTac7FSFGMxbTvkevZwLanwMcGGeidoWqySCp) |

Mode:

| Contract     | Network (ID)     | Address                                                                                                                        |
| ------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| ROUTER       | modemain (34443) | [0xB18e06D9eBC9dBa28D56C112D44c6AC9b343E2Cb](https://explorer.mode.network/address/0xB18e06D9eBC9dBa28D56C112D44c6AC9b343E2Cb) |
| FACTORY      | modemain (34443) | [0x7962223D940E1b099AbAe8F54caBFB8a3a0887AB](https://explorer.mode.network/address/0x7962223D940E1b099AbAe8F54caBFB8a3a0887AB) |

| Subgraph                        | Target | Network (ID)      | Endpoint                                                                                                                                 |
| ------------------------------- | ------ | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| [ALL](/subgraph/schema.graphql) | Studio | modemain (34443)  | [`QmR8XG3qeJeSAau5rLc2CpomhTRCN28MQXxHFnTdNr9LbX`](https://api.thegraph.com/subgraphs/id/QmR8XG3qeJeSAau5rLc2CpomhTRCN28MQXxHFnTdNr9LbX) |

Moombeam:

| Contract     | Network (ID)        | Address                                                                                                              |
| ------------ | ------------------- | -------------------------------------------------------------------------------------------------------------------- |
| ROUTER       | moonbeammain (1284) | [0xB18e06D9eBC9dBa28D56C112D44c6AC9b343E2Cb](https://moonscan.io/address/0xB18e06D9eBC9dBa28D56C112D44c6AC9b343E2Cb) |
| FACTORY      | moonbeammain (1284) | [0x7962223D940E1b099AbAe8F54caBFB8a3a0887AB](https://moonscan.io/address/0x7962223D940E1b099AbAe8F54caBFB8a3a0887AB) |

| Subgraph                        | Target | Network (ID)        | Endpoint                                                                                                                                 |
| ------------------------------- | ------ | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| [ALL](/subgraph/schema.graphql) | Studio | moonbeammain (1284) | [`Qmdcz8JZwkuQcMqG2CJgAE1Y4njKxpfUFzk6CWXmUquHFR`](https://api.thegraph.com/subgraphs/id/Qmdcz8JZwkuQcMqG2CJgAE1Y4njKxpfUFzk6CWXmUquHFR) |

Berachain:

| Contract     | Network (ID)     | Address                                                                                                                      |
| ------------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| ROUTER       | beratest (80084) | [0x2C4F3f0EEB169BaE301151FbFa99B4c82438F4FD](https://bartio.beratrail.io/address/0x2C4F3f0EEB169BaE301151FbFa99B4c82438F4FD) |
| FACTORY      | beratest (80084) | [0x65624436e377c8A4A6918B69927e56982331b590](https://bartio.beratrail.io/address/0x65624436e377c8A4A6918B69927e56982331b590) |

| Subgraph                        | Target | Network (ID)     | Endpoint                                                                                                                                                         |
| ------------------------------- | ------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ALL](/subgraph/schema.graphql) | Studio | beratest (80084) | [`QmViHi5iXpXuLeKNZmz8M8YnxQJ4pvLAME4Ef5pLv9xesK`](https://api.goldsky.com/api/public/project_cm08eswaacp6901wwdaxnfyjq/subgraphs/nftfy-beratest/v1.0.13-uni/gn) |

Strato VM:

| Contract     | Network (ID)     | Address                                                                                                                        |
| ------------ |------------------|--------------------------------------------------------------------------------------------------------------------------------|
| ROUTER       | stratovm (93747) | [0x578F1F1497fFB6E26Cc039D3729b4Db9B8263B94](https://explorer.stratovm.io/address/0x578F1F1497fFB6E26Cc039D3729b4Db9B8263B94)  |
| FACTORY      | stratovm (93747) | [0xb9456FBf1F17b46c69361Cd9d42CAe12138225FA](https://explorer.stratovm.io/address/0xb9456FBf1F17b46c69361Cd9d42CAe12138225FA)  |

| Subsquid                        | Target | Network (ID)     | Endpoint                                                                                                                        |
|---------------------------------| ------ | ---------------- |---------------------------------------------------------------------------------------------------------------------------------|
| [ALL](/subsquid/schema.graphql) | Studio | stratovm (93747) | [`sweepnflip-amm-subsquid@v1`](https://736998a3-c1a8-4216-ab1f-90b065e35097.squids.live/sweepnflip-amm-subsquid@v1/api/graphql) |

Bitfinity:

| Contract     | Network (ID)         | Address                                                                                                                                     |
| ------------ |----------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| ROUTER       | bitfinity (355113)   | [0x578F1F1497fFB6E26Cc039D3729b4Db9B8263B94](https://explorer.testnet.bitfinity.network/address/0x578F1F1497fFB6E26Cc039D3729b4Db9B8263B94) |
| FACTORY      | bitfinity (355113)   | [0xb9456FBf1F17b46c69361Cd9d42CAe12138225FA](https://explorer.testnet.bitfinity.network/address/0xb9456FBf1F17b46c69361Cd9d42CAe12138225FA) |

| Subsquid                        | Target | Network (ID)        | Endpoint                                                                                                                     |
|---------------------------------| ------ |---------------------|------------------------------------------------------------------------------------------------------------------------------|
| [ALL](/subsquid/schema.graphql) | Studio | bitfinity (355113)  | [`sweepnflip-amm-subsquid@v1`](https://242ed9ab-9df0-4458-98fd-529803ec78a5.squids.live/sweepnflip-amm-squid@v1/api/graphql) |

Apechain:

| Contract     | Network (ID)     | Address                                                                                                                                     |
| ------------ |------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| ROUTER       | apechain (33139) | [0x4C91AE2260c713EE61b7094141E9494fA7947Cfe](https://apescan.io/address/0x4C91AE2260c713EE61b7094141E9494fA7947Cfe) |
| FACTORY      | apechain (33139) | [0x58ac416c2A8A217f3aF4acb1F5490efd2bE4652a](https://apescan.io/address/0x58ac416c2a8a217f3af4acb1f5490efd2be4652a) |

| Subgraph                        | Target | Network (ID)     | Endpoint                                                                                                                             |
|---------------------------------| ------ |------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| [ALL](/subgraph/schema.graphql) | Studio | apechain (33139) | [`snf-amm-apechain@1.0.0`](https://api.goldsky.com/api/public/project_cm6owlz0w193201ur7900d42s/subgraphs/snf-amm-apechain/1.0.0/gn) |

Hyperliquid:

| Contract     | Network (ID)       | Address                                                                                                                           |
| ------------ |--------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| ROUTER       | hyperliquid (999)  | [0x1c865C75ab96aEbe4F3beEb4388036047240096b](https://hyperevmscan.io/address/0x1c865C75ab96aEbe4F3beEb4388036047240096b) |
| FACTORY      | hyperliquid (999)  | [0xa575959Ab114BF3a84A9B7D92838aC3b77324E65](https://hyperevmscan.io/address/0xa575959Ab114BF3a84A9B7D92838aC3b77324E65) |

| Subgraph                        | Target | Network (ID)       | Endpoint                                                                                                                         |
|---------------------------------| ------ |--------------------|----------------------------------------------------------------------------------------------------------------------------------|
| [ALL](/subgraph/schema.graphql) | TBD    | hyperliquid (999)  | [`QmSJdPe6TfVy9wVh6D3pct5bbS9aJPzvKXrwYYsueSPFrY`] (https://api.goldsky.com/api/public/project_cmejhyc7rqen501wed6sxgbn3/subgraphs/snf-hyperevm/v1.0.13-uni/gn) |
