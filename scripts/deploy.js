const Web3 = require('web3');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function deployContract() {
    const web3 = new Web3(process.env.BLOCKCHAIN_PROVIDER);
    
    // Read contract source and compile it
    const contractPath = path.join(__dirname, '../contracts/FundAllocation.sol');
    const source = fs.readFileSync(contractPath, 'utf8');
    
    // Get contract ABI and bytecode (you'll need to compile the contract first)
    const contractJSON = require('../build/contracts/FundAllocation.json');
    const abi = contractJSON.abi;
    const bytecode = contractJSON.bytecode;

    // Get the deployer account
    const accounts = await web3.eth.getAccounts();
    const deployer = accounts[0];

    // Deploy the contract
    const contract = new web3.eth.Contract(abi);
    const deploy = contract.deploy({
        data: bytecode
    });

    const gas = await deploy.estimateGas();
    const deployed = await deploy.send({
        from: deployer,
        gas: gas
    });

    // Save the deployed contract address
    const deployedAddress = deployed.options.address;
    console.log('Contract deployed to:', deployedAddress);

    // Update .env file with new contract address
    const envPath = path.join(__dirname, '../backend/.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    envContent = envContent.replace(
        /CONTRACT_ADDRESS=.*/,
        `CONTRACT_ADDRESS=${deployedAddress}`
    );
    fs.writeFileSync(envPath, envContent);

    return deployedAddress;
}

deployContract()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
