// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { FaxChainLetter } from "../src/FaxChainLetter.sol";

contract DeployFaxChainLetter is Script {
    function run() external {
        address admin = vm.envAddress("DEPLOYER");
        string memory name = "FaxChainLetter";
        string memory symbol = "FCL";

        vm.startBroadcast();
        FaxChainLetter chain = new FaxChainLetter(name, symbol, admin);
        vm.stopBroadcast();

        console.log("FaxChainLetter deployed at:", address(chain));
    }
}
