// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract RandomNumberGeneratorMock {
    uint256 public lastRequestId = 0;

    function requestRandomWords(bool) public returns (uint256) {
        lastRequestId++;
        return lastRequestId;
    }

    function getRequestStatus() public pure returns (bool, uint256) {
        return (true, 5);
    }
}
