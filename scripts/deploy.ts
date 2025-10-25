import fs from 'fs';
import { EOL } from 'os';
import { deployContract, getContractAt, initialize } from './library';

function _throw(message: string): never { throw new Error(message); }

const NETWORK_CONFIG: { [chainId: number]: [string, string, string] } = {
  // mainnets
  1: ['0xc718E5a5b06ce7FEd722B128C0C0Eb9c5c902D92', '0x3112eb8e651611Fdb8C9a5b9f80222b090e36601', '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F'], // ethereum
  43114: ['0x4748d173d1A8becFB9afC0aB2262EcDDf6822294', '0x3112eb8e651611Fdb8C9a5b9f80222b090e36601', '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'], // avalanche
  8453: ['0xc00d62Ce5C1543D939EEbb9d6dB213EF873300E3', '0x3112eb8e651611Fdb8C9a5b9f80222b090e36601', '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24'], // base - Uniswap V2 Router
  56: ['0x4e9cA8ca6A113FC3Db72677aa04C8DE028618377', '0x3112eb8e651611Fdb8C9a5b9f80222b090e36601', '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'], // bnb smart chain
  250: ['0x8CBA65A8780e9887a51E77258b701db1e7aBAC05', '0x3112eb8e651611Fdb8C9a5b9f80222b090e36601', '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'], // fantom
  59144: ['0xE1E35972f34F00196B52D5c4C0D80c2b7bC7Ad36', '0x3112eb8e651611Fdb8C9a5b9f80222b090e36601', '0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb'], // linea
  137: ['0xB41bbAEAd46042a229C6870207eB072aBb4FC18a', '0x3112eb8e651611Fdb8C9a5b9f80222b090e36601', '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'], // polygon
  324: ['0x7902C49D54649D6cE98513423f9c65857f7813f4', '0x3112eb8e651611Fdb8C9a5b9f80222b090e36601', '0x5aEaF2883FBf30f3D62471154eDa3C0c1b05942d'], // zksync era
  42161: ['0x2703CD5357fa184bAAD92b834127362bf95b0858', '0x3112eb8e651611Fdb8C9a5b9f80222b090e36601', '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'], // arbitrum one
  81457: ['0xD76b9AF3620B1cE397A915948f42a24356Ea7b95', '0x3112eb8e651611Fdb8C9a5b9f80222b090e36601', '0xc972FaE6b524E8A6e0af21875675bF58a3133e60'], // blast
  10: ['0x6EA629Db85e9F7aeC219BB625C585DA0dB84fc1D', '0x3112eb8e651611Fdb8C9a5b9f80222b090e36601', '0x9c12939390052919aF3155f41Bf4160Fd3666A6f'], // optimism
  34443: ['0x5E9624a458A659885a1d6f7378880e1F920992FB', '0x3112eb8e651611Fdb8C9a5b9f80222b090e36601', '0xc1e624C810D297FD70eF53B0E08F44FABE468591'], // mode
  1284: ['0x5E9624a458A659885a1d6f7378880e1F920992FB', '0x3112eb8e651611Fdb8C9a5b9f80222b090e36601', '0x70085a09D30D6f8C4ecF6eE10120d1847383BB57'], // moombeam
  999: ['0xF3d1Fb6F6B2702C937e6568f918c758F3efd573d', '0x1b294Cc80c8B4B6e4Af7Dd61589f6a9d7138DCD3', '0xb4a9C4e6Ea8E2191d2FA5B380452a634Fb21240A'], // hyperliquid
  // testnets
  3: ['0x3112eb8e651611Fdb8C9a5b9f80222b090e36601', '0xFDf35F1Bfe270e636f535a45Ce8D02457676e050', '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'], // ropsten
  4: ['0x3112eb8e651611Fdb8C9a5b9f80222b090e36601', '0xFDf35F1Bfe270e636f535a45Ce8D02457676e050', '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'], // rinkeby
  42: ['0x3112eb8e651611Fdb8C9a5b9f80222b090e36601', '0xFDf35F1Bfe270e636f535a45Ce8D02457676e050', '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'], // kovan
  5: ['0x3112eb8e651611Fdb8C9a5b9f80222b090e36601', '0xFDf35F1Bfe270e636f535a45Ce8D02457676e050', '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'], // goerli
  43113: ['0x3112eb8e651611Fdb8C9a5b9f80222b090e36601', '0xFDf35F1Bfe270e636f535a45Ce8D02457676e050', '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'], // fuji
  84531: ['0x3112eb8e651611Fdb8C9a5b9f80222b090e36601', '0xFDf35F1Bfe270e636f535a45Ce8D02457676e050', '0x0000000000000000000000000000000000000000'], // base goerli
  97: ['0x3112eb8e651611Fdb8C9a5b9f80222b090e36601', '0xFDf35F1Bfe270e636f535a45Ce8D02457676e050', '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'], // chapel
  4002: ['0x3112eb8e651611Fdb8C9a5b9f80222b090e36601', '0xFDf35F1Bfe270e636f535a45Ce8D02457676e050', '0x0000000000000000000000000000000000000000'], // fantom testnet
  59140: ['0x3112eb8e651611Fdb8C9a5b9f80222b090e36601', '0xFDf35F1Bfe270e636f535a45Ce8D02457676e050', '0x0000000000000000000000000000000000000000'], // linea goerli
  80001: ['0x3112eb8e651611Fdb8C9a5b9f80222b090e36601', '0xFDf35F1Bfe270e636f535a45Ce8D02457676e050', '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'], // mumbai
  280: ['0x3112eb8e651611Fdb8C9a5b9f80222b090e36601', '0xFDf35F1Bfe270e636f535a45Ce8D02457676e050', '0x0000000000000000000000000000000000000000'], // zksync goerli
  80084: ['0x3112eb8e651611Fdb8C9a5b9f80222b090e36601', '0xFDf35F1Bfe270e636f535a45Ce8D02457676e050', '0x406846114B2A9b65a8A2Ab702C2C57d27784dBA2'], // berachain bartio
  93747: ['0x3112eb8e651611Fdb8C9a5b9f80222b090e36601', '0xFDf35F1Bfe270e636f535a45Ce8D02457676e050', '0xf8ac4BEB2F75d2cFFb588c63251347fdD629B92c'], // stratovm testnet
  355113: ['0x3112eb8e651611Fdb8C9a5b9f80222b090e36601', '0xFDf35F1Bfe270e636f535a45Ce8D02457676e050', '0xD82d333a2BeB122842094459652107F9154E7745'], // bitfinity testnet
  33139: ['0xa12916d8CaC62dA6FdC06807514194a778810b0e', '0xa12916d8CaC62dA6FdC06807514194a778810b0e', '0x18E621B64d7808c3C47bccbbD7485d23F257D26f'], // apechain
  998: ['0xF3d1Fb6F6B2702C937e6568f918c758F3efd573d', '0x1b294Cc80c8B4B6e4Af7Dd61589f6a9d7138DCD3', '0x0000000000000000000000000000000000000000'], // hyperliquid testnet - usar zero address
};

