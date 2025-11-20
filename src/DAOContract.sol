// solidity
pragma solidity ^0.8.0;

import {Ownable} from "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import {IERC20} from "../lib/forge-std/src/interfaces/IERC20.sol";

contract DAOContract is Ownable {

    error EmptyDescription(string message);
    error ProposalNotFound(string message);
    error ProposalCanNotBeExecuted(string message);

    uint public constant VOTING_DURATION = 5 minutes;
    uint public constant QUORUM_PERCENTAGE = 1;

    event ProposalCreated(uint id, string description, uint256 createdAt);
    event ProposalExecuted(uint id, string description);
    /** @dev Struct to represent a proposal. */
    struct Proposal {
        uint id;
        string  description;
        bool executed;
        uint256 positiveVotes;
        uint256 negativeVotes;
        uint256 neutralVotes;
        uint256 deadline;
        address target;
        bytes _callData;
    }

    /** @dev The governance token used for voting. */
    IERC20 public immutable GOVERNANCE_TOKEN;
    /** @dev Mapping of proposal IDs to Proposal structs. */
    mapping(uint => Proposal) public proposals;
    /** @dev Mapping to track if an address has voted on a specific proposal. */
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    /** @dev Counter for proposal IDs. */
    uint public proposalCount = 0;

    modifier proposalExists(uint _id) {
        _proposalExists(_id);
        _;
    }

    constructor(address _governance)  Ownable (msg.sender){
        GOVERNANCE_TOKEN = IERC20(_governance);
    }

    function _proposalExists(uint _id) internal view {
        require(_id > 0 && _id <= proposalCount, ProposalNotFound("Proposal does not exist"));
    }

    function createProposal(string memory _description,   address _target, bytes calldata _callData) public onlyOwner {
        require(bytes(_description).length > 0, EmptyDescription("Description cannot be empty"));
        require(_target != address(0), "Invalid target address");
        require(_callData.length > 0, "Call data cannot be empty");

        proposalCount++;
        proposals[proposalCount] = Proposal({
            id: proposalCount,
            description: _description,
            deadline: block.timestamp + VOTING_DURATION,
            target: _target,
            executed: false,
            positiveVotes: 0,
            negativeVotes: 0,
            neutralVotes: 0,
            _callData: _callData
        });

        emit ProposalCreated(proposalCount, _description, block.timestamp);
    }

    function voteOnProposal(uint _id, uint8 _vote) public proposalExists(_id) {
        require(block.timestamp < proposals[_id].deadline, "Voting period has ended");
        require(!hasVoted[_id][msg.sender], "Already voted on this proposal");
        uint voterBalance = GOVERNANCE_TOKEN.balanceOf(msg.sender);
        require(voterBalance > 0, "No governance tokens to vote with");

        Proposal storage proposal = proposals[_id];

        if (_vote == 1) {
            proposal.positiveVotes += voterBalance;
        } else if (_vote == 2) {
            proposal.negativeVotes += voterBalance;
        } else if (_vote == 3) {
            proposal.neutralVotes += voterBalance;
        } else {
            revert("Invalid vote option");
        }
        hasVoted[_id][msg.sender] = true;
    }

    function executeProposal(uint _id) public onlyOwner proposalExists(_id) {
        proposalCanBeExecuted(_id);

        Proposal storage proposal = proposals[_id];

        (bool success, ) = proposal.target.call(proposal._callData);
        require(success, "Proposal execution failed");

        proposal.executed = true;
        emit ProposalExecuted(_id, proposal.description);
    }

    function proposalCanBeExecuted(uint _id) public proposalExists(_id) view {
        Proposal storage proposal = proposals[_id];
        require(!proposal.executed, "Proposal already executed");
        require(block.timestamp >= proposal.deadline, "Voting period is not ended");

        uint totalVotes = proposal.positiveVotes + proposal.negativeVotes + proposal.neutralVotes;
        uint quorum = (GOVERNANCE_TOKEN.totalSupply() * QUORUM_PERCENTAGE) / 100;

        require(totalVotes >= quorum, "Quorum not reached");
        require(proposal.positiveVotes > proposal.negativeVotes, "Proposal did not pass");
    }

    function getProposal(uint _id) public view proposalExists(_id) returns (Proposal memory) {
        return proposals[_id];
    }
}
