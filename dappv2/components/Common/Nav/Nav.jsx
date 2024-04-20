import { ImCross} from "react-icons/im"
import { ImBoxAdd } from "react-icons/im"
import { FiBox } from "react-icons/fi"
import { FaHandshake } from "react-icons/fa"
import { ImHome } from "react-icons/im"
import { HiGift } from "react-icons/hi"
import { HiUserGroup } from "react-icons/hi"
import { HiBadgeCheck } from "react-icons/hi"
import NavItem from "./NavItem"
import DrawerLayout from "../DrawerLayout"
// import WalletConnect from './WalletConnect'
import Image from 'next/image'
import { ConnectButton } from "@rainbow-me/rainbowkit"

const Nav = ({ setIsOpen, isOpen }) => {
    return (
        <DrawerLayout setIsOpen={setIsOpen} isOpen={isOpen}>
            <div className="absolute z-50 flex flex-col justify-center lg:inset-y-0  -right-0 lg:right-0 w-64 h-screen lg:mt-3 lg:mr-3 lg:h-[96%] bg-BluePastel shadow-2xl lg:rounded-xl md:overflow-hidden">
                <div
                    onClick={(e) => setIsOpen(false)}
                    className="flex text-white absolute top-0 w-full items-center justify-start pl-6 text-sm h-10 bg-BluePastel"
                >
                    <ImCross />
                </div>
                <div className="flex flex-col gap-y-2 px-6 w-full transition">
                    <nav>
                        <ul>
                            <NavItem
                                setIsOpen={setIsOpen}
                                NavRoute={"/"}
                                NavIcon={<ImHome />}
                                NavText={"Home"}
                            />
                            <NavItem
                                setIsOpen={setIsOpen}
                                NavRoute={"/nft-staking-pool"}
                                NavIcon={<ImBoxAdd />}
                                NavText={"Stake NFT"}
                            />
                            <NavItem
                                setIsOpen={setIsOpen}
                                NavRoute={"/liquidity-staking-pool"}
                                NavIcon={<FiBox />}
                                NavText={"Stake LP"}
                            />
                            <NavItem
                                setIsOpen={setIsOpen}
                                NavRoute={"/#community"}
                                NavIcon={<HiUserGroup />}
                                NavText={"Community"}
                            />
                            <NavItem
                                setIsOpen={setIsOpen}
                                NavRoute={"/#contact"}
                                NavIcon={<FaHandshake />}
                                NavText={"Collaboration"}
                            />

                        </ul>

                    </nav>
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
                </div>
            </div>
        </DrawerLayout>
    )
}

export default Nav
