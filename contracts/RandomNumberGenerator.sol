// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

contract RandomNumberGenerator is VRFConsumerBaseV2Plus {
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256 randomNumber);

    struct RequestStatus {
        bool fulfilled;
        bool exists;
        uint256 randomNumber;
    }

    mapping(uint256 => RequestStatus) public s_requests;
    mapping(uint256 => bool) public usedNumbers;
    uint256[] public availableNumbers;
    uint256 public totalGeneratedNumbers = 0;

    bytes32 public keyHash;
    uint32 public callbackGasLimit;
    uint16 public requestConfirmations;
    uint32 public numWords;

    uint256 public s_subscriptionId;
    uint256[] public requestIds;
    uint256 public lastRequestId;

    constructor(
        uint256 subscriptionId,
        bytes32 _keyHash,
        uint32 _callbackGasLimit,
        uint16 _requestConfirmations,
        uint256 minRange,
        uint256 maxRange
    ) VRFConsumerBaseV2Plus(0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B) {
        s_subscriptionId = subscriptionId;
        keyHash = _keyHash;
        callbackGasLimit = _callbackGasLimit;
        requestConfirmations = _requestConfirmations;
        numWords = 1;

        for (uint256 i = minRange; i <= maxRange; i++) {
            availableNumbers.push(i);
        }
    }

    function requestRandomWords(
        bool enableNativePayment
    ) external returns (uint256 requestId) {
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
        s_requests[requestId] = RequestStatus({
            randomNumber: 0,
            exists: true,
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, numWords);
        return requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] calldata _randomWords
    ) internal override {
        require(
            s_requests[_requestId].exists,
            "Request not found or already fulfilled"
        );

        uint256 randomIndex = _randomWords[0] % availableNumbers.length;

        uint256 randomValue = availableNumbers[randomIndex];
        availableNumbers[randomIndex] = availableNumbers[
            availableNumbers.length - 1
        ];
        availableNumbers.pop();

        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomNumber = randomValue;

        totalGeneratedNumbers++;

        emit RequestFulfilled(_requestId, randomValue);
    }

    function getRequestStatus(
        uint256 _requestId
    ) external view returns (bool fulfilled, uint256 randomNumber) {
        require(
            s_requests[_requestId].exists,
            "Request not found or already fulfilled"
        );
        RequestStatus memory request = s_requests[_requestId];
        return (request.fulfilled, request.randomNumber);
    }

    function getAvailableNumbers() external view returns (uint256[] memory) {
        return availableNumbers;
    }
}
