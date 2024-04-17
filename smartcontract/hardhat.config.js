require("dotenv").config();
// require("@nomiclabs/hardhat-etherscan");
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-verify");
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

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY;
const CMC_API_KEY = process.env.CMC_API_KEY;
const ACCOUNT = process.env.PRIVATE_KEY;

module.exports = {
  solidity: {
    // compilers: [
    //   { version: "0.5.0" },
    //   { version: "0.6.0" },
    //   { version: "0.7.0" },
    //   { version: "0.8.0" },
    //   { version: "0.8.7" },
    //   { version: "0.6.6" },
    //   { version: "0.8.4" },
    //   { version: "0.8.8" },
    //   { version: "0.8.13" },
    //   { version: "0.8.14" },
    //   { version: "0.8.17" },
    // ]
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },

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
      url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [ACCOUNT],
      chainId: 5,
      blockConfirmations: 6,
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [ACCOUNT],
      chainId: 11155111,
      blockConfirmations: 6,
    },
    bsctestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      // gasPrice: 20000000000,
      accounts: [ACCOUNT],
    },
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
    // L1: "polygon",
    enabled: true,
    outputFile: "gas-reports.txt",
    noColors: true,
    currency: "USD",
    coin: "ETH",
    coinmarketcap: `${CMC_API_KEY}`,
  },
  etherscan: {
    // apiKey: ETHERSCAN_API_KEY,
    apiKey: {
      mainnet: ETHERSCAN_API_KEY,
      goerli: ETHERSCAN_API_KEY,
      sepolia: ETHERSCAN_API_KEY,
      bsc: BSCSCAN_API_KEY,
    },
    customChains: [
      {
        network: "sepolia",
        chainId: 11155111,
        urls: {
          apiURL: "https://api-sepolia.etherscan.io/api",
          browserURL: "https://sepolia.etherscan.io/"
        }
      }
    ]
  },
  sourcify: {
    // Disabled by default
    // Doesn't need an API key
    enabled: true
  }
};
