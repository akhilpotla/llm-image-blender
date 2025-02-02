// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract LLMGeneratedNFT is ERC721URIStorage {
    uint256 public tokenCounter;
    // Optional mapping for token URIs
    mapping(uint256 tokenId => string) private _tokenURIs;

    constructor() ERC721("LLMGeneratedNFT", "LLMGNFT") {
        tokenCounter = 0;
    }

    // Function to mint the NFT
    function mintNFT(
        address recipient,
        string memory tokenURI
    ) public returns (uint256) {
        uint256 newTokenId = tokenCounter;
        _safeMint(recipient, newTokenId);
        setTokenURI(newTokenId, tokenURI);
        tokenCounter += 1;
        return newTokenId;
    }

    function setTokenURI(
        uint256 tokenId,
        string memory _tokenURI
    ) internal virtual {
        require(
            _ownerOf(tokenId) != address(0),
            "ERC721Metadata: URI set of nonexistent token"
        );
        _setTokenURI(tokenId, _tokenURI);
    }
}
