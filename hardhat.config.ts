// Comment these imports for zkSync mainnet/testnet
import "@nomicfoundation/hardhat-verify";
import "@nomiclabs/hardhat-ethers";
import "hardhat-contract-sizer";
// Uncomment these imports for zkSync mainnet/testnet
//import "@matterlabs/hardhat-zksync-deploy";
//import "@matterlabs/hardhat-zksync-node";
//import "@matterlabs/hardhat-zksync-solc";
//import "@matterlabs/hardhat-zksync-verify";

function _throw(message: string): never { throw new Error(message); }

const keystore: { [key: string]: string } = require('./keystore.json');
const etherscan: { [key: string]: string } = require('./etherscan.json');

const privateKeyId: string = process.env['PRIVATE_KEY_ID'] || 'default';
const privateKey: string = process.env['PRIVATE_KEY'] || keystore[privateKeyId] || _throw('Unknown privateKeyId: ' + privateKeyId);
const network: string = process.env['NETWORK'] || 'mainnet';
const balance: string = process.env['BALANCE'] || '1000000000000000000000';
const infuraProjectId: string = process.env['INFURA_PROJECT_ID'] || '';

const NETWORK_CONFIG: { [name: string]: [number, string] | [number, string, string, string] } = {
  // mainnets
  'mainnet': [1, 'https://mainnet.infura.io/v3/' + infuraProjectId], // ethereum
  'avaxmain': [43114, 'https://api.avax.network/ext/bc/C/rpc'], // avalanche
  'basemain': [8453, 'https://mainnet.base.org'], // base
  'bscmain': [56, 'https://bsc-dataseed.binance.org'], // bnb smart chain
  'ftmmain': [250, 'https://rpc.ftm.tools'], // fantom
  'lineamain': [59144, 'https://rpc.linea.build'], // linea
  'maticmain': [137, 'https://polygon-rpc.com'], // polygon
  'zksyncmain': [324, 'https://mainnet.era.zksync.io', 'mainnet', 'https://zksync2-mainnet-explorer.zksync.io/contract_verification'], // zksync era
  'arbmain': [42161, 'https://arb1.arbitrum.io/rpc'], // arbitrum one
  'blastmain': [81457, 'https://rpc.blast.io/'], // blast
  'optmain': [10, 'https://mainnet.optimism.io'], // optimism
  'modemain': [34443, 'https://mainnet.mode.network'], // mode
  'moonbeammain': [1284, 'https://rpc.api.moonbeam.network/'], // moonbeam
  'hyperliquid': [999, 'https://rpc.hyperliquid.xyz/evm'], // hyperliquid
  // testnets
  'ropsten': [3, 'https://ropsten.infura.io/v3/' + infuraProjectId], // ropsten
  'rinkeby': [4, 'https://rinkeby.infura.io/v3/' + infuraProjectId], // rinkeby
  'kovan': [42, 'https://kovan.infura.io/v3/' + infuraProjectId], // kovan
  'goerli': [5, 'https://goerli.infura.io/v3/' + infuraProjectId], // goerli
  'avaxtest': [43113, 'https://api.avax-test.network/ext/bc/C/rpc'], // fuji
  'basetest': [84531, 'https://goerli.base.org'], // base goerli
  'bsctest': [97, 'https://data-seed-prebsc-1-s1.binance.org:8545'], // chapel
  'ftmtest': [4002, 'https://rpc.testnet.fantom.network'], // fantom testnet
  'lineatest': [59140, 'https://goerli.lineascan.build'], // linea goerli
  'matictest': [80001, 'https://matic-mumbai.chainstacklabs.com'], // mumbai
  'zksynctest': [280, 'https://testnet.era.zksync.dev', 'goerli', 'https://zksync2-testnet-explorer.zksync.dev/contract_verification'], // zksync goerli
  'beratest': [80084, 'https://bartio.rpc.berachain.com'], // berachain bartio,
  'stratovm': [93747, 'https://rpc.stratovm.io'], // strato vm,
  'bitfinity': [355113, 'https://testnet.bitfinity.network'], // bitfinity,
  'apechain': [33139, 'https://apechain.drpc.org'], //apechain
  'hyperliquidtest': [998, 'https://rpc.hyperliquid-testnet.xyz/evm'], // hyperliquid testnet
};

