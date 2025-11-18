// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import {DAOContract} from "../src/DAOContract.sol";
import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {Vm} from "forge-std/Vm.sol";
///
contract DLosScript is Script {
    function run() public  {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        uint256 pkRD = vm.envUint("PRIVATE_KEY_RD");
        vm.startBroadcast(privateKey);
        vm.recordLogs();
        address goveranceToken = 0xA3933e93AE9351053c0f2B753f0051835d266eb5;
        DAOContract dao =   new DAOContract(goveranceToken);
        dao.createProposal(
            "get token name",
            goveranceToken,
            abi.encodeWithSignature("name()")
        );
        console.log("created proposal");
        console.logBytes(abi.encodeWithSignature("name()"));        vm.stopBroadcast();
        Vm.Log[] memory logs = vm.getRecordedLogs();
        uint256 proposalId = 1;
        bytes32 targetSig = keccak256("ProposalCreated(uint,string,uint256);");
        for (uint i = 0; i < logs.length; i++) {
            if (logs[i].topics.length == 0) continue;
            if (logs[i].topics[0] != targetSig) continue;

            // Example decoding strategy:
            // - indexed uint256 -> topics[1]
            // - indexed address -> topics[2]
            // - remaining non-indexed values encoded in data
            proposalId = uint256(logs[i].topics[1]);
            address proposer = address(uint160(uint256(logs[i].topics[2])));

            // Adjust types/order to match the actual event's non-indexed arguments
            (string memory description, address target, bytes memory callData) = abi.decode(
                logs[i].data,
                (string, address, bytes)
            );

            console.log("Proposal id:", proposalId);
            console.log("Proposer:", proposer);
            console.log("Description:", description);
            console.log("Target:", target);
            console.logBytes(callData);
            break;
        }
        if (proposalId == 0) {
            console.log("Proposal ID not found in logs");
            return;
        }
        vm.startBroadcast(privateKey);
       dao.voteOnProposal(1, 1);

        vm.warp(block.timestamp + 4 days);
        dao.executeProposal(proposalId);
        vm.stopBroadcast();
    }
}
