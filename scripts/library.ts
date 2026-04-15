import hardhat from 'hardhat';
import { ethers } from 'ethers';
import { Provider, Wallet } from 'zksync-web3';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';

let provider: Provider;
let wallet: Wallet;
let deployer: Deployer;

export async function initialize(): Promise<{ chainId: number, FROM: string, signer: ethers.Signer }> {
  if (hardhat.network.config.zksync) {
    const config = hardhat.network.config;
    const _config = config as any;
    const url = _config.url !== undefined ? _config.url : _config.forking.url;
    if (typeof url !== 'string') throw new Error('panic');
    provider = new Provider(url);
    const { chainId } = await provider.getNetwork();
    const accounts = config.accounts;
    if (!Array.isArray(accounts)) throw new Error('panic');
    if (accounts.length !== 1) throw new Error('panic');
    const privateKey =  typeof accounts[0] === 'string' ? accounts[0] : accounts[0].privateKey;
    if (typeof privateKey !== 'string') throw new Error('panic');
    wallet = new Wallet(privateKey, provider);
    const FROM = wallet.address;
    const signer = wallet.connect(provider);
    deployer = new Deployer(hardhat, wallet);
    return { chainId, FROM, signer };
  }
  const { chainId } = await hardhat.ethers.provider.getNetwork();
  const signers = await hardhat.ethers.getSigners();
  if (signers.length !== 1) throw new Error('panic');
  const [signer] = signers;
  if (signer === undefined) throw new Error('panic');
  const FROM = await signer.getAddress();
  return { chainId, FROM, signer };
}

export async function getGasPrice(): Promise<bigint> {
  if (hardhat.network.config.zksync) {
    return BigInt(String(await provider.getGasPrice()));
  }
  return BigInt(String(await hardhat.ethers.provider.getGasPrice()));
}

export async function getBalance(address: string): Promise<bigint> {
  if (hardhat.network.config.zksync) {
    return BigInt(String(await provider.getBalance(address)));
  }
  return BigInt(String(await hardhat.ethers.provider.getBalance(address)));
}

export async function getContractAt(name: string, address: string): Promise<ethers.Contract> {
  if (hardhat.network.config.zksync) {
    const artifact = await hardhat.artifacts.readArtifact(name);
    const contract = new ethers.Contract(address, artifact.abi, wallet);
    return contract;
  }
  return await hardhat.ethers.getContractAt(name, address);
}

export async function deployContract(name: string, ...args: unknown[]): Promise<string> {
  if (hardhat.network.config.zksync) {
    const artifact = await deployer.loadArtifact(name);
    const contract = await deployer.deploy(artifact, args);
    return contract.address;
  }
  const factory = await hardhat.ethers.getContractFactory(name);
  try {
    const contract = await factory.deploy(...args);
    await contract.deployed();
    return contract.address;
  } catch (e: any) {
    // Workaround: ethers v5 Formatter chokes on `to: null` for contract-creation tx
    // responses from some RPCs (e.g. Alchemy). Recover via the receipt, which already
    // contains `contractAddress`. Use waitForTransaction to handle propagation delay.
    const txHash: string | undefined = e?.transactionHash;
    if (e?.code === 'INVALID_ARGUMENT' && e?.argument === 'address' && txHash) {
      console.log('(ethers formatter bug on tx ' + txHash + ' — recovering via receipt...)');
      const receipt = await hardhat.ethers.provider.waitForTransaction(txHash, 1, 120_000);
      if (receipt?.contractAddress) {
        console.log('(recovered, contract at ' + receipt.contractAddress + ')');
        return receipt.contractAddress;
      }
    }
    throw e;
  }
}

export async function verifyContract(address: string, contract: string, ...constructorArguments: unknown[]): Promise<boolean> {
  if (hardhat.network.config.zksync) {
    const [,name] = contract.split(':');
    const artifact = await deployer.loadArtifact(name);
    const bytecode = artifact.bytecode;
    try {
      await hardhat.run('verify:verify', { address, contract, constructorArguments, bytecode });
    } catch (e) {
      if (String(e).toLowerCase().indexOf('already verified') >= 0) return false;
      throw e;
    }
    return true;
  }
  try {
    await hardhat.run('verify:verify', { address, contract, constructorArguments });
  } catch (e) {
    if (String(e).toLowerCase().indexOf('already verified') >= 0) return false;
    throw e;
  }
  return true;
}
