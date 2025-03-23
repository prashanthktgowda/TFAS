const { ethers } = require('ethers');
const ContractHelper = require('../../tfas-smart-contracts/utils/contractHelper');
const config = require('../config');

class BlockchainService {
  constructor() {
    const provider = new ethers.providers.JsonRpcProvider(config.ganacheUrl);
    this.contractHelper = new ContractHelper(provider);
  }

  async syncProjectsToDatabase(db) {
    try {
      const projects = await this.contractHelper.getProjects();
      for (const project of projects) {
        await db.collection('projects').updateOne(
          { projectId: project.id.toString() },
          {
            $set: {
              name: project.name,
              budget: ethers.utils.formatEther(project.budget),
              status: project.status,
              timeline: project.timeline,
              owner: project.owner,
              lastUpdated: new Date()
            }
          },
          { upsert: true }
        );
      }
    } catch (error) {
      console.error('Error syncing projects:', error);
      throw error;
    }
  }

  async listenToContractEvents() {
    this.contractHelper.contract.on('ProjectCreated', async (projectId, name, owner) => {
      console.log(`New project created: ${name} by ${owner}`);
      await this.syncProjectsToDatabase();
    });

    this.contractHelper.contract.on('FeedbackSubmitted', async (projectId, feedback) => {
      console.log(`New feedback for project ${projectId}: ${feedback}`);
    });
  }
}

module.exports = new BlockchainService();
