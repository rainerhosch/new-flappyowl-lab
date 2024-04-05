import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useDispatch, useSelector } from "react-redux";
import { updateAccountData, disconnect } from "../features/blockchain";
import { ethers, utils } from "ethers";
import { Modal } from "react-bootstrap";
import Web3Modal from "web3modal";

import networks from "../utils/networksMap.json";
import { supportNetwork } from "../utils/supportNetwork.js";
import { ownerAddress } from "../utils/contracts-config";

const eth = window.ethereum;
let web3Modal = new Web3Modal();

function Connect() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.blockchain.value);
  const supportChain = supportNetwork();

  const [injectedProvider, setInjectedProvider] = useState();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function fetchAccountData() {
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();
    const providerNetwork = await provider.getNetwork();
    // const chainId = await providerNetwork.chainId;
    const account = await signer.getAddress();
    const balance = await signer.getBalance();
    // console.log(providerNetwork.chainId);
    if (window.ethereum !== "undifined") {
      setInjectedProvider(provider);
      dispatch(
        updateAccountData({
          account: account,
          balance: utils.formatUnits(balance),
          chainId: providerNetwork.chainId,
          network: networks[String(providerNetwork.chainId)],
        })
      );
    } else {
      console.log("Please install metamask");
      window.alert("Please Install Metamask");
    }
  }

  async function Disconnect() {
    web3Modal.clearCachedProvider();
    if (
      injectedProvider &&
      injectedProvider.provider &&
      typeof injectedProvider.provider.disconnect == "function"
    ) {
      await injectedProvider.provider.disconnect();
      setInjectedProvider(null);
    }
    dispatch(disconnect());
    setShow(false);
  }
  async function switchNetwork() {
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();
    const providerNetwork = await provider.getNetwork();
    // const chainId = await providerNetwork.chainId;
    const account = await signer.getAddress();
    const balance = await signer.getBalance();
    // alert("Switch Network?");
    try {
      // check if the chain to connect to is installed
      var _chainId = supportChain.GOERLI_TESTNET.chainId;
      if (_chainId === "0x05") {
        _chainId = "0x5";
      }
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: _chainId }], // chainId must be in hexadecimal numbers
      });
      dispatch(
        updateAccountData({
          account: account,
          balance: utils.formatUnits(balance),
          chainId: providerNetwork.chainId,
          network: networks[String(providerNetwork.chainId)],
        })
      );
      setTimeout(function () {
        window.location.reload();
      }, 5000);
    } catch (error) {
      // This error code indicates that the chain has not been added to MetaMask
      // if it is not, then install it into the user MetaMask
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [supportChain.GOERLI_TESTNET],
          });
        } catch (addError) {
          console.error(addError);
        }
      } else if (error.code === 4001) {
        alert(error.message);
      }
      console.error(error);
    }
  }

  useEffect(() => {
    if (eth) {
      eth.on("chainChanged", (chainId) => {
        // console.log("network changed to:" + chainId);
        fetchAccountData();
      });
      eth.on("accountsChanged", (accounts) => {
        fetchAccountData();
      });
    }
  }, [fetchAccountData]);

  const isConnected = data.account !== "";
  var isNetwork;
  if (isConnected) {
    isNetwork =
      supportChain.GOERLI_TESTNET.chainId ===
      ethers.utils.hexlify(data.chainId);
  }

  return (
    <>
      {isConnected ? (
        isNetwork ? (
          <>
            <button
              className="btn btn-warning m-2 rounded"
              onClick={handleShow}
            >
              {data.account &&
                `${data.account.slice(0, 6)}...${data.account.slice(
                  data.account.length - 6,
                  data.account.length
                )}`}
            </button>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header>
                <Modal.Title>User</Modal.Title>
              </Modal.Header>
              <Modal.Body color="#234">
                <p className="lg:text-lg sm:text-sm"><strong>Account :</strong> <textarea className="form-control" id="textAreaExample2" rows="2" disabled defaultValue={data.account}></textarea></p>
                
                {/* <p className="lg:text-lg sm:text-sm">Account: 
                {data.account &&
                `${data.account.slice(0, 6)}...${data.account.slice(
                  data.account.length - 6,
                  data.account.length
                )}`}
                </p> */}
                <p>
                  <strong>Balance :</strong> <span className="btn bg-light text-dark">{data.balance && parseFloat(data.balance).toFixed(4)}{" "} ETH</span>
                </p>
                <p><strong>Network : <i>{data.network} network</i></strong></p>
              </Modal.Body>
              <Modal.Footer>
                {data.account === ownerAddress ? (
                  <a
                    className="btn btn-secondary mt-3"
                    href={"/owner-dashboard"}
                    role="button"
                  >
                    Dashboard
                  </a>
                ) : null}
                <button className="btn btn-danger mt-3" onClick={Disconnect}>
                  Disconnect
                </button>
              </Modal.Footer>
            </Modal>
          </>
        ) : (
          <>
            <button
              className="btn btn-danger m-2 rounded"
              onClick={switchNetwork}
            >
              Wrong Network
            </button>
          </>
        )
      ) : (
        <button
          className="btn btn-secondary m-2 rounded"
          onClick={fetchAccountData}
          src=""
        >
          Connect Wallet
        </button>
      )}
    </>
  );
}

export default Connect;
