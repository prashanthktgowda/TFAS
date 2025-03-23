// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FundAllocation {
    uint256 public totalFunds;
    uint256 public allocatedFunds;
    uint256 public spentFunds;
    address public admin;

    constructor() {
        admin = msg.sender;
        totalFunds = 0;
        allocatedFunds = 0;
        spentFunds = 0;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function addFunds(uint256 amount) public onlyAdmin {
        totalFunds += amount;
    }

    function allocateFunds(uint256 amount) public onlyAdmin {
        require(amount <= totalFunds - allocatedFunds, "Insufficient funds");
        allocatedFunds += amount;
    }

    function spendFunds(uint256 amount) public onlyAdmin {
        require(amount <= allocatedFunds - spentFunds, "Insufficient allocated funds");
        spentFunds += amount;
    }
}
