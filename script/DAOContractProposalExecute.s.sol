// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import {DAOContract} from "../src/DAOContract.sol";
import {Script} from "forge-std/Script.sol";

///
contract DAOContractProposalExecute is Script {
    function run() public  {
        uint256 pk  = vm.envUint("PRIVATE_KEY");
        address contractAddress = vm.envAddress("DAO_CONTRACT_ADDRESS");
        vm.startBroadcast(pk);
        DAOContract dao =   DAOContract(contractAddress);
       dao.executeProposal(1);
        vm.stopBroadcast();
    }
}
