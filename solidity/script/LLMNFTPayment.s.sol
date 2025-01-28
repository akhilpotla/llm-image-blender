// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {LLMNFTPayment} from "../src/LLMNFTPayment.sol";

contract LLMNFTPaymentScript is Script {
    LLMNFTPayment public llmNFTPayment;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        llmNFTPayment = new LLMNFTPayment();

        vm.stopBroadcast();
    }
}
