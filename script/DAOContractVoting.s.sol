// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import {DAOContract} from "../src/DAOContract.sol";
import {Script} from "forge-std/Script.sol";

///
contract DAOContractVoting is Script {
    function run() public  {
        uint256 pkrd  = vm.envUint("PRIVATE_KEY");
        address contractAddress = vm.envAddress("DAO_CONTRACT_ADDRESS");
        vm.startBroadcast(pkrd);
        DAOContract dao =   DAOContract(contractAddress);
       dao.voteOnProposal(1, 1);
        vm.stopBroadcast();
    }
}
