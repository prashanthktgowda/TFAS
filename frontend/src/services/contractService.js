import { ethers } from 'ethers';
import ContractHelper from '../../../backend/tfas-smart-contracts/utils/contractHelper'; // Correct path

class TFASService {
  constructor() {
    this.initializeContract();
  }

  async initializeContract() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      this.contractHelper = new ContractHelper(provider);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    }
  }

  async createProject(name, budget, timeline) {
    try {
      const signer = this.contractHelper.provider.getSigner();
      const tx = await this.contractHelper.createProject(name, budget, timeline, signer);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  async getProjects() {
    try {
      const projects = await this.contractHelper.getProjects();
      return projects.map(project => ({
        id: project.id.toString(),
        name: project.name,
        budget: ethers.utils.formatEther(project.budget),
        status: project.status,
        timeline: project.timeline,
        owner: project.owner
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  async submitFeedback(projectId, feedback) {
    try {
      const signer = this.contractHelper.provider.getSigner();
      const tx = await this.contractHelper.contract.connect(signer).submitFeedback(projectId, feedback);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  }
}

export default new TFASService();
