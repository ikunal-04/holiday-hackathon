// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract HabitTracker {
    IERC20 public immutable grassToken;
    address public immutable rewardAddress;
    
    struct Participant {
        uint256 stakedAmount;
        uint256 dailyVotesReceived;
        uint256 successfulDays;
        string habit;
        bool isEnrolled;
        uint256 enrollmentTime;
        uint256 habitDuration;
        mapping(uint256 => bool) votesCast;
    }
    
    mapping(address => Participant) public participants;
    address[] public participantList;

    event Staked(address indexed user, uint256 amount, string habit, uint256 habitDuration);
    event Voted(address indexed voter, address indexed votedFor, uint256 day, uint8 voteValue);
    event RewardClaimed(address indexed user, uint256 successfulDays, uint256 totalDays);

    constructor(address _grassToken, address _rewardAddress) {
        require(_grassToken != address(0), "Invalid token address");
        require(_rewardAddress != address(0), "Invalid reward address");
        grassToken = IERC20(_grassToken);
        rewardAddress = _rewardAddress;
    }

    modifier onlyEnrolled() {
        require(participants[msg.sender].isEnrolled, "You are not enrolled in any habit");
        _;
    }

    function stake(uint256 amount, string calldata habit, uint256 habitDuration) external {
        require(amount > 0, "Stake amount must be greater than zero");
        require(!participants[msg.sender].isEnrolled, "Already enrolled in a habit");
        require(habitDuration > 0, "Duration must be greater than zero");
        require(bytes(habit).length > 0, "Habit description cannot be empty");
        
        // Check allowance and balance before transfer
        require(grassToken.balanceOf(msg.sender) >= amount, "Insufficient token balance");
        
        // Transfer tokens from the user to the reward address
        bool success = grassToken.transferFrom(msg.sender, rewardAddress, amount);
        require(success, "Token transfer failed");

        participants[msg.sender].stakedAmount = amount;
        participants[msg.sender].dailyVotesReceived = 0;
        participants[msg.sender].successfulDays = 0;
        participants[msg.sender].habit = habit;
        participants[msg.sender].isEnrolled = true;
        participants[msg.sender].enrollmentTime = block.timestamp;
        participants[msg.sender].habitDuration = habitDuration;

        participantList.push(msg.sender);

        emit Staked(msg.sender, amount, habit, habitDuration);
    }

    function vote(address participantAddress, uint8 voteValue) external onlyEnrolled {
        require(voteValue == 1 || voteValue == 0, "Invalid vote value. Use 1 for yes and 0 for no");
        require(participants[participantAddress].isEnrolled, "Participant is not enrolled");
        require(participantAddress != msg.sender, "Cannot vote for yourself");
        
        uint256 currentDay = (block.timestamp - participants[participantAddress].enrollmentTime) / 1 days;
        require(currentDay < participants[participantAddress].habitDuration, "Voting period has ended");
        require(!participants[msg.sender].votesCast[currentDay], "You have already voted today");

        participants[participantAddress].dailyVotesReceived += voteValue;
        participants[msg.sender].votesCast[currentDay] = true;

        uint256 requiredVotes = (participantList.length - 1) / 2; // Exclude self from voting requirement
        if (participants[participantAddress].dailyVotesReceived > requiredVotes) {
            participants[participantAddress].successfulDays += 1;
            participants[participantAddress].dailyVotesReceived = 0; // Reset daily votes
        }

        emit Voted(msg.sender, participantAddress, currentDay, voteValue);
    }

    function claimReward() external onlyEnrolled {
        Participant storage participant = participants[msg.sender];
        uint256 habitDuration = participant.habitDuration;
        require(block.timestamp >= participant.enrollmentTime + habitDuration * 1 days, "Habit period is not over");

        uint256 totalSuccessfulDays = participant.successfulDays;
        require(totalSuccessfulDays > habitDuration / 2, "You did not complete more than 50% of the habit");

        // Mark as unenrolled before external calls
        participant.isEnrolled = false;

        // Remove from participant list
        for (uint256 i = 0; i < participantList.length; i++) {
            if (participantList[i] == msg.sender) {
                participantList[i] = participantList[participantList.length - 1];
                participantList.pop();
                break;
            }
        }

        emit RewardClaimed(msg.sender, totalSuccessfulDays, habitDuration);
    }

    function getParticipantCount() external view returns (uint256) {
        return participantList.length;
    }
}
