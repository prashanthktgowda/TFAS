const express = require("express");
const router = express.Router();
const controller = require("./controller");

// Create a new project
router.post("/create-project", async (req, res) => {
  const { name, budget, fromAddress } = req.body;
  try {
    const result = await controller.createProject(name, budget, fromAddress);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit a milestone
router.post("/submit-milestone", async (req, res) => {
  const { projectId, description, fromAddress } = req.body;
  try {
    const result = await controller.submitMilestone(projectId, description, fromAddress);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify a milestone
router.post("/verify-milestone", async (req, res) => {
  const { projectId, milestoneId, fromAddress } = req.body;
  try {
    const result = await controller.verifyMilestone(projectId, milestoneId, fromAddress);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all projects
router.get("/projects", async (req, res) => {
  try {
    const projects = await controller.getProjects();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;