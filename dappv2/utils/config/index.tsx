import { http } from "wagmi"
import { sepolia } from "wagmi/chains"
import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import {
    metaMaskWallet,
    ledgerWallet,
    zerionWallet,
    rainbowWallet,
    bitgetWallet,
    coinbaseWallet,
    walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets"
export const config = getDefaultConfig({
    appName: "Flappyowl Testnet",
    projectId: "YOUR_PROJECT_ID",
    wallets: [
        {
            groupName: "Recommended",
            wallets: [
                // metaMaskWallet,
                coinbaseWallet,
                rainbowWallet,
                // zerionWallet,
                // bitgetWallet,
                // ledgerWallet,
                walletConnectWallet,
            ],
        },
    ],
    chains: [sepolia],
    transports: {
        [sepolia.id]: http(),
    },
    ssr: true,
})
