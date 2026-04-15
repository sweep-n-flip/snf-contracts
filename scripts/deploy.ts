import fs from 'fs';
import { deployContract, getContractAt, initialize } from './library';
import { loadDeployment, saveDeployment } from './deployments-io';

function _throw(message: string): never { throw new Error(message); }

const NETWORK_CONFIG: { [chainId: number]: [string, string, string] } = {
  // mainnets
  1: ['0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F'], // ethereum
  43114: ['0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'], // avalanche
  8453: ['0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24'], // base - Uniswap V2 Router
  56: ['0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'], // bnb smart chain
  250: ['0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'], // fantom
  59144: ['0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb'], // linea
  137: ['0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'], // polygon
  324: ['0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0x5aEaF2883FBf30f3D62471154eDa3C0c1b05942d'], // zksync era
  42161: ['0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'], // arbitrum one
  81457: ['0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0xc972FaE6b524E8A6e0af21875675bF58a3133e60'], // blast
  10: ['0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0x9c12939390052919aF3155f41Bf4160Fd3666A6f'], // optimism
  34443: ['0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0xc1e624C810D297FD70eF53B0E08F44FABE468591'], // mode
  1284: ['0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0x70085a09D30D6f8C4ecF6eE10120d1847383BB57'], // moombeam
  999: ['0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0x1b294Cc80c8B4B6e4Af7Dd61589f6a9d7138DCD3', '0xb4a9C4e6Ea8E2191d2FA5B380452a634Fb21240A'], // hyperliquid
  // testnets
  3: ['0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0xFDf35F1Bfe270e636f535a45Ce8D02457676e050', '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'], // ropsten
  4: ['0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0xFDf35F1Bfe270e636f535a45Ce8D02457676e050', '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'], // rinkeby
  42: ['0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0xFDf35F1Bfe270e636f535a45Ce8D02457676e050', '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'], // kovan
  5: ['0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0xFDf35F1Bfe270e636f535a45Ce8D02457676e050', '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'], // goerli
  43113: ['0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0xFDf35F1Bfe270e636f535a45Ce8D02457676e050', '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'], // fuji
  84531: ['0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0xFDf35F1Bfe270e636f535a45Ce8D02457676e050', '0x0000000000000000000000000000000000000000'], // base goerli
  97: ['0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0xFDf35F1Bfe270e636f535a45Ce8D02457676e050', '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'], // chapel
  4002: ['0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0xFDf35F1Bfe270e636f535a45Ce8D02457676e050', '0x0000000000000000000000000000000000000000'], // fantom testnet
  59140: ['0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0xFDf35F1Bfe270e636f535a45Ce8D02457676e050', '0x0000000000000000000000000000000000000000'], // linea goerli
  80001: ['0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0xFDf35F1Bfe270e636f535a45Ce8D02457676e050', '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'], // mumbai
  280: ['0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0xFDf35F1Bfe270e636f535a45Ce8D02457676e050', '0x0000000000000000000000000000000000000000'], // zksync goerli
  80084: ['0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0xFDf35F1Bfe270e636f535a45Ce8D02457676e050', '0x406846114B2A9b65a8A2Ab702C2C57d27784dBA2'], // berachain bartio
  93747: ['0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0xFDf35F1Bfe270e636f535a45Ce8D02457676e050', '0xf8ac4BEB2F75d2cFFb588c63251347fdD629B92c'], // stratovm testnet
  355113: ['0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0xFDf35F1Bfe270e636f535a45Ce8D02457676e050', '0xD82d333a2BeB122842094459652107F9154E7745'], // bitfinity testnet
  33139: ['0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0xa12916d8CaC62dA6FdC06807514194a778810b0e', '0x18E621B64d7808c3C47bccbbD7485d23F257D26f'], // apechain
  998: ['0x789688F2a5AF4168A8Ddb90331b35c3130FAE892', '0x1b294Cc80c8B4B6e4Af7Dd61589f6a9d7138DCD3', '0x0000000000000000000000000000000000000000'], // hyperliquid testnet - usar zero address
};

