// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract RandomNumberGeneratorMock {
    uint256 public lastRequestId = 0;
    mapping(uint256 => bool) public requestFulfilled;
    mapping(uint256 => uint256) public requestIdToRandomNumber;

    function requestRandomWords(bool) public returns (uint256) {
        lastRequestId++;
        requestFulfilled[lastRequestId] = false;
        requestIdToRandomNumber[lastRequestId] = 5;
        return lastRequestId;
    }

    function fulfillRandomWords(uint256 _requestId) public {
        require(_requestId <= lastRequestId, "Invalid request ID");
        requestFulfilled[_requestId] = true;
    }

    function getRequestStatus(
        uint256 _requestId
    ) public view returns (bool, uint256) {
        require(_requestId <= lastRequestId, "Invalid request ID");
        return (
            requestFulfilled[_requestId],
            requestIdToRandomNumber[_requestId]
        );
    }
}
