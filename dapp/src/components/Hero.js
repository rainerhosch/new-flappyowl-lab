import React, { useState, useEffect } from "react";
import "../assets/styles.css";
import { ethers } from "ethers";
// import { useSelector } from "react-redux";
import Carousel from "./Carousel";
import nftContract from "../artifacts/ERC721/FlappyOwlNftTestnet.sol/FlappyOwlNftTestnet.json";
import stakingContract from "../artifacts/utils/FlappyOwlVault.sol/FlappyOwlVault.json";
import {
  vaultContractAddress,
  nftContractAddress,
} from "../utils/contracts-config";

function Hero() {
  const [isLoading, setIsLoading] = useState(true);
  const [recentlyMintedNFTs, setRecentlyMintedNFTs] = useState([]);
  const [totalStakedNft, _setTotalStakedNft] = useState(0);

  useEffect(() => {
    async function getRecentlyMintedNFTs() {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );

      const nft_contract = new ethers.Contract(
        nftContractAddress,
        nftContract.abi,
        provider
      );
      const staking_contract = new ethers.Contract(
        vaultContractAddress,
        stakingContract.abi,
        provider
      );
      // const maxSupply = await nft_contract.maxSupply();
      const totalSupply = await nft_contract.totalSupply();
      const totalStaked = await staking_contract.totalItemsStaked();
      _setTotalStakedNft(Number(totalStaked));

      // // Get the last minted NFT
      // const lastMintedTokenId = totalSupply - 5;
      // const lastMintedTokenURI = await nft_contract.tokenURI(lastMintedTokenId);
      // setLastMintedNFT(lastMintedTokenURI);

      // Get the last 10 minted NFTs
      const numberOfNFTsToFetch = 10;
      const lastMintedNFTs = [];
      for (
        let i = totalSupply - 1;
        i >= Math.max(totalSupply - numberOfNFTsToFetch, 0);
        i--
      ) {
        const tokenURI = await nft_contract.tokenURI(i);
        const metadata = atob(tokenURI.substring(29));
        const jsonMetadata = JSON.parse(metadata);
        const imgURI = jsonMetadata.image;
        lastMintedNFTs.push({
          id: i,
          uri: imgURI,
          nftName: jsonMetadata.name,
        });
      }
      setRecentlyMintedNFTs(lastMintedNFTs.reverse());
      setIsLoading(false);
    }
    getRecentlyMintedNFTs();
  }, []);
  return (
    <section className="hero">
      <div className="">
        <div className="container justify-items-center mb-24">
          <div className="text-center">
            <div>
              <h2 className="text-[#fff] font-900 text-center">
                {isLoading ? "Loading ..." : "Recent Minted"}
              </h2>
            </div>
            {isLoading ? (
              <div className="placeholderImage">
                <div className="loading-animation"></div>
              </div>
            ) : (
              <Carousel images={recentlyMintedNFTs} />
            )}
          </div>
        </div>
        <div className="container justify-items-center">
          <div className="caption">
            <h5 className="text-center">
              Total staked nfts at vault : {totalStakedNft} NFTs
            </h5>
            <p
              className="text-center subpixel-antialiased"
              style={{ color: "#fff" }}
            >
              Mint, Stake Nfts And Earn Rewards
            </p>
            <div className="caption-inner">
              <a href="/vault">
                <button className="btn btn-warning" style={{ color: "#000" }}>
                  Mint Now
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
