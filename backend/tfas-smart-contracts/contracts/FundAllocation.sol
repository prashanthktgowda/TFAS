// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FundAllocation {
    uint256 public totalAvailableFunds; // Renamed from totalFunds
    uint256 public allocatedFunds;
    uint256 public spentFunds;
    address public admin;

    constructor() {
        admin = msg.sender;
        totalAvailableFunds = 0;
        allocatedFunds = 0;
        spentFunds = 0;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function addFunds(uint256 amount) public onlyAdmin {
        totalAvailableFunds += amount; // Updated to use the renamed variable
    }

    function allocateFunds(uint256 amount) public onlyAdmin {
        require(amount <= totalAvailableFunds - allocatedFunds, "Insufficient funds");
        allocatedFunds += amount;
    }

    function spendFunds(uint256 amount) public onlyAdmin {
        require(amount <= allocatedFunds - spentFunds, "Insufficient allocated funds");
        spentFunds += amount;
    }

    /**
     * @dev Returns the total funds available. If no funds are available, returns 0.
     */
    function totalFunds() public view returns (uint256) {
        return totalAvailableFunds; // Simply return the current total funds without reverting
    }
}

