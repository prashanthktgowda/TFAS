// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TFAS {
    // Events
    event ProjectCreated(uint indexed projectId, string name, address owner);
    event ProjectStatusUpdated(uint indexed projectId, string newStatus);
    event FeedbackSubmitted(uint indexed projectId, string feedback);
    event InvoiceGenerated(uint indexed projectId, uint milestoneId, uint amount, address contractor);
    event ClarificationRequested(uint indexed projectId, string message, address requester);
    
    // Struct to represent a Project
    struct Project {
        uint id;           // Unique ID for the project
        string name;       // Name of the project
        uint budget;       // Budget allocated for the project
        string status;     // Current status of the project (e.g., "In Progress", "Completed")
        string[] feedbacks; // Array to store feedback for the project
        string timeline;   // Timeline or duration of the project
        address owner;     // Added owner field
    }

    // Array to store all projects
    Project[] public projects;

    // Counter to assign unique IDs to projects
    uint public projectId;

    // Array to store notifications (e.g., updates or milestones)
    string[] public notifications;

    // Mapping from project ID to owner address
    mapping(uint => address) public projectOwners;

    // Mapping to track received funds for contractors
    mapping(address => uint) public receivedFunds;

    /**
     * @dev Constructor to initialize the contract.
     */
    constructor() {
        projectId = 0; // Initialize project ID counter
    }

    /**
     * @dev Function to create a new project.
     * @param _name Name of the project.
     * @param _budget Budget allocated for the project.
     * @param _timeline Timeline or duration of the project.
     */
    function createProject(
        string memory _name,
        uint _budget,
        string memory _timeline
    ) public {
        require(bytes(_name).length > 0, "Project name cannot be empty");
        require(_budget > 0, "Budget must be greater than zero");
        require(bytes(_timeline).length > 0, "Timeline cannot be empty");

        projectId++;
        projects.push(Project(projectId, _name, _budget, "In Progress", new string[](0), _timeline, msg.sender));
        projectOwners[projectId] = msg.sender;
        addNotification(string(abi.encodePacked("New project created: ", _name)));
        emit ProjectCreated(projectId, _name, msg.sender);
    }

    /**
     * @dev Function to retrieve all projects.
     * @return An array of all projects.
     */
    function getProjects() public view returns (Project[] memory) {
        return projects;
    }

    /**
     * @dev Function to get a specific project by ID.
     * @param _projectId The ID of the project to retrieve.
     */
    function getProjectById(uint _projectId) public view returns (Project memory) {
        require(_projectId > 0 && _projectId <= projectId, "Invalid project ID");
        return projects[_projectId - 1];
    }

    /**
     * @dev Function to submit feedback for a specific project.
     * @param _projectId The ID of the project.
     * @param _feedback The feedback message.
     */
    function submitFeedback(uint _projectId, string memory _feedback) public {
        require(_projectId > 0 && _projectId <= projectId, "Invalid project ID");
        require(bytes(_feedback).length > 0, "Feedback cannot be empty");

        projects[_projectId - 1].feedbacks.push(_feedback);
        emit FeedbackSubmitted(_projectId, _feedback);
    }

    /**
     * @dev Function to update project status.
     * @param _projectId The ID of the project.
     * @param _newStatus The new status to set.
     */
    function updateProjectStatus(uint _projectId, string memory _newStatus) public {
        require(_projectId > 0 && _projectId <= projectId, "Invalid project ID");
        require(projectOwners[_projectId] == msg.sender, "Only project owner can update status");
        
        projects[_projectId - 1].status = _newStatus;
        addNotification(string(abi.encodePacked("Project ", uint2str(_projectId), " status updated to: ", _newStatus)));
        emit ProjectStatusUpdated(_projectId, _newStatus);
    }

    /**
     * @dev Function to get all feedbacks for a specific project.
     * @param _projectId The ID of the project.
     */
    function getProjectFeedbacks(uint _projectId) public view returns (string[] memory) {
        require(_projectId > 0 && _projectId <= projectId, "Invalid project ID");
        return projects[_projectId - 1].feedbacks;
    }

    /**
     * @dev Function to add a notification.
     * @param _notification The notification message.
     */
    function addNotification(string memory _notification) public {
        notifications.push(_notification);
    }

    /**
     * @dev Returns all notifications.
     */
    function getNotifications() public view returns (string[] memory) {
        return notifications; // Ensure this does not revert
    }

    /**
     * @dev Function to calculate the total funds allocated across all projects.
     * @return The total budget of all projects.
     */
    function totalFunds() public view returns (uint) {
        require(projects.length > 0, "No projects available to calculate total funds.");
        uint total = 0;
        for (uint i = 0; i < projects.length; i++) {
            total += projects[i].budget;
        }
        return total;
    }

    /**
     * @dev Function to generate an invoice for a specific milestone.
     * @param _projectId The ID of the project.
     * @param _milestoneId The ID of the milestone.
     * @param _amount The amount for the invoice.
     */
    function generateInvoice(uint _projectId, uint _milestoneId, uint _amount) public {
        require(_projectId > 0 && _projectId <= projectId, "Invalid project ID");
        require(_amount > 0, "Amount must be greater than zero");
        require(projectOwners[_projectId] == msg.sender, "Only the project owner can generate an invoice");

        // Emit the invoice generation event
        emit InvoiceGenerated(_projectId, _milestoneId, _amount, msg.sender);
    }

    /**
     * @dev Function to get the received funds for a contractor.
     * @param contractor The address of the contractor.
     * @return The amount of funds received by the contractor.
     */
    function getReceivedFunds(address contractor) public view returns (uint) {
        require(contractor != address(0), "Invalid contractor address");
        return receivedFunds[contractor];
    }

    /**
     * @dev Function to request clarification for a project.
     * @param _projectId The ID of the project.
     * @param _message The clarification message.
     */
    function requestClarification(uint _projectId, string memory _message) public {
        require(_projectId > 0 && _projectId <= projectId, "Invalid project ID");
        require(bytes(_message).length > 0, "Message cannot be empty");

        emit ClarificationRequested(_projectId, _message, msg.sender);
    }

    /**
     * @dev Helper function to convert uint to string.
     * @param _value The uint value to convert.
     * @return The string representation of the uint value.
     */
    function uint2str(uint _value) internal pure returns (string memory) {
        if (_value == 0) {
            return "0";
        }
        uint temp = _value;
        uint digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (_value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint(_value % 10)));
            _value /= 10;
        }
        return string(buffer);
    }
}