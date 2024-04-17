const hre = require("hardhat");
const fs = require("fs");
const fse = require("fs-extra");
// const { verify } = require("../utils/verify");
const {
  getAmountInWei,
  developmentChains,
} = require("../utils/helper-scripts");

async function main() {
  const deployNetwork = hre.network.name;

  /**------------------------------------------------------------------**
   * Deploy contract nft image factory
   */
  const DescriptorContract = await ethers.getContractFactory("NftFactory");
  const descriptorContract = await DescriptorContract.deploy();
  await descriptorContract.deployed();
  console.log("NFT Descriptor contract deployed at:\n",descriptorContract.address);

  // Deploy FlappyOwlNftTestnet contract
  // const maxSupply = 69069;
  // const mintCost = getAmountInWei(0.5);
  // const maxMintAmountPerTx = 10;
  // const mintLimit = 10;
  // const mintingStatus = true;
  // const updatableSeed = true;

  /**------------------------------------------------------------------**
   * Deploy FlappyOwl NFT token contract
   */
  const NFTContract = await ethers.getContractFactory("FlappyOwlNftTestnet");
  const nftContract = await NFTContract.deploy(descriptorContract.address);
  await nftContract.deployed();
  console.log("FlappyOwl NFT contract deployed at:\n", nftContract.address);
  /**------------------------------------------------------------------**
   * Deploy FRC ERC20 token contract
   */
  const TokenContract = await ethers.getContractFactory("FRC");
  const tokenContract = await TokenContract.deploy();
  await tokenContract.deployed();
  console.log("FRC token contract deployed at:\n",tokenContract.address);
  /**------------------------------------------------------------------**
   * Deploy LiquidityPool Contract
   */
  const LiquidityPoolContract = await ethers.getContractFactory("LiquidityPool");
  const lpPoolContract = await LiquidityPoolContract.deploy(tokenContract.address);
  await lpPoolContract.deployed();
  console.log("LiquidityPool Contract deployed at:\n",lpPoolContract.address);
  /**------------------------------------------------------------------**
   * Deploy Nft Staking Pool Contract
   */
  const StakingPoolNFTContract = await ethers.getContractFactory("NftStakingPool");
  const nftPoolContract = await StakingPoolNFTContract.deploy(nftContract.address);
  await nftPoolContract.deployed();
  console.log("Nft Staking Pool Contract deployed at:\n",nftPoolContract.address);

  /**------------------------------------------------------------------**
   * Deploy FlappyOwl Governor contract
   */
  // const param = [tokenContract.address, lpPoolContract.address, nftPoolContract.address, 100000];
  const GovernorContract = await ethers.getContractFactory("FlappyOwlGovernor");
  const governorContract = await GovernorContract.deploy(tokenContract.address, lpPoolContract.address, nftPoolContract.address, 100000);
  await governorContract.deployed();
  console.log("FlappyOwl Governor contract deployed at:\n", governorContract.address);
  /**------------------------------------------------------------------**
   * Set controller contract
   */
  const control_tx = await tokenContract.setController(
    governorContract.address
  );
  await control_tx.wait();
  console.log("Set FRC Controller :\n", governorContract.address);
  const setMinterTx = await tokenContract.setMinter(
    governorContract.address
  );
  await setMinterTx.wait();
  console.log("Set FRC Minter to :\n", governorContract.address);
  console.log("Network deployed to :\n", deployNetwork);

  /* transfer contracts addresses & ABIs to the front-end */
  if (fs.existsSync("../dapp/src")) {
    fs.rmSync("../src/artifacts", { recursive: true, force: true });
    fse.copySync("./artifacts/contracts", "../dapp/src/artifacts");
    fs.writeFileSync(
      "../dapp/src/utils/contracts-config.js",
      `
      export const governorContractAddress = "${governorContract.address}"
      export const liquidityPoolContractAddress = "${lpPoolContract.address}"
      export const stakingPoolNFTContractAddress = "${nftPoolContract.address}"
      export const nftContractAddress = "${nftContract.address}"
      export const tokenContractAddress = "${tokenContract.address}"
      export const ownerAddress = "${governorContract.signer.address}"
      export const networkDeployedTo = "${hre.network.config.chainId}"
    `
    );
  }

  // if (!developmentChains.includes(deployNetwork)) {
  //   console.log("waiting for 6 blocks verification ...");
  //   await governorContract.deployTransaction.wait(6);

  //   // args represent contract constructor arguments
  //   const args = [tokenContract.address, lpPoolContract.address, nftPoolContract.address, 100000];
  //   await verify(
  //     governorContract.address,
  //     args,
  //     "FlappyOwlGovernor",
  //     "FlappyOwlGovernor"
  //   );
  // }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