const networkConfig = NETWORK_CONFIG[network] || _throw('Unknown network: ' + network);
const zksync = networkConfig.length === 4;
const [chainId, url, ethNetwork, verifyURL] = networkConfig;
const randomApiKey = Math.random().toString(10).substring(2)

export default {
  solidity: {
    compilers: [
      {
        version: '0.8.9',
        settings: {
          optimizer: {
            enabled: true,
            runs: 222,
          },
        },
      },
      {
        version: '0.8.20',
        settings: {
          optimizer: {
            enabled: true,
            runs: 222,
          },
        },
      },
    ],
  },
  zksolc: {
    version: '1.3.16',
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    livenet: { url, accounts: [privateKey], zksync, ethNetwork, verifyURL },
    hardhat: { chainId, forking: { url }, accounts: [{ privateKey, balance }] },
  },
  etherscan: {
    apiKey: etherscan['basemain'], // Single Etherscan API key for all chains (V2)
    customChains: [
      {
        network: 'basemain',
        chainId: 8453,
        urls: {
          apiURL: 'https://api.etherscan.io/v2/api',
          browserURL: 'https://basescan.org',
        },
      },
      {
        network: 'basetest',
        chainId: 84531,
        urls: {
          apiURL: 'https://api.etherscan.io/v2/api',
          browserURL: 'https://sepolia.basescan.org',
        },
      },
      {
        network: 'lineamain',
        chainId: 59144,
        urls: {
          apiURL: 'https://api.lineascan.build/api',
          browserURL: 'https://lineascan.build',
        },
      },
      {
        network: 'lineatest',
        chainId: 59140,
        urls: {
          apiURL: 'https://api-testnet.lineascan.build/api',
          browserURL: 'https://goerli.lineascan.build',
        },
      },
      {
        network: 'blastmain',
        chainId: 81457,
        urls: {
          apiURL: 'https://api.blastscan.io/api',
          browserURL: 'https://blastscan.io',
        },
      },
      {
        network: 'modemain',
        chainId: 34443,
        urls: {
          apiURL: 'https://explorer.mode.network/api',
          browserURL: 'https://explorer.mode.network',
        },
      },
      {
        network: 'beratest',
        chainId: 80084,
        urls: {
          apiURL: 'https://api.routescan.io/v2/network/testnet/evm/80084/etherscan',
          browserURL: 'https://bartio.beratrail.io',
        },
      },
      {
        network: 'stratovm',
        chainId: 93747,
        urls: {
          apiURL: 'https://explorer.stratovm.io/api',
          browserURL: 'https://explorer.stratovm.io:443',
        },
      },
      {
        network: 'bitfinity',
        chainId: 355113,
        urls: {
          apiURL: 'https://explorer.testnet.bitfinity.network/api/v2',
          browserURL: 'https://explorer.testnet.bitfinity.network',
        },
      },
      {
        network: 'apechain',
        chainId: 33139,
        urls: {
          apiURL: 'https://api.apescan.io/api',
          browserURL: 'https://apescan.io/',
        },
      },
      {
        network: 'hyperliquid',
        chainId: 999,
        urls: {
          apiURL: 'https://api.etherscan.io/v2/api/api?chainid=999',
          browserURL: 'https://hyperevmscan.io',
        },
      },
      {
        network: 'hyperliquidtest', 
        chainId: 998,
        urls: {
          apiURL: 'https://testnet.hyperevmscan.io/api',
          browserURL: 'https://testnet.hyperevmscan.io',
        },
      },
    ],
  },
};
