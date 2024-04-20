import { http, fallback, cookieStorage, createStorage } from "wagmi"
import { sepolia } from "wagmi/chains"
import { getDefaultConfig, getDefaultWallets } from "@rainbow-me/rainbowkit"
import {
    metaMaskWallet,
    ledgerWallet,
    zerionWallet,
    rainbowWallet,
    bitgetWallet,
    coinbaseWallet,
    walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets"

// const { wallets } = getDefaultWallets();
// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID
export const config = getDefaultConfig({
    appName: "Flappyowl Vault",
    projectId: projectId,
    wallets: [
        // ...wallets,
        {
            groupName: "Other",
            wallets: [
                metaMaskWallet,
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
    // transports: {
    //     [sepolia.id]: fallback([
    //         http(`https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`),
    //         http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`),
    //     ]),
    // },
    transports: {
        [sepolia.id]: http(),
    },
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
})
