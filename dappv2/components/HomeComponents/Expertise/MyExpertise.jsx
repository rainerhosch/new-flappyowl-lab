import React, { useState, useEffect } from "react"
import { ethers } from "ethers"
import nftContract from "../../../constants/artifacts/NFT/FlappyOwlNftTestnet.sol/FlappyOwlNftTestnet.json"
import governorContract from "../../../constants/artifacts/utils/FlappyOwlGovernor.sol/FlappyOwlGovernor.json"
import liquidityPoolContract from "../../../constants/artifacts/governance/LiquidityPool.sol/LiquidityPool.json"
import stakingPoolNFTContract from "../../../constants/artifacts/governance/NftStakingPool.sol/NftStakingPool.json"
import {
    governorContractAddress,
    liquidityPoolContractAddress,
    stakingPoolNFTContractAddress,
    nftContractAddress,
    tokenContractAddress,
    ownerAddress,
    networkDeployedTo
} from "../../../utils/contracts-config.js"
import RecentMinted from "../Carousel/RecentMinted"
import BaseFrog from "../../Common/Frog"
import EChartsExample from "../Chart/Piechart"
const MyExpertise = () => {
    const [isLoading, _setIsLoading] = useState(true)
    const [isWrongNetwork, _setWrongNetwork] = useState(true)
    const [isConnected, _setIsConnected] = useState(true)
    const [recentlyMintedNFTs, _setRecentlyMintedNFTs] = useState([])
    const [totalStakedNft, _setTotalStakedNft] = useState(0)

    // console.log("Chain ID changed!", chainId)

    useEffect(() => {
        async function getRecentlyMintedNFTs() {
            const network = {
                name: "spolia",
                chainId: 11155111,
                ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
            }
            let signer = null
            let provider
            if (window.ethereum == null) {
                console.log("MetaMask not installed; using read-only defaults")
                provider = ethers.getDefaultProvider()
                _setIsConnected(false)
            } else {
                // requests through MetaMask
                provider = new ethers.BrowserProvider(window.ethereum, network)
                signer = await provider.getSigner()
                // cNetwork = await provider.checkNetwork()
                console.log(provider)

                const nft_contract = new ethers.Contract(
                    nftContractAddress,
                    nftContract.abi,
                    provider
                )
                const staking_contract = new ethers.Contract(
                    stakingPoolNFTContractAddress,
                    stakingPoolNFTContract.abi,
                    provider
                )

                try {
                    const totalSupply = await nft_contract.totalSupply()
                    const totalStaked = await staking_contract.totalNftStakingPool()
                    _setTotalStakedNft(Number(totalStaked))

                    const numberOfNFTsToFetch = Number(totalSupply) < 10 ? Number(totalSupply) : 10
                    const lastMintedNFTs = []
                    // Get the last 10 minted NFTs
                    for (
                        let i = Number(totalSupply) - 1;
                        i >= Math.max(Number(totalSupply) - numberOfNFTsToFetch, 0);
                        i--
                    ) {
                        const tokenURI = await nft_contract.tokenURI(i)
                        const metadata = atob(tokenURI.substring(29))
                        const jsonMetadata = JSON.parse(metadata)
                        const imgURI = jsonMetadata.image
                        lastMintedNFTs.push({
                            id: i,
                            uri: imgURI,
                            nftName: jsonMetadata.name,
                        })
                    }
                    // console.log(numberOfNFTsToFetch)
                    _setRecentlyMintedNFTs(lastMintedNFTs.reverse())
                    _setIsLoading(false)
                    _setWrongNetwork(false)
                } catch (error) {
                    console.error(error.message)
                    // Handle the error or display a user-friendly message
                }

                // const maxSupply = await nft_contract.maxSupply();
            }

            // console.log(provider)
            // console.log(signer)
            // console.log()
        }

        getRecentlyMintedNFTs()
    }, [])

    const dynamicColors = {
        bgColor: "#ff7474",
        color1: "#002d26",
        color2: "#61ff75",
        color3: "#ff9def",
        color4: "#e2ffe2",
    }

    function Owl() {
        return (
            <>
            <rect width="100%" height="100%" fill={dynamicColors.bgColor} />
            <text x="170" y="130" fontFamily="Courier New, monospace" fontWeight="700" fontSize="20" textAnchor="middle" letterSpacing="1">
            <animate attributeName="dy" values="0;50;0" dur="2.5s" repeatCount="indefinite" />
            <tspan fill={dynamicColors.color1}>/--/</tspan>
            <tspan dy="20" x="170" fill={dynamicColors.color2}>(o,O)</tspan>
            <tspan dy="25" x="170" fill={dynamicColors.color3}>{`///{\\S/}\\\\\\`}</tspan>
            <tspan dy="25" x="170" fill={dynamicColors.color4}>{'~"~"~'}</tspan>
            </text>
            </>
        )
    }
    function Circle({ cx, cy, r, stroke, strokeWidth, fill }) {
        return (
            <circle cx={cx} cy={cy} r={r} stroke={stroke} strokeWidth={strokeWidth} fill={fill} />
        )
    }

    return (
        <>
            <div className="px-2 md:px-8 py-4 text-lg font-bold text-Snow text-center bg-RedSuprimeDark">
                Recent Minted
            </div>
            <div className="justify-items-center mb-24  bg-RedSuprimeDark">
                <div className="text-center">
                    <div>
                        <h2 className="text-[#fff] font-900 text-center">
                            {isLoading && !isConnected ? (
                                <i className="font-mono">
                                    No installed wallet, please{" "}
                                    <a
                                        href="https://metamask.io/download/"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-black"
                                    >
                                        Downloads
                                    </a>{" "}
                                    Metamask
                                </i>
                            ) : isLoading && isWrongNetwork ? (
                                <a className="font-mono">
                                    Wrong Network, please change your network!
                                </a>
                            ) : isLoading ? (
                                "Loading ..."
                            ) : (
                                ""
                            )}
                        </h2>
                    </div>
                    {!isLoading ? (
                        <div className="placeholderImage">
                            <div className="loading-animation"></div>
                        </div>
                    ) : (
                        // <RecentMinted images={recentlyMintedNFTs} />
                        <div className="placeholderImage">
                            <svg
                            width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
                                <BaseFrog/>
                            </svg>
                        </div>
                    )}
                </div>
                <div className="text-Snow font-mono md:p-24 sm:p-10 p-8 text-justify">
                    <span>
                        <p className="mb-3">
                            Flappyowl vault is the first nft project to introduce a virtual mining
                            system, $FRC is the original token in the ecosystem.
                        </p>
                        <p className="mb-3">
                            {`It's`} like ethereum only minted by miners, so supply will depend on
                            community staking nft.
                        </p>
                        <p className="mb-3">
                            The Flappyowl NTF is Onchain Nfts type, generated directly to the
                            blockchain by algorithms stored and scured into blockchain without
                            external storage.
                        </p>
                    </span>
                </div>
                <div className="bg-[#2a2626]">
                    <div className="row p-3 text-center text-Snow">
                        <h3 className="font-bold font-mono">21M INITIAL SUPPLY $FRC ALLOCATION</h3>
                    </div>
                    <div className="row p-3 font-bold font-mono">
                        <EChartsExample />
                    </div>
                </div>
            </div>
        </>
    )
}

export default MyExpertise
