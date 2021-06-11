// SPDX-License-Identifier: MIT
// Made by Chance Vodnoy - 6/10/2021
pragma solidity ^0.8.4;

interface IHigherLower {
    // Transaction functions
    function startNextGame() external;
    function bet() external payable;
    function withdraw(uint amount) external;
    function claim() external;

    // View functions
    function getCurrentBet() external view returns (uint);
    function getCurrentTotal() external view returns (uint);
    function getTimeLeft() external view returns (uint);
    function getClaimable() external view returns (bool);
    function getNewGame() external view returns (bool);
}