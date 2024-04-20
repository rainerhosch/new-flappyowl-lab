import React, { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import Footer from "../components/Footer.jsx"
import NftCard from "../components/NFTStakingPool/NftCard.jsx"
import axios from "axios"
// import { Skeleton } from "../components/Common/ParagraphSkeleton";
import ImageAndParagraphSkeleton from "../components/Common/ImageAndParagraphSkeleton.jsx"
import networksMap from "../utils/networksMap.json"
import { ethers } from "ethers"
import {
    useAccount,
    useChains,
    useChainId,
    useReadContract,
    useWaitForTransactionReceipt,
    useWriteContract,
} from "wagmi"
import {
    flappyOwlNftTestnetAbi,
    frcAbi,
    nftStakingPoolAbi,
    liquidityPoolAbi,
    flappyOwlGovernorAbi,
} from "../src/smartcontract-abi"
import {
    governorContractAddress,
    liquidityPoolContractAddress,
    stakingPoolNFTContractAddress,
    nftContractAddress,
    tokenContractAddress,
    ownerAddress,
    networkDeployedTo,
} from "../utils/contracts_config.js"

const nftStakingPool = () => {
    const { address, isConnecting, isConnected, isDisconnected } = useAccount();
    const chains = useChains()
    const chainId = useChainId()
    const [loading, setLoading] = useState(false)
    const [totalNftMinted, setTotalNftMinted] = useState(21000)
    const [totalStakedNft, setTotalStakedNft] = useState(21000)
    const [totalSupplyFRC, setTotalSupplyFRC] = useState(0)
    // const [isLoading, _setIsLoading] = useState(true)

    function formatCurrency(_number) {
        return new Intl.NumberFormat("en-US").format(_number)
    }

    function nFormatter(num, digits) {
        const lookup = [
            { value: 1, symbol: "" },
            { value: 1e3, symbol: "K" },
            { value: 1e6, symbol: "M" },
            { value: 1e9, symbol: "G" },
            { value: 1e12, symbol: "T" },
            { value: 1e15, symbol: "P" },
            { value: 1e18, symbol: "E" },
        ]
        const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/
        const item = lookup.findLast((item) => num >= item.value)
        return item
            ? (num / item.value).toFixed(digits).replace(regexp, "").concat(item.symbol)
            : "0"
    }
    console.log(isConnected)
    console.log(address)
    // const { data: address } = useAccount();
    const { data: totalSupplyNft } = useReadContract({
        address: nftContractAddress,
        abi: flappyOwlNftTestnetAbi,
        functionName: "totalSupply",
        watch: true,
    })
    const { data: _totalSupplyFRC } = useReadContract({
        address: tokenContractAddress,
        abi: frcAbi,
        functionName: "totalSupply",
        watch: true,
    })
    // useEffect(()=>{
    //     if (address) {
    //         setIsConnected(true)
    //     }
    // })
    useEffect(() => {
        if (_totalSupplyFRC) {
            setTotalSupplyFRC(nFormatter(ethers.formatEther(_totalSupplyFRC), 4))
        }
    }, [_totalSupplyFRC])
    useEffect(() => {
        if (totalSupplyNft) {
            setTotalNftMinted(totalSupplyNft.toString())
        }
    }, [totalSupplyNft])
    // const { addToast } = useToasts()

    // console.log(isConnecting)

    const { isLoading, error, data } = useQuery(["portfolio"], async () =>
        axios
            .get("api/portfolio")
            .then(({ data }) => data)
            .catch((error) => console.error("Error fetching testimonials:", error)),
    )
    return (
        <>
            <div className="mt-5 flex flex-col items-center py-2 justify-center bg-gradient-to-t from-BluePastel">
                <div className="bg-SnowTransparent w-[95%] h-[95%] px-4 py-2 rounded-xl overflow-hidden flex md:block">
                    <div className="flex sm:content-center md:items-center md:justify-around">
                        <div className="">
                            <div className="">
                                <h1 className="text-2xl sm:text-4xl xl:text-5xl text-Snow font-bold">
                                    NFT Staking Pool
                                </h1>
                            </div>
                            <div className="mt-3">
                                <p className="text-sm sm:text-2x1 xl:text-lg text-Snow font-medium font-mono">
                                    earn $FRC with staking Nft
                                </p>
                            </div>
                            <div className="md:hidden">
                                <p className="text-sm sm:text-md xl:text-lx text-Snow font-medium font-mono text-left">
                                    POWERED BY OP STACK
                                </p>
                            </div>
                        </div>
                        <div className="hidden md:block w-48 h-52 relative">
                            <div className="">
                                <p className="text-sm sm:text-md xl:text-lx text-Snow font-medium font-mono text-right">
                                    POWERED BY OP STACK
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* details in row */}
                <div className="bg-SnowTransparent w-[95%] px-4 py-2 rounded-xl mt-3">
                    <div className="grid grid-cols-2 gap-4 md:gap-0 md:flex md:items-center justify-around w-full px-4 xl:px-8 2xl:px-16">
                        <div className="flex items-center gap-x-1">
                            <span className="text-base md:text-lg text-White font-bold font-mono">
                                {nFormatter(totalNftMinted, 4)}
                            </span>
                            <span className="text-xs md:text-sm text-MidNightBlack font-medium font-mono">
                                NFT Minted
                            </span>
                        </div>
                        <div className="flex items-center gap-x-1">
                            <span className="text-base md:text-lg text-White font-bold font-mono">
                                {nFormatter(totalStakedNft)}
                            </span>
                            <span className="text-xs md:text-sm text-MidNightBlack font-medium font-mono">
                                NFT Staked
                            </span>
                        </div>

                        <div className="flex items-center gap-x-1">
                            <span className="text-base md:text-lg text-White font-bold font-mono col-span-2">
                                {totalSupplyFRC}
                            </span>
                            <span className="text-xs md:text-sm text-MidNightBlack font-medium font-mono col-span-2">
                                $FRC
                                {/* <a className="small:hidden">Total Supply</a> */}
                            </span>
                        </div>

                        <div className="flex items-center gap-x-1">
                            <span className="text-base md:text-lg text-White font-bold font-mono">
                                {nFormatter((21000000 * 60) / 100, 4)}
                            </span>
                            <span className="text-xs md:text-sm text-MidNightBlack font-medium font-mono">
                                $FRC Airdrop
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-BluePastel grid justify items-center grid-flow-row md:grid-cols-4 grid-rows-auto gap-4 px-8 my-6">
                {isLoading
                    ? [1, 2, 3, 4, 5].map((x) => (
                        <ImageAndParagraphSkeleton key={x} dataClass={"w-full object-cover"} />
                        ))
                    : data?.map((data, key) => <NftCard key={key} data={data} />)}
            </div>
            <Footer />
        </>
    )
}

export default nftStakingPool
