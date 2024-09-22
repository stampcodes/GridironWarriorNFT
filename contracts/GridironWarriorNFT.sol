// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./RandomNumberGenerator.sol";

contract GridironWarriorNFT is ERC721, Ownable {
    RandomNumberGenerator public randomNumberGenerator;
    uint256 public currentTokenId;
    uint256 public maxSupply = 10;
    uint256 public mintPrice = 0.01 ether;
    string public baseURI;

    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => address) public requestToSender;

    event NFTMinted(
        uint256 indexed tokenId,
        string tokenURI,
        uint256 randomNumber
    );

    event MintRequested(address indexed sender, uint256 indexed requestId);
    event FundsWithdrawn(address indexed owner, uint256 amount);

    constructor(
        address _randomNumberGenerator,
        string memory _baseURI
    ) ERC721("Gridiron Warrior - QB Edition", "GWQB") Ownable(msg.sender) {
        randomNumberGenerator = RandomNumberGenerator(_randomNumberGenerator);
        baseURI = _baseURI;
    }

    function setTestingMode(bool _testingMode) external onlyOwner {
        testingMode = _testingMode;
    }

    function setMaxSupply(uint256 _newMaxSupply) external onlyOwner {
        require(
            _newMaxSupply >= currentTokenId,
            "New max supply must be greater than or equal to current token count"
        );
        maxSupply = _newMaxSupply;
    }

    function mintNFT() external payable {
        require(currentTokenId < maxSupply, "Max supply reached");
        require(msg.value >= mintPrice, "Insufficient funds to mint");

        uint256 requestId = randomNumberGenerator.requestRandomWords(false);
        requestToSender[requestId] = msg.sender;

        emit MintRequested(msg.sender, requestId);
    }

    bool public testingMode = false;

    function fulfillMint(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) external {
        if (!testingMode) {
            require(
                msg.sender == address(randomNumberGenerator),
                "Only the VRF can fulfill"
            );
        }

        uint256 randomNumber = _randomWords[0];
        address nftRecipient = requestToSender[_requestId];

        require(nftRecipient != address(0), "Invalid recipient address");

        currentTokenId++;
        _safeMint(nftRecipient, currentTokenId);

        string memory newTokenURI = string(
            abi.encodePacked(baseURI, Strings.toString(randomNumber), ".json")
        );

        _setTokenURI(currentTokenId, newTokenURI);

        emit NFTMinted(currentTokenId, newTokenURI, randomNumber);

        delete requestToSender[_requestId];
    }

    function _setTokenURI(uint256 tokenId, string memory newTokenURI) internal {
        require(
            _ownerOf(tokenId) != address(0),
            "URI set of nonexistent token"
        );
        _tokenURIs[tokenId] = newTokenURI;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(
            _ownerOf(tokenId) != address(0),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return _tokenURIs[tokenId];
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);

        emit FundsWithdrawn(owner(), balance);
    }
}
