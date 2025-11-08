// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import {MyToken} from "../src/MyToken.sol";
import {Script} from "forge-std/Script.sol";

contract DLosScript is Script {
    function run() public  {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(privateKey);
        new MyToken("DLOS", "DLOS", 10, 73_000_000);
        vm.stopBroadcast();
    }
}
