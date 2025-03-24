// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserManagement {
    enum Role { Official, Auditor, Contractor }

    struct User {
        string email;
        Role role;
        bool isApproved;
    }

    mapping(address => User) public users;
    address public admin;

    constructor() {
        admin = msg.sender; // Set the deployer as the admin
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action.");
        _;
    }

    function registerUser(string memory email, Role role) public {
        require(bytes(email).length > 0, "Email is required.");
        users[msg.sender] = User(email, role, false);
    }

    function approveUser(address userAddress) public onlyAdmin {
        require(bytes(users[userAddress].email).length > 0, "User does not exist.");
        users[userAddress].isApproved = true;
    }

    function isUserAuthorized(string memory email) public view returns (bool) {
        User memory user = users[msg.sender];
        return keccak256(abi.encodePacked(user.email)) == keccak256(abi.encodePacked(email)) && user.isApproved;
    }
}
