const TFAS = artifacts.require("TFAS"); // Replace "TFAS" with the exact name of your smart contract

module.exports = function (deployer) {
  // Deploy the TFAS contract
  deployer.deploy(TFAS);
};