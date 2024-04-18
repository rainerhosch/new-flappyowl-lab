const hre = require("hardhat");
const fs = require("fs");
const fse = require("fs-extra");

async function main() {
    const deployNetwork = hre.network.name;
    const governorContractAddress = "0x78D3eCc18603C270Eb750B5e3fDd10440b40927E";
    const stakingPoolNFTContractAddress = "0x6622fF9F092F9c9cfD975aF152F98a6a09319437";
    const StakingPoolNFTContract = await hre.ethers.getContractAt("NftStakingPool", stakingPoolNFTContractAddress);
    const set_controller = await StakingPoolNFTContract.setController(governorContractAddress);
    console.log("Set Controller of Staking NFT Pool :", governorContractAddress, "\n Tx Hash: ", set_controller.hash);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