async function main(args: string[]): Promise<void> {

  const { chainId, FROM, signer } = await initialize();
  console.log('chainId ' + chainId);
  console.log('FROM=' + FROM);

  const [ADMIN, FUNDING, DELEGATE_ROUTER] = NETWORK_CONFIG[chainId] || _throw('Unknown chainId: ' + chainId);
  console.log('ADMIN=' + ADMIN);
  console.log('FUNDING=' + FUNDING);
  console.log('DELEGATE_ROUTER=' + DELEGATE_ROUTER);

  // Load persisted deployment record for this chain. Env vars override file values.
  const record = loadDeployment(chainId);
  saveDeployment(chainId, { admin: ADMIN, delegateRouter: DELEGATE_ROUTER });

  const delegateRouter = await getContractAt('IUniswapV2Router01Ext', DELEGATE_ROUTER);

  const DELEGATE_FACTORY = await delegateRouter.factory();
  console.log('DELEGATE_FACTORY=' + DELEGATE_FACTORY);

  const delegateFactory = await getContractAt('IUniswapV2FactoryExt', DELEGATE_FACTORY);
  let delegateInitCodeHash = '';
  if (delegateInitCodeHash === '') try { delegateInitCodeHash = await delegateFactory.pairCodeHash(); } catch {};
  if (delegateInitCodeHash === '') try { delegateInitCodeHash = await delegateFactory.INIT_CODE_PAIR_HASH(); } catch {};
  console.log('delegateInitCodeHash=' + delegateInitCodeHash);

  let WETH = '';
  if (WETH === '') try { WETH = await delegateRouter.WETH(); } catch {};
  if (WETH === '') try { WETH = await delegateRouter.weth(); } catch {};
  console.log('WETH=' + WETH);

  {
    // sanity check (case-insensitive — address checksum differs between ethers and source file)
    const filename = __dirname + '/../contracts/core/Delegation.sol';
    const contents = fs.readFileSync(filename).toString().split(/\r?\n/).filter((line) => !line.match(/^\s*\/\//)).join('\n').toLowerCase();
    if (!contents.includes(DELEGATE_FACTORY.toLowerCase())) throw new Error('Invalid delegation');
  }

  if (delegateInitCodeHash !== '') {
    // sanity check
    const filename = __dirname + '/../contracts/core/Delegation.sol';
    const contents = fs.readFileSync(filename).toString().split(/\r?\n/).filter((line) => !line.match(/^\s*\/\//)).join('\n').toLowerCase();
    if (!contents.includes(delegateInitCodeHash.substring(2).toLowerCase())) throw new Error('Invalid delegateInitCodeHash');
  }

  const ONE_PERCENT = 10n**16n;
  const HALF_PERCENT = ONE_PERCENT / 2n;

  const BLOCKIES = '0x46bEF163D6C470a4774f9585F3500Ae3b642e751';
  console.log('BLOCKIES=' + BLOCKIES);

  const FACTORY = process.env['FACTORY'] || record.factory
    || await deployContract('UniswapV2Factory', ADMIN, FROM);
  console.log('FACTORY=' + FACTORY);
  saveDeployment(chainId, { factory: FACTORY, factoryFrom: FROM, blockies: BLOCKIES });

  const ROUTER = process.env['ROUTER'] || record.router
    || await deployContract('UniswapV2Router01Collection', FACTORY, WETH, ADMIN, ADMIN, 2n * ONE_PERCENT + HALF_PERCENT);
  console.log('ROUTER=' + ROUTER);
  saveDeployment(chainId, { router: ROUTER });

  {
    const factory = await getContractAt('UniswapV2Factory', FACTORY);
    {
      console.log('Setting factory router...');
      const tx = await factory.setRouter(ROUTER, true);
      await tx.wait();
    }
    {
      console.log('Setting factory router setter...');
      const tx = await factory.setRouterSetter(ADMIN);
      await tx.wait();
    }
  }

  {
    const factory = await getContractAt('UniswapV2Factory', FACTORY);
    const initCodeHash = await factory._initCodeHash();
    console.log('initCodeHash=' + initCodeHash);
    saveDeployment(chainId, { initCodeHash });

    const WRAPPER = process.env['WRAPPER'] || record.wrapper
      || await factory.callStatic.createWrapper(BLOCKIES);
    console.log('WRAPPER=' + WRAPPER);
    if (!process.env['WRAPPER'] && !record.wrapper) {
      console.log('Creating wrapper...');
      const tx = await factory.createWrapper(BLOCKIES);
      await tx.wait();
    }
    saveDeployment(chainId, { wrapper: WRAPPER });

    const PAIR = process.env['PAIR'] || record.pair
      || await factory.callStatic.createPair(WETH, WRAPPER);
    console.log('PAIR=' + PAIR);
    if (!process.env['PAIR'] && !record.pair) {
      console.log('Creating pair...');
      const tx = await factory.createPair(WETH, WRAPPER);
      await tx.wait();
    }
    saveDeployment(chainId, { pair: PAIR });

    {
      // sanity check
      const filename = __dirname + '/../contracts/periphery/libraries/UniswapV2Library.sol';
      const contents = fs.readFileSync(filename).toString().split(/\r?\n/).filter((line) => !line.match(/^\s*\/\//)).join('\n').toLowerCase();
      if (!contents.includes(initCodeHash.substring(2).toLowerCase())) throw new Error('Invalid initCodeHash');
    }
  }

  // {
  //   console.log('Transferring change...');
  //   const balance = await getBalance(FROM);
  //   const gasPrice = await getGasPrice();
  //   const gasLimit = 21000n;
  //   const fee = gasPrice * gasLimit;
  //   const value = balance - fee;
  //   const to = FUNDING;
  //   const tx = await signer.sendTransaction({ to, value, gasLimit, gasPrice });
  //   await tx.wait();
  // }

}

main(process.argv)
  .then(() => process.exit(0))
  .catch((e) => process.exit((console.error(e), 1)));
