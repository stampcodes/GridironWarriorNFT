// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

contract GridironWarriorNewNFT is ERC721, VRFConsumerBaseV2Plus {
    uint256 public currentTokenId;
    uint256 public maxSupply = 10;
    uint256 public mintPrice = 0.01 ether;
    string public baseURI;

    address public admin;

    bytes32 private keyHash;
    uint256 private s_subscriptionId;
    uint32 public callbackGasLimit = 1000000;
    uint16 public requestConfirmations = 3;
    uint32 public numWords = 1;

    mapping(uint256 => address) public requestToSender;
    mapping(address => uint256) public ownerToTokenId;
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => bool) public usedNumbers;
    uint256[] public availableNumbers;
    uint256 public totalGeneratedNumbers = 0;

    event NFTMinted(
        uint256 indexed tokenId,
        string tokenURI,
        uint256 randomNumber,
        address indexed minter
    );
    event MintRequested(address indexed sender, uint256 indexed requestId);
    event FundsWithdrawn(address indexed owner, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "You are not the admin");
        _;
    }

    constructor(
        uint256 subscriptionId,
        bytes32 _keyHash,
        address vrfCoordinator,
        string memory _baseURI,
        uint256 minRange,
        uint256 maxRange
    )
        ERC721("Gridiron Warrior - QB Edition", "GWQB")
        VRFConsumerBaseV2Plus(vrfCoordinator)
    {
        admin = msg.sender;
        s_subscriptionId = subscriptionId;
        keyHash = _keyHash;
        baseURI = _baseURI;

        for (uint256 i = minRange; i <= maxRange; i++) {
            availableNumbers.push(i);
        }
    }

    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "New admin cannot be zero address");
        admin = newAdmin;
    }

    function requestToMint() external payable {
        require(currentTokenId < maxSupply, "Max supply reached");
        require(msg.value >= mintPrice, "Insufficient funds to mint");
        require(ownerToTokenId[msg.sender] == 0, "You can mint only once");

        uint256 requestId = requestRandomWords(false);
        requestToSender[requestId] = msg.sender;

        emit MintRequested(msg.sender, requestId);
    }

    function requestRandomWords(
        bool enableNativePayment
    ) internal returns (uint256 requestId) {
        require(
            totalGeneratedNumbers < availableNumbers.length,
            "All numbers have been generated."
        );

        requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: keyHash,
                subId: s_subscriptionId,
                requestConfirmations: requestConfirmations,
                callbackGasLimit: callbackGasLimit,
                numWords: numWords,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({
                        nativePayment: enableNativePayment
                    })
                )
            })
        );
        return requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] calldata _randomWords
    ) internal override {
        address nftRecipient = requestToSender[_requestId];
        require(nftRecipient != address(0), "Invalid recipient address");

        currentTokenId++;
        uint256 randomIndex = _randomWords[0] % availableNumbers.length;
        uint256 randomNumber = availableNumbers[randomIndex];
        availableNumbers[randomIndex] = availableNumbers[
            availableNumbers.length - 1
        ];
        availableNumbers.pop();
        totalGeneratedNumbers++;

        _safeMint(nftRecipient, currentTokenId);

        string memory newTokenURI = string(
            abi.encodePacked(baseURI, Strings.toString(randomNumber), ".json")
        );

        _tokenURIs[currentTokenId] = newTokenURI;
        ownerToTokenId[nftRecipient] = currentTokenId;

        emit NFTMinted(currentTokenId, newTokenURI, randomNumber, nftRecipient);

        delete requestToSender[_requestId];
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(
            bytes(_tokenURIs[tokenId]).length > 0,
            "ERC721Metadata: URI query for nonexistent token"
        );
        return _tokenURIs[tokenId];
    }

    function findMyNFT() public view returns (string memory) {
        uint256 tokenId = ownerToTokenId[msg.sender];
        require(tokenId != 0, "You do not own an NFT");
        return tokenURI(tokenId);
    }

    function withdraw() external onlyAdmin {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(admin).transfer(balance);

        emit FundsWithdrawn(admin, balance);
    }
}
