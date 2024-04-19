const hre = require("hardhat");
const fs = require("fs");
const fse = require("fs-extra");

async function main() {
    const deployNetwork = hre.network.name;
    const governorContractAddress = "0x78D3eCc18603C270Eb750B5e3fDd10440b40927E";
    const governorContract = await hre.ethers.getContractAt("FlappyOwlGovernor", governorContractAddress);
    const mint_genesis = await governorContract._genesisSupplyFRC();
    console.log("Genesis supply FRC has minted by :", governorContractAddress, "\n on Tx Hash: ", mint_genesis.hash);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
