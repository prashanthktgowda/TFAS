// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TFAS {
    // Struct to represent a Project
    struct Project {
        uint id;           // Unique ID for the project
        string name;       // Name of the project
        uint budget;       // Budget allocated for the project
        string status;     // Current status of the project (e.g., "In Progress", "Completed")
        string[] feedbacks; // Array to store feedback for the project
        string timeline;   // Timeline or duration of the project
    }

    // Array to store all projects
    Project[] public projects;

    // Counter to assign unique IDs to projects
    uint public projectId;

    // Array to store notifications (e.g., updates or milestones)
    string[] public notifications;

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
        require(_budget > 0, "Budget must be greater than zero");
        projectId++;
        projects.push(Project(projectId, _name, _budget, "In Progress", new string[](0), _timeline));
        addNotification(string(abi.encodePacked("New project created: ", _name)));
    }

    /**
     * @dev Function to retrieve all projects.
     * @return An array of all projects.
     */
    function getProjects() public view returns (Project[] memory) {
        return projects;
    }

    /**
     * @dev Function to submit feedback for a specific project.
     * @param _projectId The ID of the project.
     * @param _feedback The feedback message.
     */
    function submitFeedback(uint _projectId, string memory _feedback) public {
        require(_projectId > 0 && _projectId <= projectId, "Invalid project ID");
        projects[_projectId - 1].feedbacks.push(_feedback);
        addNotification(string(abi.encodePacked("Feedback received for project ID ", uint2str(_projectId))));
    }

    /**
     * @dev Function to add a notification.
     * @param _notification The notification message.
     */
    function addNotification(string memory _notification) public {
        notifications.push(_notification);
    }

    /**
     * @dev Function to retrieve all notifications.
     * @return An array of all notifications.
     */
    function getNotifications() public view returns (string[] memory) {
        return notifications;
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