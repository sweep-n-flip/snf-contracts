// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.9;

//address constant DELEGATE_FACTORY = 0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac; // SushiSwap (Ethereum mainnet)
//address constant DELEGATE_FACTORY = 0x71524B4f93c58fcbF659783284E38825f0622859; // SushiSwap (Base mainnet)
//address constant DELEGATE_FACTORY = 0xc35DADB65012eC5796536bD9864eD8773aBc74C4; // SushiSwap (most but Ethereum/Base mainnet)
//address constant DELEGATE_FACTORY = 0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E; // PancakeSwap (Linea mainnet)
//address constant DELEGATE_FACTORY = 0xd03D8D566183F0086d8D09A84E1e30b58Dd5619d; // PancakeSwap (zkSync mainnet)
//address constant DELEGATE_FACTORY = 0x9CC1599D4378Ea41d444642D18AA9Be44f709ffD; // Blasterswap (Blast mainnet)
//address constant DELEGATE_FACTORY = 0x25CbdDb98b35ab1FF77413456B31EC81A6B6B746; // Velodrome (Optimism mainnet)
//address constant DELEGATE_FACTORY = 0xfb926356BAf861c93C3557D7327Dbe8734A71891; // ModeSwap (Mode mainnet)
//address constant DELEGATE_FACTORY = 0x68A384D826D3678f78BB9FB1533c7E9577dACc0E; // StellaSwap (Moombeam mainnet)
//address constant DELEGATE_FACTORY = 0xb08Bfed214ba87d5d5D07B7DA573010016C44488; // Kodiak (Berachain testnet)
//address constant DELEGATE_FACTORY = 0xE578184bC88EB48485Bba23a37B5509578d2aE38; // IceSwap (StratoVM testnet)
//address constant DELEGATE_FACTORY = 0x9945f4a1eC4C4FC74a70276CCf60b8b1B2DE1F4A; // - (Bitfinity testnet)
//address constant DELEGATE_FACTORY = 0x7d8c6B58BA2d40FC6E34C25f9A488067Fe0D2dB4; // Camelot (Apechain)
//address constant DELEGATE_FACTORY = 0x724412C00059bf7d6ee7d4a1d0D5cd4de3ea1C48; // HyperSwap (Hyperliquid mainnet)
address constant DELEGATE_FACTORY = 0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6; // Uniswap V2 (Base mainnet)

//bytes constant DELEGATE_INIT_CODE_HASH = hex"e18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303"; // SushiSwap (all)
//bytes constant DELEGATE_INIT_CODE_HASH = hex"57224589c67f3f30a6b0d7a1b54cf3153ab84563bc609ef41dfb34f8b2974d2d"; // PancakeSwap (Linea mainnet)
//bytes constant DELEGATE_INIT_CODE_HASH = hex"0100045707a42494392b3558029b9869f865ff9df8f375dc1bf20b0555093f43"; // PancakeSwap (zkSync mainnet)
//bytes constant DELEGATE_INIT_CODE_HASH = hex"9895581041f0c2ea658b6c2e615187fa4eaa05e55ab576ce8164a1090d8e6575"; // Blasterswap (Blast mainnet)
//bytes constant DELEGATE_INIT_CODE_HASH = hex"c1ac28b1c4ebe53c0cff67bab5878c4eb68759bb1e9f73977cd266b247d149f0"; // Velodrome (Optimism mainnet)
//bytes constant DELEGATE_INIT_CODE_HASH = hex"337ec3ca78ed47c450332dd308033d9900832b31b7539f3befcbc556bff3a4a8"; // ModeSwap (Mode mainnet)
//bytes constant DELEGATE_INIT_CODE_HASH = hex"48a6ca3d52d0d0a6c53a83cc3c8688dd46ea4cb786b169ee959b95ad30f61643"; // StellaSwap (Moombeam mainnet)
//bytes constant DELEGATE_INIT_CODE_HASH = hex"0489c85ed300c1a9636d09ada5e1bea0e331f778464d45f24cb365c92cafbcb5"; // Kodiak (Berachain testnet)
//bytes constant DELEGATE_INIT_CODE_HASH = hex"0437378fc27e93c612c5c385779bf540ca2064b54705e48c313aa216da380100"; // IceSwap (StratoVM testnet)
//bytes constant DELEGATE_INIT_CODE_HASH = hex"5ae65da6662188c2e508cb6bcb59f05483a527fc27e586ef49c48f3ef9443469"; // - (Bitfinity testnet)
//bytes constant DELEGATE_INIT_CODE_HASH = ""; // Camelot (Apechain)
//bytes constant DELEGATE_INIT_CODE_HASH = hex"c83d9df19c8c8a0a1229bd3122cbb86fd8ff56f79cc6781c15999d39425466e9"; // HyperSwap (Hyperliquid mainnet)
bytes constant DELEGATE_INIT_CODE_HASH = hex"96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f"; // Uniswap V2 (Base mainnet)

//uint256 constant DELEGATE_NET_FEE = 9970; // SushiSwap
//uint256 constant DELEGATE_NET_FEE = 9975; // PancakeSwap
//uint256 constant DELEGATE_NET_FEE = 9970; // Blasterswap
//uint256 constant DELEGATE_NET_FEE = 9998; // Velodrome
//uint256 constant DELEGATE_NET_FEE = 9997; // ModeSwap
//uint256 constant DELEGATE_NET_FEE = 9975; // StellaSwap
//uint256 constant DELEGATE_NET_FEE = 9970; // Kodiak
//uint256 constant DELEGATE_NET_FEE = 9970; // IceSwap
//uint256 constant DELEGATE_NET_FEE = 9970; // HyperSwap (assumed 0.3% fee like Uniswap V2)
uint256 constant DELEGATE_NET_FEE = 9970; // Uniswap V2 (0.3% fee)

bool constant DELEGATE_CREATE2_ZKSYNC = false;
//bool constant DELEGATE_CREATE2_ZKSYNC = true;

bool constant DELEGATE_VELODROME = false;
//bool constant DELEGATE_VELODROME = true;
