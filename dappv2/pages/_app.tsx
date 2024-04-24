import "../styles/globals.css"
import "@rainbow-me/rainbowkit/styles.css"
import Layout from "./layout"
import { useEffect } from "react"
import { useRouter } from "next/router"
import {
    RainbowKitSiweNextAuthProvider,
    GetSiweMessageOptions,
} from "@rainbow-me/rainbowkit-siwe-next-auth"
import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth"
import { AppProps } from "next/app"
import { RainbowKitProvider, Locale, darkTheme, lightTheme, midnightTheme} from "@rainbow-me/rainbowkit"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { config } from "../utils/config"

const queryClient = new QueryClient()
export default function App({ Component, pageProps }) {
    const { locale } = useRouter() as { locale: Locale }
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    locale={locale}
                    theme={lightTheme(
                        {
                            accentColor: "#436cff",
                            accentColorForeground: "white",
                            borderRadius: "large",
                            fontStack: "system",
                            overlayBlur: "small",
                        }
                    )}
                >
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}
