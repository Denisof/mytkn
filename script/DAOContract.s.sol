// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import {DAOContract} from "../src/DAOContract.sol";
import {Script} from "forge-std/Script.sol";

///
contract DLosScript is Script {
    function run() public  {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(privateKey);
        vm.recordLogs();
        address goveranceToken = 0xA3933e93AE9351053c0f2B753f0051835d266eb5;
        DAOContract dao =   new DAOContract(goveranceToken);
        vm.stopBroadcast();
        vm.startBroadcast(privateKey);
        dao.createProposal(
            "get token name",
            goveranceToken,
            abi.encodeWithSignature("name()")
        );
        vm.stopBroadcast();
    }
}
