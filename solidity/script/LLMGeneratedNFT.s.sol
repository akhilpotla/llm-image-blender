// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {LLMGeneratedNFT} from "../src/LLMGeneratedNFT.sol";

contract LLMGeneratedNFTScript is Script {
    LLMGeneratedNFT public llmGeneratedNFT;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        llmGeneratedNFT = new LLMGeneratedNFT();

        vm.stopBroadcast();
    }
}
