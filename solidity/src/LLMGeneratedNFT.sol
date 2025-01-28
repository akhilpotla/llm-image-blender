// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

// import erc721 contract from openzeppelin

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract LLMGeneratedNFT is ERC721 {
    // constructor
    constructor() ERC721("LLMGeneratedNFT", "LLM") {}
}
