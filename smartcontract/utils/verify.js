// we can't have these functions in our `helper-hardhat-config`
// since these use the hardhat library
// and it would be a circular dependency
// const { run } = require("hardhat"); //deprected
// const { run } = require("@nomicfoundation/hardhat-verify");

const verify = async (contractAddress, args, contractsolname, contractname) => {
  console.log("Verifying contract...");
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
      contract: `contracts/${contractsolname}.sol:${contractname}`,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!");
    } else {
      console.log(e);
    }
  }
};

module.exports = {
  verify,
};
