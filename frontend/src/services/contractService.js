import { ethers } from 'ethers';
import TFASABI from '../abi/contractABI.json';
import FundAllocationABI from '../abi/FundAllocationABI.json';

class ContractService {
  constructor() {
    this.initializeContracts();
  }

  async initializeContracts() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      this.tfasContract = new ethers.Contract(
        process.env.REACT_APP_CONTRACT_ADDRESS, // Updated TFAS address
        TFASABI.abi,
        provider
      );
      this.fundAllocationContract = new ethers.Contract(
        process.env.REACT_APP_FUND_ALLOCATION_ADDRESS, // Updated FundAllocation address
        FundAllocationABI.abi,
        provider
      );
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    }
  }

  async getTotalFunds() {
    return await this.fundAllocationContract.totalFunds();
  }

  async allocateFunds(amount) {
    const signer = this.fundAllocationContract.provider.getSigner();
    const tx = await this.fundAllocationContract.connect(signer).allocateFunds(amount);
    await tx.wait();
  }

  async createProject(name, budget, timeline) {
    try {
      const signer = this.tfasContract.provider.getSigner();
      const tx = await this.tfasContract.createProject(name, budget, timeline, signer);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  async getProjects() {
    try {
      const projects = await this.tfasContract.getProjects();
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
      const signer = this.tfasContract.provider.getSigner();
      const tx = await this.tfasContract.connect(signer).submitFeedback(projectId, feedback);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  }
}

export default new ContractService();
