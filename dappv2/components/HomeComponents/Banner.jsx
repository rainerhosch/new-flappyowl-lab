import Typewriter from "typewriter-effect"
import BannerLayout from "../Common/BannerLayout"
import Image from "next/image"
import React, { useState, useEffect } from "react"
import { ethers } from "ethers"
import { useAccount, useChains, useChainId, useReadContract } from "wagmi"
import { flappyOwlNftTestnetAbi, frcAbi, nftStakingPoolAbi, liquidityPoolAbi, flappyOwlGovernorAbi } from '../../src/smartcontract-abi'
import {
    governorContractAddress,
    liquidityPoolContractAddress,
    stakingPoolNFTContractAddress,
    nftContractAddress,
    tokenContractAddress,
    ownerAddress,
    networkDeployedTo
} from "../../utils/contracts_config.js"

const Banner = () => {
    const [totalNftMinted, setTotalNftMinted] = useState(21000);
    const [totalStakedNft, setTotalStakedNft] = useState(21000);
    const [totalSupplyFRC, setTotalSupplyFRC] = useState("0");
    const [isLoading, _setIsLoading] = useState(true)

    function formatCurrency(_number){
        return new Intl.NumberFormat('en-US').format(_number)
    }

    function nFormatter(num, digits) {
        const lookup = [
            { value: 1, symbol: "" },
            { value: 1e3, symbol: "k" },
            { value: 1e6, symbol: "M" },
            { value: 1e9, symbol: "G" },
            { value: 1e12, symbol: "T" },
            { value: 1e15, symbol: "P" },
            { value: 1e18, symbol: "E" }
        ];
        const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
        const item = lookup.findLast(item => num >= item.value);
        return item ? (num / item.value).toFixed(digits).replace(regexp, "").concat(item.symbol) : "0";
    }

    const { data: totalSupplyNft } = useReadContract({
        address: nftContractAddress,
        abi: flappyOwlNftTestnetAbi,
        functionName: 'totalSupply',
        watch:true
    });
    const { data: _totalSupplyFRC } = useReadContract({
        address: tokenContractAddress,
        abi: frcAbi,
        functionName: 'totalSupply',
        watch:true
    });
    useEffect(() => {
        if (_totalSupplyFRC) {
            setTotalSupplyFRC(nFormatter(ethers.formatEther(_totalSupplyFRC), 4));
        }
    }, [_totalSupplyFRC]);
    useEffect(() => {
        if (totalSupplyNft) {
        setTotalNftMinted(totalSupplyNft.toString());
        }
    }, [totalSupplyNft]);
    // console.log('Total Minted: '+totalNftMinted)
    return (
        <BannerLayout>
            <div className="absolute inset-0 z-20 flex flex-col items-center py-6 justify-center w-full h-full bg-gradient-to-t from-RedSuprime">
                <div className="bg-SnowTransparent w-[95%] h-[95%] px-4 py-2 rounded-xl overflow-hidden flex md:block">
                    <div className="flex sm:content-center md:items-center md:justify-around">
                        <div className="">
                            <div className="">
                                <h1 className="text-2xl sm:text-4xl xl:text-5xl text-Snow font-bold">
                                    NFT Yeild Farm Solution.
                                </h1>
                            </div>

                            <div className="mt-3">
                                <p className="text-[0.95em] sm:text-2x1 xl:text-lg text-Snow font-medium font-mono">
                                    Discover, collect, and earn $FRC with stake your Nft, on our
                                    vault.
                                </p>
                            </div>
                        </div>
                        <div className="w-48 h-52 relative justify-center"></div>
                    </div>
                </div>

                {/* details in row */}
                <div className="bg-SnowTransparent w-[95%] px-4 py-2 rounded-xl mt-3">
                    <div className="grid grid-cols-2 gap-4 md:gap-0 md:flex md:items-center justify-around w-full px-4 xl:px-8 2xl:px-16">
                        <div className="flex items-center gap-x-1">
                            <span className="text-base md:text-lg text-DeepNightBlack font-bold font-mono">
                                {nFormatter(totalNftMinted, 4)}
                            </span>
                            <span className="text-xs md:text-sm text-MidNightBlack font-medium font-mono">
                                NFT Minted
                            </span>
                        </div>
                        <div className="flex items-center gap-x-1">
                            <span className="text-base md:text-lg text-DeepNightBlack font-bold font-mono">
                                {nFormatter(totalStakedNft)}
                            </span>
                            <span className="text-xs md:text-sm text-MidNightBlack font-medium font-mono">
                                Owl Staked
                            </span>
                        </div>

                        <div className="flex items-center gap-x-1">
                            <span className="text-base md:text-lg text-DeepNightBlack font-bold font-mono col-span-2">
                            {totalSupplyFRC}
                            </span>
                            <span className="text-xs md:text-sm text-MidNightBlack font-medium font-mono col-span-2">
                                $FRC 
                                {/* <a className="small:hidden">Total Supply</a> */}
                            </span>
                        </div>

                        <div className="flex items-center gap-x-1">
                            <span className="text-base md:text-lg text-DeepNightBlack font-bold font-mono">
                                {nFormatter((21000000*60)/100, 4)}
                            </span>
                            <span className="text-xs md:text-sm text-MidNightBlack font-medium font-mono">
                                $FRC Airdrop
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </BannerLayout>
    )
}

export default Banner
