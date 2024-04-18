import { ImCross } from "react-icons/im"
import { FiAward } from "react-icons/fi"
import { FaHandshake } from "react-icons/fa"
import { ImHome } from "react-icons/im"
import { HiIdentification } from "react-icons/hi"
import NavItem from "./NavItem"
import DrawerLayout from "../DrawerLayout"
// import WalletConnect from './WalletConnect'
import { ConnectButton } from "@rainbow-me/rainbowkit"
import Image from 'next/image'

const Nav = ({ setIsOpen, isOpen }) => {
    return (
        <DrawerLayout setIsOpen={setIsOpen} isOpen={isOpen}>
            <div className="absolute z-50 flex flex-col justify-center lg:inset-y-0  -right-0 lg:right-0 w-64 h-screen lg:mt-3 lg:mr-3 lg:h-[96%] bg-RedSuprimeDark shadow-2xl md:rounded-xl md:overflow-hidden">
                <div
                    onClick={(e) => setIsOpen(false)}
                    className="flex text-white absolute top-0 w-full items-center justify-start pl-6 text-sm h-10 bg-RedSuprimeDark"
                >
                    <ImCross />
                </div>
                <div className="flex flex-col gap-y-2 px-6 w-full transition">
                    <NavItem
                        setIsOpen={setIsOpen}
                        NavRoute={"/"}
                        NavIcon={<ImHome />}
                        NavText={"Home"}
                    />
                    <NavItem
                        setIsOpen={setIsOpen}
                        NavRoute={"/vault"}
                        NavIcon={<FiAward />}
                        NavText={"Vault"}
                    />
                    <NavItem
                        setIsOpen={setIsOpen}
                        NavRoute={"/community"}
                        NavIcon={<HiIdentification />}
                        NavText={"Community"}
                    />
                    <NavItem
                        setIsOpen={setIsOpen}
                        NavRoute={"/contact"}
                        NavIcon={<FaHandshake />}
                        NavText={"Collaboration"}
                    />
                </div>
                <div className="flex flex-col gap-y-2 px-6 w-full justify-center transition mt-20 absolute bottom-8">
                    <ConnectButton
                    showBalance={{
                        smallScreen: false,
                        largeScreen: true,
                    }}
                    chainStatus={{
                        smallScreen: 'icon',
                        largeScreen: 'full',
                    }}
                    accountStatus={{
                        smallScreen: 'full',
                        largeScreen: 'full',
                    }}
                    />
                    {/* <ConnectButton.Custom>
                        {({
                            account,
                            chain,
                            openAccountModal,
                            openChainModal,
                            openConnectModal,
                            authenticationStatus,
                            mounted,
                        }) => {
                            // Note: If your app doesn't use authentication, you
                            // can remove all 'authenticationStatus' checks
                            const ready = mounted && authenticationStatus !== "loading"
                            const connected =
                                ready &&
                                account &&
                                chain &&
                                (!authenticationStatus || authenticationStatus === "authenticated")

                            return (
                                <div
                                    {...(!ready && {
                                        "aria-hidden": true,
                                        style: {
                                            opacity: 0,
                                            pointerEvents: "none",
                                            userSelect: "none",
                                        },
                                    })}
                                >
                                    {(() => {
                                        if (!connected) {
                                            return (
                                                <button onClick={openConnectModal} type="button">
                                                    Connect Wallet
                                                </button>
                                            )
                                        }

                                        if (chain.unsupported) {
                                            return (
                                                <button onClick={openChainModal} type="button">
                                                    Wrong network
                                                </button>
                                            )
                                        }

                                        return (
                                            <div style={{ display: "flex", gap: 12 }}>
                                                <button
                                                    onClick={openChainModal}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                    }}
                                                    type="button"
                                                >
                                                    {chain.hasIcon && (
                                                        <div
                                                            style={{
                                                                background: chain.iconBackground,
                                                                width: 24,
                                                                height: 24,
                                                                borderRadius: 999,
                                                                overflow: "hidden",
                                                                marginRight: 4,
                                                            }}
                                                        >
                                                            {chain.iconUrl && (
                                                                <Image
                                                                    alt={
                                                                        chain.name ?? "Chain icon"
                                                                    }
                                                                    src={chain.iconUrl}
                                                                    style={{
                                                                        width: 24,
                                                                        height: 24,
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                    )}
                                                    {chain.name}
                                                </button>

                                                <button onClick={openAccountModal} type="button">
                                                    {account.displayName}
                                                    {account.displayBalance
                                                        ? ` (${account.displayBalance})`
                                                        : ""}
                                                </button>
                                            </div>
                                        )
                                    })()}
                                </div>
                            )
                        }}
                    </ConnectButton.Custom> */}
                </div>
            </div>
        </DrawerLayout>
    )
}

export default Nav
