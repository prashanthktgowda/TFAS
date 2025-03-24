const { expect } = require("chai");

describe("UserManagement", function () {
  let userManagement, admin, user;

  beforeEach(async function () {
    [admin, user] = await ethers.getSigners();
    const UserManagement = await ethers.getContractFactory("UserManagement");
    userManagement = await UserManagement.deploy();
    await userManagement.deployed();
  });

  it("should allow a user to register", async function () {
    await userManagement.connect(user).registerUser("user@example.com", 1); // Role: Auditor
    const registeredUser = await userManagement.users(user.address);
    expect(registeredUser.email).to.equal("user@example.com");
    expect(registeredUser.role).to.equal(1); // Auditor
    expect(registeredUser.isApproved).to.equal(false);
  });

  it("should allow admin to approve a user", async function () {
    await userManagement.connect(user).registerUser("user@example.com", 1); // Role: Auditor
    await userManagement.connect(admin).approveUser(user.address);
    const registeredUser = await userManagement.users(user.address);
    expect(registeredUser.isApproved).to.equal(true);
  });

  it("should verify if a user is authorized", async function () {
    await userManagement.connect(user).registerUser("user@example.com", 1); // Role: Auditor
    await userManagement.connect(admin).approveUser(user.address);
    const isAuthorized = await userManagement.connect(user).isUserAuthorized("user@example.com");
    expect(isAuthorized).to.equal(true);
  });
});
