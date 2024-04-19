import "../styles/globals.css"
import Layout from "./layout"
import "@rainbow-me/rainbowkit/styles.css"
import { useRouter } from "next/router"
import {
    RainbowKitProvider,
    Locale,
    darkTheme,
} from "@rainbow-me/rainbowkit"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { config } from "../utils/config"

const queryClient = new QueryClient()
export default function App({ Component, pageProps }) {
    const { locale } = useRouter() as { locale: Locale };
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                locale={locale}
                theme={darkTheme({
                    accentColor: '#fff',
                    accentColorForeground: '#3c3c3c',
                    borderRadius: 'large',
                    fontStack: 'system',
                    overlayBlur: 'small',
                })}
                >
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}
