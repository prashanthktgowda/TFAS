const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TFAS", function () {
  let TFAS;
  let tfas;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    TFAS = await ethers.getContractFactory("TFAS");
    tfas = await TFAS.deploy();
    await tfas.deployed();
  });

  describe("Project Creation", function () {
    it("Should create a new project", async function () {
      await tfas.createProject("Test Project", 1000, "3 months");
      const projects = await tfas.getProjects();
      expect(projects.length).to.equal(1);
      expect(projects[0].name).to.equal("Test Project");
    });
  });
});
