// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {LLMNFTPayment} from "../src/LLMNFTPayment.sol";

contract LLMNFTPaymentTest is Test {
    LLMNFTPayment public llmNFTPayment;

    function setUp() public {
        llmNFTPayment = new LLMNFTPayment();
    }
}
