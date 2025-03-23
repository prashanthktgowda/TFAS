const path = require('path');
const fs = require('fs');
const solc = require('solc');

function compileContract() {
    const contractPath = path.resolve(__dirname, '../contracts/FundAllocation.sol');
    const source = fs.readFileSync(contractPath, 'utf8');

    const input = {
        language: 'Solidity',
        sources: {
            'FundAllocation.sol': {
                content: source,
            },
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*'],
                },
            },
        },
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    const contract = output.contracts['FundAllocation.sol']['FundAllocation'];

    // Ensure build directory exists
    const buildPath = path.resolve(__dirname, '../build/contracts');
    if (!fs.existsSync(buildPath)) {
        fs.mkdirSync(buildPath, { recursive: true });
    }

    // Write the contract artifacts
    fs.writeFileSync(
        path.resolve(buildPath, 'FundAllocation.json'),
        JSON.stringify({
            abi: contract.abi,
            bytecode: contract.evm.bytecode.object
        }, null, 2)
    );

    console.log('Contract compiled successfully');
}

compileContract();
