/* eslint-disable @typescript-eslint/no-var-requires */
import Web3 from 'web3';
const Web3HttpProvider = require('web3-providers-http');
import UTTAbi from '../contracts/UTT.abi.json';

export default class Endorsement {
  static options = {
    timeout: 30000, // ms

    // Useful if requests are large
    clientConfig: {
      maxReceivedFrameSize: 100000000, // bytes - default: 1MiB
      maxReceivedMessageSize: 100000000, // bytes - default: 8MiB
    },

    // Enable auto reconnection
    reconnect: {
      auto: true,
      delay: 5000, // ms
      maxAttempts: 5,
      onTimeout: false,
    },
  };

  static web3;

  static account;

  static async init() {
    if (this.web3) return;
    const provider = new Web3HttpProvider(
      process.env.NODE_URL.trim(),
      this.options,
    );

    this.web3 = new Web3(provider);
    this.account = this.web3.eth.accounts.privateKeyToAccount(
      process.env.PRIVATE_KEY,
    );

    this.web3.eth.accounts.wallet.add(this.account);
    this.web3.eth.defaultAccount = this.web3.eth.accounts.wallet[0].address;
  }

  static async send(address: string, amount: number) {
    this.init();

    const block = await this.web3.eth.getBlock('latest');
    const gas = block.gasLimit - 100000;
    const contract = new this.web3.eth.Contract(
      UTTAbi as any,
      process.env.UTT_CONTRACT_ADDRESS,
    );

    const value = this.web3.utils.toWei(String(amount), 'ether');

    const tx = await contract.methods.endorse(address, value).send({
      from: this.account.address,
      gas,
    });
    return tx;
  }
}
