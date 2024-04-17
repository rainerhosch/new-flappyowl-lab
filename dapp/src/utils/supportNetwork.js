import { ethers } from "ethers";
function supportNetwork() {
  const Network = {
    // ================================================================================
    //                                Mainnet Data
    // ================================================================================
    ETHEREUM_MAINNET: {
      chainId: ethers.utils.hexlify(1),
      chainName: "Ethereum Mainnet",
      nativeCurrency: { name: "ETHEREUM", symbol: "ETH", decimals: 18 },
      rpcUrls: ["https://mainnet.infura.io/v3/"],
      blockExplorerUrls: ["https://etherscan.io"],
    },
    POLYGON_MAINNET: {
      chainId: ethers.utils.hexlify(137),
      chainName: "Polygon Mainnet",
      nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
      rpcUrls: ["https://polygon-rpc.com"],
      blockExplorerUrls: ["https://www.polygonscan.com/"],
    },
    BSC_MAINNET: {
      chainId: ethers.utils.hexlify(56),
      chainName: "Binance Smart Chain",
      nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
      rpcUrls: ["https://bsc-dataseed.binance.org"],
      blockExplorerUrls: ["https://bscscan.com"],
    },

    // ================================================================================
    //                                Testnet Data
    // ================================================================================
    GOERLI_TESTNET: {
      chainId: ethers.utils.hexlify(5),
      chainName: "Goerli",
      nativeCurrency: { name: "Ethereum", symbol: "GETH", decimals: 18 },
      rpcUrls: ["https://goerli.infura.io/v3/"],
      blockExplorerUrls: ["https://goerli.etherscan.io/"],
    },
    SEPOLIA_TESTNET: {
      chainId: ethers.utils.hexlify(80001),
      chainName: "Sepolia",
      nativeCurrency: { name: "Ethereum", symbol: "SETH", decimals: 18 },
      rpcUrls: ["https://sepolia.infura.io/v3/"],
      blockExplorerUrls: ["https://sepolia.etherscan.io/"],
    },
    BSC_TESTNET: {
      chainId: ethers.utils.hexlify(97),
      chainName: "BNB Smart Chain Testnet",
      nativeCurrency: { name: "tBNB", symbol: "tBNB", decimals: 18 },
      rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
      blockExplorerUrls: ["https://testnet.bscscan.com/"],
    },
  };
  return Network;
}
export { supportNetwork };