async function main(args: string[]): Promise<void> {

  const { chainId, FROM, signer } = await initialize();
  console.log('chainId ' + chainId);
  console.log('FROM=' + FROM);

  const [ADMIN, FUNDING, DELEGATE_ROUTER] = NETWORK_CONFIG[chainId] || _throw('Unknown chainId: ' + chainId);
  console.log('ADMIN=' + ADMIN);
  console.log('FUNDING=' + FUNDING);
  console.log('DELEGATE_ROUTER=' + DELEGATE_ROUTER);

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
    // sanity check
    const filename = __dirname + '/../contracts/core/Delegation.sol';
    const contents = fs.readFileSync(filename).toString().split(EOL).filter((line) => !line.match(/^\s*\/\//)).join(EOL);
    if (!contents.includes(DELEGATE_FACTORY)) throw new Error('Invalid delegation');
  }

  if (delegateInitCodeHash !== '') {
    // sanity check
    const filename = __dirname + '/../contracts/core/Delegation.sol';
    const contents = fs.readFileSync(filename).toString().split(EOL).filter((line) => !line.match(/^\s*\/\//)).join(EOL);
    if (!contents.includes(delegateInitCodeHash.substring(2))) throw new Error('Invalid delegateInitCodeHash');
  }

  const ONE_PERCENT = 10n**16n;
  const HALF_PERCENT = ONE_PERCENT / 2n;

  const BLOCKIES = '0x46bEF163D6C470a4774f9585F3500Ae3b642e751';
  console.log('BLOCKIES=' + BLOCKIES);

  const FACTORY = await deployContract('UniswapV2Factory', ADMIN, FROM);
  console.log('FACTORY=' + FACTORY);

  const ROUTER = await deployContract('UniswapV2Router01Collection', FACTORY, WETH, ADMIN, ADMIN, 2n * ONE_PERCENT + HALF_PERCENT);
  console.log('ROUTER=' + ROUTER);

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

    const WRAPPER = await factory.callStatic.createWrapper(BLOCKIES);
    console.log('WRAPPER=' + WRAPPER);
    {
      console.log('Creating wrapper...');
      const tx = await factory.createWrapper(BLOCKIES);
      await tx.wait();
    }

    const PAIR = await factory.callStatic.createPair(WETH, WRAPPER);
    console.log('PAIR=' + PAIR);
    {
      console.log('Creating pair...');
      const tx = await factory.createPair(WETH, WRAPPER);
      await tx.wait();
    }

    {
      // sanity check
      const filename = __dirname + '/../contracts/periphery/libraries/UniswapV2Library.sol';
      const contents = fs.readFileSync(filename).toString().split(EOL).filter((line) => !line.match(/^\s*\/\//)).join(EOL);
      if (!contents.includes(initCodeHash.substring(2))) throw new Error('Invalid initCodeHash');
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
