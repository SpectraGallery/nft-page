// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721URIStorage {
    uint256 private _tokenIds; // Simple counter for token IDs
    address contractAddress;

    constructor(address marketplaceAddress) ERC721("Metaverse Tokens", "METT") {
        contractAddress = marketplaceAddress;
        _tokenIds = 0; // Initialize the counter
    }

    function createToken(string memory tokenURI) public returns (uint256) {
        _tokenIds += 1; // Increment the counter
        uint256 newItemId = _tokenIds; // Use the current counter value as the new item ID

        _mint(msg.sender, newItemId); // Mint the new token
        _setTokenURI(newItemId, tokenURI); // Set the token URI
        setApprovalForAll(contractAddress, true); // Automatically approve the marketplace

        return newItemId; // Return the new item ID
    }
}