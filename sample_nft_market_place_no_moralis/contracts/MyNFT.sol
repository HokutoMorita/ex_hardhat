// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.9;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721 {
    string public constant TOKEN_URL = "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event NftMinted(uint256 indexed tokenId);

    constructor() ERC721("MyNFT", "MHT") {}

    function mintNft() public {
        uint256 newItemId = _tokenIds.current();
        console.log("newItemId: %s", newItemId);
        _safeMint(msg.sender, newItemId);
        emit NftMinted(newItemId);
        console.log("NftMinted Event emited");
        _tokenIds.increment();
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return TOKEN_URL;
    }

    function getTokenCounter() public view returns (uint256) {
        return _tokenIds.current();
    }
}
