require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
require("@nomicfoundation/hardhat-chai-matchers");
require("hardhat-gas-reporter");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const RINKEBY_ETHERSCAN_API_KEY = process.env.RINKEBY_ETHERSCAN_API_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY;
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL;
const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL;
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL;
const ACCOUNT = process.env.PRIVATE_KEY;

module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.7" },
      { version: "0.6.6" },
      { version: "0.8.4" },
      { version: "0.8.0" },
      { version: "0.8.8" },
      { version: "0.8.13" },
      { version: "0.8.14" },
      { version: "0.8.17" },
    ],
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    ganache: {
      chainId: 1337,
      url: "http://127.0.0.1:7545",
      accounts: [ACCOUNT],
    },
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [ACCOUNT],
      chainId: 5,
      blockConfirmations: 6,
    },
    bsctestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      // gasPrice: 20000000000,
      accounts: [ACCOUNT],
    },
    // rinkeby: {
    //   url: RINKEBY_RPC_URL,
    //   accounts: [ACCOUNT],
    //   chainId: 4,
    // }
    // mumbai: {
    //   url: MUMBAI_RPC_URL,
    //   accounts: [ACCOUNT],
    //   chainId: 80001,
    // },
    // polygon: {
    //   url: POLYGON_RPC_URL,
    //   accounts: [ACCOUNT],
    //   chainId: 137,
    // }
  },
  paths: {
    artifacts: "./artifacts",
  },
  gasReporter: {
    enabled: true,
    outputFile: "gas-reports.txt",
    noColors: true,
    currency: "USD",
    coin: "ETH",
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
    // apiKey: {
    //   default: ETHERSCAN_API_KEY,
    //   goerli: ETHERSCAN_API_KEY,
    //   rinkeby: RINKEBY_ETHERSCAN_API_KEY,
    //   bsc: BSCSCAN_API_KEY,
    // },
  },
};
