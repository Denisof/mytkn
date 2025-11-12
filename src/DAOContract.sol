pragma solidity ^0.8.0;

import {Ownable} from "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import {IERC20} from "../lib/forge-std/src/interfaces/IERC20.sol";
import {MyToken} from "./MyToken.sol";


contract DAOContract is Ownable {

    error EmptyDescription(string message);
    error ProposalNotFound(string message);
    error ProposalCanNotBeExecuted(string message);

    uint public constant VOTING_DURATION = 3 days;
    uint public constant QUORUM_PERCENTAGE = 50;

    event ProposalCreated(uint id, string description, uint256 createdAt);

    struct Proposal {
        uint id;
        string  description;
        bool executed;
        uint256 positiveVotes;
        uint256 negativeVotes;
        uint256 deadline;
        address target;
        bytes _callData;
    }

    IERC20 public immutable governanceToken;

    mapping(uint => Proposal) public proposals;
    uint public proposalCount = 0;

    modifier proposalExists(uint _id) {
        _proposalExists(_id);
        _;
    }

    modifier proposalCanBeExecuted(uint _id) {
        _proposalExists(_id);
        proposalCanBeExecuted(_id);
        _;
    }

    constructor(address _governance) Ownable(msg.sender) {
        governanceToken = MyToken(_governance);
    }

    function _proposalExists(uint _id) internal view {
        require(_id > 0 && _id <= proposalCount, ProposalNotFound("Proposal does not exist"))
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
            _callData: _callData
        });

        emit ProposalCreated(proposalCount, _description, block.timestamp);
    }

    function executeProposal(uint _id) public onlyOwner proposalCanBeExecuted(_id) {
        Proposal storage proposal = proposals[_id];


        if (proposal.positiveVotes > proposal.negativeVotes) {
            (bool success, ) = proposal.target.call(proposal._callData);
            require(success, "Proposal execution failed");
        }

        proposal.executed = true;
    }

    function proposalCanBeExecuted(uint _id) public view {
        _proposalExists(_id);
        Proposal storage proposal = proposals[_id];
        require(!proposal.executed, "Proposal already executed");
        require(block.timestamp >= proposal.deadline, "Voting period is not ended");

        uint totalVotes = proposal.positiveVotes + proposal.negativeVotes;
        uint quorum = (governanceToken.totalSupply() * QUORUM_PERCENTAGE) / 100;

        require(totalVotes >= quorum, "Quorum not reached");
    }
}
