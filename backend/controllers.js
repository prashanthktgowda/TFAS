// Import necessary libraries
const Web3 = require("web3");
const TFAS_ABI = require("../abi/TFAS.json"); // ABI for your deployed smart contract
const { MNEMONIC, INFURA_PROJECT_ID } = process.env; // Load environment variables
const HDWalletProvider = require("@truffle/hdwallet-provider");

// Initialize Web3 provider
const provider = new HDWalletProvider(MNEMONIC, `https://goerli.infura.io/v3/${INFURA_PROJECT_ID}`);
const web3 = new Web3(provider);

// Contract address (replace with your deployed contract address)
const CONTRACT_ADDRESS = "0xYourContractAddressHere";

// Create a contract instance
const tfasContract = new web3.eth.Contract(TFAS_ABI, CONTRACT_ADDRESS);

// Exported Functions

/**
 * Create a new public development project.
 * @param {string} name - Name of the project.
 * @param {number} budget - Budget allocated for the project.
 * @param {string} fromAddress - Address of the government official creating the project.
 * @returns {Promise<string>} Transaction receipt or error message.
 */
exports.createProject = async (name, budget, fromAddress) => {
  try {
    const tx = await tfasContract.methods
      .createProject(name, budget)
      .send({ from: fromAddress, gas: 4500000 });
    return tx;
  } catch (error) {
    console.error("Error creating project:", error.message);
    throw new Error("Failed to create project.");
  }
};

/**
 * Submit a milestone for a project.
 * @param {number} projectId - ID of the project.
 * @param {string} description - Description of the milestone.
 * @param {string} fromAddress - Address of the contractor submitting the milestone.
 * @returns {Promise<string>} Transaction receipt or error message.
 */
exports.submitMilestone = async (projectId, description, fromAddress) => {
  try {
    const tx = await tfasContract.methods
      .submitMilestone(projectId, description)
      .send({ from: fromAddress, gas: 4500000 });
    return tx;
  } catch (error) {
    console.error("Error submitting milestone:", error.message);
    throw new Error("Failed to submit milestone.");
  }
};

/**
 * Verify a milestone and release payment.
 * @param {number} projectId - ID of the project.
 * @param {number} milestoneId - ID of the milestone to verify.
 * @param {string} fromAddress - Address of the auditor verifying the milestone.
 * @returns {Promise<string>} Transaction receipt or error message.
 */
exports.verifyMilestone = async (projectId, milestoneId, fromAddress) => {
  try {
    const tx = await tfasContract.methods
      .verifyMilestone(projectId, milestoneId)
      .send({ from: fromAddress, gas: 4500000 });
    return tx;
  } catch (error) {
    console.error("Error verifying milestone:", error.message);
    throw new Error("Failed to verify milestone.");
  }
};

/**
 * Fetch all projects from the blockchain.
 * @returns {Promise<Array>} List of projects with their details.
 */
exports.getProjects = async () => {
  try {
    const projects = await tfasContract.methods.getProjects().call();
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error.message);
    throw new Error("Failed to fetch projects.");
  }
};

/**
 * Fetch details of a specific project by ID.
 * @param {number} projectId - ID of the project.
 * @returns {Promise<Object>} Project details.
 */
exports.getProjectDetails = async (projectId) => {
  try {
    const project = await tfasContract.methods.getProjectDetails(projectId).call();
    return project;
  } catch (error) {
    console.error("Error fetching project details:", error.message);
    throw new Error("Failed to fetch project details.");
  }
};

/**
 * Fetch milestones for a specific project.
 * @param {number} projectId - ID of the project.
 * @returns {Promise<Array>} List of milestones for the project.
 */
exports.getMilestones = async (projectId) => {
  try {
    const milestones = await tfasContract.methods.getMilestones(projectId).call();
    return milestones;
  } catch (error) {
    console.error("Error fetching milestones:", error.message);
    throw new Error("Failed to fetch milestones.");
  }
};

/**
 * Provide feedback on a project as a citizen.
 * @param {number} projectId - ID of the project.
 * @param {string} feedback - Feedback provided by the citizen.
 * @param {string} fromAddress - Address of the citizen providing feedback.
 * @returns {Promise<string>} Transaction receipt or error message.
 */
exports.provideFeedback = async (projectId, feedback, fromAddress) => {
  try {
    const tx = await tfasContract.methods
      .provideFeedback(projectId, feedback)
      .send({ from: fromAddress, gas: 4500000 });
    return tx;
  } catch (error) {
    console.error("Error providing feedback:", error.message);
    throw new Error("Failed to provide feedback.");
  }
};