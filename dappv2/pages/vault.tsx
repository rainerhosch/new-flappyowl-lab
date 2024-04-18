import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useQuery } from "react-query";
import {useQuery } from '@tanstack/react-query';
import BannerLayout from "../components/Common/BannerLayout";
import Footer from "../components/Footer";
import PortfolioCard from "../components/Portfolio/PortfolioCard";
import type { NextPage } from 'next';
import axios from "axios";
// import { Skeleton } from "../components/Common/ParagraphSkeleton";
import ImageAndParagraphSkeleton from "../components/Common/ImageAndParagraphSkeleton";
import { ethers } from "ethers";

import nftContract from "../constants/artifacts/NFT/FlappyOwlNftTestnet.sol/FlappyOwlNftTestnet.json"
import governorContract from "../constants/artifacts/utils/FlappyOwlGovernor.sol/FlappyOwlGovernor.json"
import liquidityPoolContract from "../constants/artifacts/governance/LiquidityPool.sol/LiquidityPool.json"
import stakingPoolNFTContract from "../constants/artifacts/governance/NftStakingPool.sol/NftStakingPool.json"

import {
    governorContractAddress,
    liquidityPoolContractAddress,
    stakingPoolNFTContractAddress,
    nftContractAddress,
    tokenContractAddress,
    ownerAddress,
    networkDeployedTo
} from "../utils/contracts-config.js"
import networksMap from "../utils/networksMap.json";

import { useAccount, useChains, useChainId, useReadContract, useWaitForTransactionReceipt, useWriteContract, } from "wagmi"

const Vault: NextPage = () => {
    
    const { address } = useAccount();
    const chains = useChains()
    const chainId = useChainId()
    console.log(address)
    console.log(chains)
    console.log(chainId)
    
    const [loading, setLoading] = useState(false);
    // const { addToast } = useToasts()

    const { isLoading, error, data } = useQuery(['portfolio'], async () =>
        axios.get('api/portfolio')
            .then(({ data }) => data)
            .catch(error => console.error('Error fetching testimonials:', error)))
    return (
        <BannerLayout>
            <div className="grid justify items-center grid-flow-row md:grid-cols-2 grid-rows-auto gap-4 px-8 my-6">
                {
                    isLoading ?
                        [1, 2, 3, 4, 5].map((x) => (
                            <ImageAndParagraphSkeleton key={x} dataClass={"w-full object-cover"} />
                        ))
                        :
                        data?.map((data, key) => (
                            <PortfolioCard key={key} data={data} />
                        ))
                }
            </div >
            <Footer />
        </BannerLayout >
    );
};

export default Vault;
