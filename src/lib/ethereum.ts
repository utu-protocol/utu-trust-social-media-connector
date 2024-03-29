import { ethers, utils, Wallet } from 'ethers';
import { NODE_URL, UTT_CONTRACT_ADDRESS, UTT_PRIVATE_KEY } from 'src/config';
import { BigInteger } from 'big-integer';

import bcrypt from 'bcrypt';
import CONTRACT_ABI from '../contracts/UTT.abi.json';

let provider = null;

export const initProvider = () => {
  provider = new ethers.providers.JsonRpcProvider(NODE_URL);
};

function getWallet() {
  return new Wallet(UTT_PRIVATE_KEY, provider);
}

async function getContract() {
  return new ethers.Contract(UTT_CONTRACT_ADDRESS, CONTRACT_ABI, getWallet());
}

export async function addConnection(
  address: string,
  connectionId: number,
  socialId: number | BigInteger,
) {
  initProvider();
  console.log('add connection to the smart contract');
  const contract = await getContract();
  const saltRounds = Number(10);
  const HashedSocialId = await bcrypt.hash(String(socialId), saltRounds);
  const idHash = await utils.id(HashedSocialId);
  const feeData = await provider.getFeeData();
  const gas = await contract.estimateGas.addConnection(
    address,
    connectionId,
    idHash,
  );
  const gasPrice = feeData.gasPrice;
  console.log('gasPrice', gasPrice);
  console.log('estimated', gas);
  const tx = await contract.addConnection(address, connectionId, idHash, {
    gasPrice,
    // gasLimit: gas,
  });
  console.log(tx);
  return tx;
}
