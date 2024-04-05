const hre = require("hardhat");
const fs = require("fs");
const fse = require("fs-extra");
const { verify } = require("../utils/verify");
const {
  getAmountInWei,
  developmentChains,
} = require("../utils/helper-scripts");

async function main() {
  const deployNetwork = hre.network.name;

  // NftFactoryDescriptor is NFT Descriptor contract
  const DescriptorContract = await ethers.getContractFactory("NftDescriptor");
  const descriptorContract = await DescriptorContract.deploy();
  await descriptorContract.deployed();

  // Deploy FlappyOwlNftTestnet contract
  // const maxSupply = 69069;
  // const mintCost = getAmountInWei(0.5);
  // const maxMintAmountPerTx = 10;
  // const mintLimit = 10;
  // const mintingStatus = true;
  // const updatableSeed = true;

  const NFTContract = await ethers.getContractFactory("FlappyOwlNftTestnet");
  const nftContract = await NFTContract.deploy(descriptorContract.address);
  await nftContract.deployed();

  // Deploy FlappyRewardCoin ERC20 token contract
  const TokenContract = await ethers.getContractFactory("FlappyRewardCoin");
  const tokenContract = await TokenContract.deploy();

  await tokenContract.deployed();

  // Deploy FlappyOwlVault contract
  const Vault = await ethers.getContractFactory("FlappyOwlVault");
  const stakingVault = await Vault.deploy(
    nftContract.address,
    tokenContract.address
  );

  await stakingVault.deployed();

  const control_tx = await tokenContract.setController(
    stakingVault.address,
    true
  );
  await control_tx.wait();

  console.log(
    "NFT Descriptor contract deployed at:\n",
    descriptorContract.address
  );
  console.log("StakeableNFT NFT contract deployed at:\n", nftContract.address);
  console.log(
    "StakeRewardCoin ERC20 token contract deployed at:\n",
    tokenContract.address
  );
  console.log("NFT Staking Vault deployed at:\n", stakingVault.address);
  console.log("Network deployed to :\n", deployNetwork);

  /* transfer contracts addresses & ABIs to the front-end */
  if (fs.existsSync("../dapp/src")) {
    fs.rmSync("../src/artifacts", { recursive: true, force: true });
    fse.copySync("./artifacts/contracts", "../dapp/src/artifacts");
    fs.writeFileSync(
      "../dapp/src/utils/contracts-config.js",
      `
      export const vaultContractAddress = "${stakingVault.address}"
      export const nftContractAddress = "${nftContract.address}"
      export const tokenContractAddress = "${tokenContract.address}"
      export const ownerAddress = "${stakingVault.signer.address}"
      export const networkDeployedTo = "${hre.network.config.chainId}"
    `
    );
  }

  if (!developmentChains.includes(deployNetwork)) {
    console.log("waiting for 6 blocks verification ...");
    await stakingVault.deployTransaction.wait(6);

    // args represent contract constructor arguments
    const args = [nftContract.address, tokenContract.address];
    await verify(
      stakingVault.address,
      args,
      "FlappyOwlVault",
      "FlappyOwlVault"
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
