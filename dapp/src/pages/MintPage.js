/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import "../assets/styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import image1 from "../assets/img/flappyowl.svg";
import NavBar from "../components/NavBar";
// import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
// import axios from "axios";
import { Table } from "react-bootstrap";
import { CircularProgress } from "@mui/material";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ButtonGroup from "react-bootstrap/ButtonGroup";

// eslint-disable-next-line
// import ReferralLinkGenerator from "../components/ReferralLinkGenerator.jsx"
import nftContract from "../artifacts/ERC721/FlappyOwlNftTestnet.sol/FlappyOwlNftTestnet.json";
import stakingContract from "../artifacts/utils/FlappyOwlVault.sol/FlappyOwlVault.json";
import {
  vaultContractAddress,
  nftContractAddress,
  ownerAddress,
  networkDeployedTo,
} from "../utils/contracts-config";
import networksMap from "../utils/networksMap.json";

// Convert an integer to uint256
// function intToUint256(number) {
//     return ethers.utils.hexValue(number);
// }

function MintPage() {
  // eslint-disable-next-line
  // const [userConnect, setuserConnect] = useState(null);

  const [scrollTop, setScrollTop] = React.useState(false);
  React.useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 340) {
        setScrollTop(true);
      } else {
        setScrollTop(false);
      }
    });
  }, []);
  const bottomToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const data = useSelector((state) => state.blockchain.value);
  const [mintAmount, setMintAmount] = useState(0);
  const [userNfts, setUserNfts] = useState([]);
  const [info, setInfo] = useState({
    currentSupply: 0,
    maxSupply: 0,
    maxMintAmountPerTx: 0,
    nftUserBalance: 0,
    mintCost: 0,
    paused: false,
    userNftIds: [],
    unstakedNftIds: [],
    stakedNftIds: [],
    totalReward: 0,
  });
  const [loading, setLoading] = useState(false);

  const getInfo = async () => {
    // console.log("getInfo");
    if (data.network === networksMap[networkDeployedTo]) {
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

      const signer = provider.getSigner();
      const user = await signer.getAddress();

      // eslint-disable-next-line
      // setuserConnect(user);

      const stakedTokens = await staking_contract.tokensOfOwner(user);
      const reward = await staking_contract.getTotalRewardEarned(user);
      const paused = await nft_contract.isPublicMint();
      const maxSupply = await nft_contract.maxSupply();
      const totalSupply = await nft_contract.totalSupply();
      // const mintCount = await nft_contract.getmintCount();

      // var userTokens = [];
      var counter = 0;
      const maxMintAmountPerTx = await nft_contract.maxMintPerWallet();
      const cost = await nft_contract.mintCost();
      const nftUserBalance = await nft_contract.balanceOf(user);
      var tokenOfAddress = [];
      var unstaketokenOfAddress = [];

      for (var i = 0; i < totalSupply; i++) {
        const userOwn = await nft_contract.ownerOf(i);
        if (userOwn === user) {
          tokenOfAddress[counter] = i;
          unstaketokenOfAddress[counter] = i;
          counter++;
        }
        if (counter === nftUserBalance) {
          break;
        }
      }

      // console.log(unstaketokenOfAddress);
      tokenOfAddress = tokenOfAddress.concat(stakedTokens).sort();
      setInfo({
        nftName: "Stakeable Nft",
        nftSymbol: "XNFT",
        nftUserBalance: nftUserBalance,
        currentSupply: Number(totalSupply),
        maxSupply: Number(maxSupply),
        maxMintAmountPerTx: Number(maxMintAmountPerTx),
        mintCost: Number(ethers.utils.formatUnits(cost, "ether")),
        paused: paused,
        userNftIds: tokenOfAddress,
        unstakedNftIds: unstaketokenOfAddress,
        stakedNftIds: stakedTokens,
        totalReward: Number(ethers.utils.formatUnits(reward, "ether")),
      });

      const _userNfts = await Promise.all(
        tokenOfAddress.map(async (nft) => {
          const dataURI = await nft_contract.tokenURI(nft);
          const metadata = atob(dataURI.substring(29));
          const jsonMetadata = JSON.parse(metadata);
          const imgURI = jsonMetadata.image;
          // const typeOF = typeof metadata;
          // const jsonMetadatas = JSON.stringify(metadata);
          return {
            id: nft,
            uri: imgURI,
            nftName: jsonMetadata.name,
          };
          // return jsonMetadata;
        })
      );

      setUserNfts(_userNfts);
    }
  };

  // console.log("imgURI: "+userNfts)

  const mint = async () => {
    console.log("mint");
    if (
      data.network === networksMap[networkDeployedTo] &&
      info.paused === true
    ) {
      try {
        setLoading(true);
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        const signer = provider.getSigner();
        const nft_contract = new ethers.Contract(
          nftContractAddress,
          nftContract.abi,
          signer
        );
        if (data.account === ownerAddress) {
          const mint_tx = await nft_contract.mint(mintAmount);
          await mint_tx.wait();
        } else {
          const totalMintCost = ethers.utils.parseEther(
            String(info.mintCost * mintAmount),
            "ether"
          );
          const mint_tx = await nft_contract.mint(mintAmount, {
            value: totalMintCost,
          });
          await mint_tx.wait();
        }
        setLoading(false);
        getInfo();
      } catch (error) {
        setLoading(false);
        window.alert("An error has occured, Please Try Again");
        console.log(error);
      }
    }
  };

  const stakeItem = async (id) => {
    console.log("stakeItem");
    if (data.network === networksMap[networkDeployedTo]) {
      console.log([id]);
      try {
        setLoading(true);
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        const signer = provider.getSigner();
        const nft_contract = new ethers.Contract(
          nftContractAddress,
          nftContract.abi,
          signer
        );
        const staking_contract = new ethers.Contract(
          vaultContractAddress,
          stakingContract.abi,
          signer
        );

        const approve_tx = await nft_contract.approve(vaultContractAddress, id);
        await approve_tx.wait();

        // console.log([id]);
        const stake_tx = await staking_contract.stake([id]);
        await stake_tx.wait();

        setLoading(false);
        getInfo();
      } catch (error) {
        setLoading(false);
        window.alert("An error has occured, Please Try Again");
        console.log(error);
      }
    }
  };

  const unstakeItem = async (id) => {
    console.log("unstakeItem");
    if (data.network === networksMap[networkDeployedTo]) {
      try {
        setLoading(true);
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        const signer = provider.getSigner();
        const staking_contract = new ethers.Contract(
          vaultContractAddress,
          stakingContract.abi,
          signer
        );

        const unstake_tx = await staking_contract.unstake([id]);
        await unstake_tx.wait();

        setLoading(false);
        getInfo();
      } catch (error) {
        setLoading(false);
        window.alert("An error has occured, Please Try Again");
        console.log(error);
      }
    }
  };

  const stakeAll = async () => {
    const avalibeNft = info.unstakedNftIds;
    // console.log("avalibe for stake: "+avalibeNft);
    // console.log("length: "+avalibeNft.length);
    if (data.network === networksMap[networkDeployedTo]) {
      try {
        setLoading(true);
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        const signer = provider.getSigner();
        const nft_contract = new ethers.Contract(
          nftContractAddress,
          nftContract.abi,
          signer
        );
        const staking_contract = new ethers.Contract(
          vaultContractAddress,
          stakingContract.abi,
          signer
        );

        // function approve all
        const approve_tx = await nft_contract.setApprovalForAll(
          vaultContractAddress,
          true
        );
        await approve_tx.wait();

        const stake_tx = await staking_contract.stake(avalibeNft);
        await stake_tx.wait();

        setLoading(false);
        getInfo();
      } catch (error) {
        setLoading(false);
        window.alert("An error has occured, Please Try Again");
        console.log(error);
      }
    }
  };

  const unstakeAll = async () => {
    console.log("unstakeAll");
    if (data.network === networksMap[networkDeployedTo]) {
      try {
        setLoading(true);
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        const signer = provider.getSigner();
        const staking_contract = new ethers.Contract(
          vaultContractAddress,
          stakingContract.abi,
          signer
        );

        const unstake_tx = await staking_contract.unstake(info.stakedNftIds);
        await unstake_tx.wait();

        setLoading(false);
        getInfo();
      } catch (error) {
        setLoading(false);
        window.alert("An error has occured, Please Try Again");
        console.log(error);
      }
    }
  };

  const claim = async () => {
    if (data.network === networksMap[networkDeployedTo]) {
      try {
        setLoading(true);
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        const signer = provider.getSigner();
        const staking_contract = new ethers.Contract(
          vaultContractAddress,
          stakingContract.abi,
          signer
        );

        const claim_tx = await staking_contract.claim(info.stakedNftIds);
        await claim_tx.wait();

        setLoading(false);
        getInfo();
      } catch (error) {
        setLoading(false);
        window.alert("An error has occured, Please Try Again");
        console.log(error);
      }
    }
    console.log("claim");
  };

  useEffect(() => {
    getInfo();
    console.log(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.account]);

  return (
    <section>
      <NavBar />
      <br />
      <section className="claim" id="claim">
        <div className="roadmap-container">
          <div className="info-container">
            <Card>
              <Card.Body>
                <Card.Title className="mb-3">
                  <h3 className="text-center p-2">Minting Info</h3>
                </Card.Title>
                <Table responsive>
                  <tbody>
                    <tr>
                      <td className="p-2">Minted / Max Supply</td>
                      <td>
                        {info.currentSupply}/{info.maxSupply}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2">Minted NFT Count</td>
                      <td>{info.currentSupply}</td>
                    </tr>
                    <tr>
                      <td className="p-2">Mint Cost</td>
                      <td>{info.mintCost} ETH</td>
                    </tr>
                    <tr>
                      <td className="p-2">Max Mint Amount Per TX </td>
                      <td>{info.maxMintAmountPerTx} </td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
            {/* <Card className="mt-1">
              <Card.Body>
                <ReferralLinkGenerator address={userConnect} />
              </Card.Body>
            </Card> */}
          </div>
          <div className="info-container">
            <Card>
              <Card.Body>
                <Card.Title className="mb-3">
                  <h3 className="text-center p-2">Staking Info</h3>
                </Card.Title>
                <Table responsive>
                  <tbody>
                    <tr>
                      <td className="p-2">Your {info.nftName} </td>
                      <td>[{info.userNftIds.join(", ")}]</td>
                      {/* <td>{info.userNftIds.map((nft, index) => {
                      return(<span >[#{nft}]</span> )
                    })}</td> */}
                    </tr>
                    <tr>
                      <td className="p-2">Total Your Own</td>
                      <td>{info.userNftIds.length} NFTs</td>
                    </tr>
                    <tr>
                      <td className="p-2">Unstake NFTs</td>
                      <td>
                        {info.unstakedNftIds.length > 0
                          ? info.unstakedNftIds.map((nft, index) => {
                              return <span key={index}>[#{nft}]</span>;
                            })
                          : "-"}
                      </td>
                      {/* <td>[{info.unstakedNftIds.join(",")}]</td> */}
                    </tr>
                    <tr>
                      <td className="p-2">Staked NFTs</td>
                      <td>[{info.stakedNftIds.join(", ")}]</td>
                    </tr>
                    <tr>
                      <td className="p-2">Earned Reward</td>
                      <td>
                        {info.totalReward !== 0
                          ? parseFloat(info.totalReward).toFixed(6)
                          : 0}{" "}
                        $SRC
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
            <div style={{ textAlign: "center" }}>
              <ButtonGroup aria-label="Basic example" className="mt-3">
                <Button variant="warning" src="" onClick={claim}>
                  {loading ? (
                    <CircularProgress color="inherit" size={18} />
                  ) : (
                    "Claim Reward"
                  )}
                </Button>
                <Button variant="primary" src="" onClick={stakeAll}>
                  {loading ? (
                    <CircularProgress color="inherit" size={18} />
                  ) : (
                    "Stake All"
                  )}
                </Button>
                <Button variant="dark" src="" onClick={unstakeAll}>
                  {loading ? (
                    <CircularProgress color="inherit" size={18} />
                  ) : (
                    "Unstake All"
                  )}
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
        <div className="roadmap-container">
          <div className="mint-container">
            <div className="row" style={{ justifyContent: "center" }}>
              <div className="col-md-7">
                <div className="text-center">
                  <h2 className="minttitle title">Mint {info.nftName}</h2>
                  <img
                    src={image1}
                    className="mint-img w-24 h-24 md:w-48 md:h-auto md:rounded-none rounded-full mx-auto"
                    alt=""
                  />
                  <p className="lead" style={{ marginBottom: "30px" }}>
                    A {info.nftName} is fully onchain NTFs, no IPFS or any
                    external storage. Olny code {info.nftSymbol}.
                  </p>
                  <div className="form-group">
                    <div className="d-flex justify-content-center">
                      <Button
                        type="button"
                        variant="light outline-dark"
                        className="minus"
                        disabled={mintAmount === 0}
                        onClick={() => {
                          setMintAmount(mintAmount - 1);
                        }}
                      >
                        -
                      </Button>
                      <input
                        type="number"
                        className="mintnum text-center"
                        readOnly
                        value={mintAmount}
                      />
                      <Button
                        type="button"
                        variant="light outline-dark"
                        className="plus"
                        onClick={() => {
                          if (
                            mintAmount <
                            info.maxMintAmountPerTx - info.userNftIds.length
                          ) {
                            setMintAmount(mintAmount + 1);
                          } else {
                            toast.error("Exceed Maximum Mint Limit", {
                              theme: "colored",
                              autoClose: 2000,
                            });
                          }
                        }}
                      >
                        +
                      </Button>
                    </div>
                    <ToastContainer />
                    <div>
                      <Button
                        variant="dark outline-dark"
                        className="mt-3"
                        onClick={mint}
                        disabled={mintAmount === 0}
                      >
                        {loading ? (
                          <CircularProgress color="inherit" size={18} />
                        ) : (
                          "MINT"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="my-items">
        {userNfts.length !== 0 ? (
          <>
            <h2 className="minttitle title text-center">My {info.nftName}s</h2>
            <div className="items container">
              {userNfts.map((nft, index) => {
                return (
                  <div className="item-box" key={index}>
                    <img src={nft.uri} className="item-img" />
                    <div className="text-center">
                      <div>
                        <h5>{nft.nftName}</h5> <span></span>
                      </div>
                      {info.stakedNftIds.includes(nft.id) ? (
                        <Button
                          variant="dark"
                          className="m-3"
                          role="button"
                          onClick={() => {
                            unstakeItem(nft.id);
                          }}
                        >
                          {loading ? (
                            <CircularProgress color="inherit" size={18} />
                          ) : (
                            "UNSTAKE"
                          )}
                        </Button>
                      ) : (
                        <Button
                          variant="outline-primary"
                          className="m-3"
                          role="button"
                          onClick={() => {
                            stakeItem(nft.id);
                          }}
                        >
                          {loading ? (
                            <CircularProgress color="inherit" size={18} />
                          ) : (
                            "STAKE"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : null}
        {scrollTop && (
          <button onClick={bottomToTop} className="backToTop">
            &#8593;
          </button>
        )}
      </section>

      {/* <Footer /> */}
    </section>
  );
}

export default MintPage;
