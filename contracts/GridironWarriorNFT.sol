// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RandomNumberGenerator.sol";

contract GridironWarriorNFT is ERC721, Ownable {
    RandomNumberGenerator public randomNumberGenerator;
    uint256 public currentTokenId;
    uint256 public maxSupply = 10;
    uint256 public mintPrice = 0.01 ether;
    string public baseURI;
    mapping(uint256 => string) private _tokenURIs;

    event NFTMinted(
        uint256 indexed tokenId,
        string tokenURI,
        uint256 randomNumber
    );

    constructor(
        address _randomNumberGenerator,
        string memory _baseURI
    ) ERC721("Gridiron Warrior - QB Edition", "GWQB") {
        randomNumberGenerator = RandomNumberGenerator(_randomNumberGenerator);
        baseURI = _baseURI;
    }

    function mintNFT() external payable {
        require(currentTokenId < maxSupply, "Max supply reached");
        require(msg.value >= mintPrice, "Insufficient funds to mint");

        uint256 requestId = randomNumberGenerator.requestRandomWords(false);
        fulfillMint(requestId);
    }

    function fulfillMint(uint256 _requestId) internal {
        (bool fulfilled, uint256 randomNumber) = randomNumberGenerator
            .getRequestStatus(_requestId);
        require(fulfilled, "Random number not fulfilled yet");

        currentTokenId++;
        _safeMint(msg.sender, currentTokenId);

        string memory tokenURI = string(
            abi.encodePacked(baseURI, "/", uint2str(randomNumber), ".json")
        );
        _setTokenURI(currentTokenId, tokenURI);

        emit NFTMinted(currentTokenId, tokenURI, randomNumber);
    }

    function _setTokenURI(uint256 tokenId, string memory tokenURI) internal {
        require(_exists(tokenId), "URI set of nonexistent token");
        _tokenURIs[tokenId] = tokenURI;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return _tokenURIs[tokenId];
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}
