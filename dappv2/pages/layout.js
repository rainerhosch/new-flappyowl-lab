import React, { useEffect, useState } from "react"
import Nav from "../components/Common/Nav/Nav"
import NavItem from "../components/Common/Nav/NavItem"
import { ImCross } from "react-icons/im"
import { ImBoxAdd } from "react-icons/im"
import { FiBox } from "react-icons/fi"
import { FaHandshake } from "react-icons/fa"
import { ImHome } from "react-icons/im"
import { HiGift } from "react-icons/hi"
import { HiUserGroup } from "react-icons/hi"
import { HiBadgeCheck } from "react-icons/hi"

import { FaBars, FaMousePointer } from "react-icons/fa"
import { SlOptionsVertical } from "react-icons/sl"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount, useConnect, useDisconnect } from "wagmi"

// Hook
function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    })
    useEffect(() => {
        // only execute all the code below in client side
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }
        // Add event listener
        window.addEventListener("resize", handleResize)
        // Call handler right away so state gets updated with initial window size
        handleResize()
        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize)
    }, []) // Empty array ensures that effect is only run on mount
    return windowSize
}
export default function Layout({ children }) {
    const { isConnected } = useAccount()
    const { disconnect } = useDisconnect()
    const { connectors, connect } = useConnect()
    const wagmiConnectors = connectors.slice(2)
    // console.log(gWCC)
    // console.log(isConnected)
    // console.log(disconnect)

    const size = useWindowSize()
    console.log(size)
    const [isOpen, setIsOpen] = useState(false)
    const [intro, setIntro] = useState(false)
    // if(size < 1024){
    //   setIsOpen(true)
    // }else{
    //   setIsOpen(false)
    // }

    return (
        <div className={`h-screen flex flex-col select-none font-circular`}>
            {/* <div className=''> */}
            <div className="">
                <div className="bg-BluePastel text-LightGray w-full h-10 flex items-center justify-between px-2 relative h-[50px]">
                    <div
                        className="icon flex items-center gap-x-2"
                        // onClick={(e) => setIntro(!intro)}
                    >
                        <span className="absolute top-1/2 left-1/2  -translate-y-1/2 flex items-center justify-center text-center text-sm text-Snow font-extrabold font-mono lg:hidden">
                            {"("}0,<span className="text-Snow font-mono">{"0)"}</span>
                        </span>
                    </div>
                    {/* <div className={isOpen ? `hidden` : ``}>
                        <ConnectButton />
                    </div> */}
                    <div className="icon flex items-center gap-x-2" onClick={(e) => setIsOpen(!isOpen)}>
                        <span className="icon border-2 text-Snow border-Snow p-1 text-sm rounded-lg lg:hidden">
                            {" "}
                            <FaBars />
                        </span>
                    </div>
                    <div className={`hidden lg:grid grid-cols-6 gap-3 content-center items-right gap-x-2 text-Snow/80 font-mono text-sm`}>
                      {/* <nav>
                        <ul> */}
                          <div className="content-center">Home</div>
                          <div className="content-center">Stake Nft</div>
                          <div className="content-center">Stake LP</div>
                          <div className="content-center">Community</div>
                          <div className="content-center">Collaboration</div>
                          <div>
                            <ConnectButton
                            showBalance={false}
                            />
                          </div>
                        {/* </ul>
                      </nav> */}
                        {/* <span className="icon border-2 text-Snow border-Snow p-1 text-sm rounded-lg lg:hidden">
                            {" "}
                            <FaBars />
                        </span> */}
                    </div>
                </div>
            </div>
            <div className="flex relative h-full justify-between gap-x-2">
                {/* left most side */}
                <div className="w-full h-auto lg:w-12/12 shadow-2xl bg-BluePastel relative overflow-auto overflow-x-hidden no-scrollbar">
                    {children}
                </div>
                {/* right side */}
                {/* <div className={`absolute lg:w-60 lg:relative bg-BluePastel shadow-2xl rounded-xl overflow-hidden`}> */}
                    {/* <div onClick={(e) => setIsOpen(!isOpen)} className='bg-BluePastel text-Snow hidden lg:flex items-center h-16 justify-center text-2xl '>
                    <span className='icon border-2 border-Snow p-2 rounded-xl'>
                    {' '}
                    <FaBars />
                    </span>
                    </div>
                    <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 flex items-center justify-center text-center text-xl text-Snow font-extrabold tracking-widest'>
                      .FlappyOwl
                    </span> */}
                    {/* <div className="absolute top-[10%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-center text-xl text-Snow font-extrabold tracking-widest">
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
                </div> */}
                {<Nav isOpen={isOpen} setIsOpen={setIsOpen} />}
          </div>
        </div>
    )
}
