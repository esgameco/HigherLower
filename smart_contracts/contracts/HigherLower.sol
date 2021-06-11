// SPDX-License-Identifier: MIT
// Made by Chance Vodnoy - 6/5/2021
pragma solidity ^0.8.4;

import "./helpers/Admin.sol";

// Single use contract for testing
// No hiding or revealing
contract HigherLower is Admin {
    // Current bets
    mapping (uint256 => mapping (address => uint)) public bets;
    mapping (uint256 => uint) public betTotals;
    address public currentWinner;
    uint public currentGame;

    // Timestamps for when to deal with bets
    uint public betLength = 10;
    uint public claimLength = 5;
    uint public endBets;
    uint public startNext;

    // Events
    event Bet(address player, uint amount);
    event Withdraw(address player, uint amount);
    event NewCurrentWinner(address winner);
    event PrizesClaimed(address winner);
    event NewGame(uint number);

    // Errors
    error TooLate(uint time);
    error TooEarly(uint time);

    // Modifiers
    modifier onlyBefore(uint _time) {
        if (block.timestamp >= _time) revert TooLate(_time);
        _;
    }
    modifier onlyAfter(uint _time) {
        if (block.timestamp <= _time) revert TooEarly(_time);
        _;
    }

    constructor() Admin() {
        currentWinner = owner();

        currentGame = 1;
        // Bet time = betLength seconds
        endBets = block.timestamp + betLength;
        // Time to collect prizes = claimLength seconds
        startNext = endBets + claimLength;

        // Sets the winner's bets to 0
        bets[currentGame][currentWinner] = 0;
        // Sets the current game's bet total to 0
        betTotals[currentGame] = 0;
    }

    // Starts the next game 
    function startNextGame() public onlyAfter(startNext) {
        // Winner starts as owner
        currentWinner = owner();

        // Starts new game
        currentGame++;
        endBets = block.timestamp + betLength;
        startNext = endBets + claimLength;

        bets[currentGame][currentWinner] = 0;
        betTotals[currentGame] = 0;

        emit NewGame(currentGame);
    }

    // Adds bet to current game
    function bet() public payable onlyBefore(endBets) {
        bets[currentGame][msg.sender] += msg.value;
        betTotals[currentGame] += msg.value;

        if (bets[currentGame][msg.sender] > bets[currentGame][currentWinner]) {
            currentWinner = msg.sender;
            emit NewCurrentWinner(currentWinner);
        }
        emit Bet(msg.sender, msg.value);
    }

    // Current betters can withdraw their bets if they're not the current winner
    function withdraw(uint amount) public onlyBefore(endBets) {
        // The current winner cannot withdraw
        require(msg.sender != currentWinner);
        require(amount <= bets[currentGame][msg.sender]);
        require(amount <= address(this).balance);

        bets[currentGame][msg.sender] -= amount;
        betTotals[currentGame] -= amount;

        // Send the bets they made in the current game
        Address.sendValue(payable(msg.sender), bets[currentGame][msg.sender]);
        emit Withdraw(msg.sender, amount);
    }

    // Winner claims all bets made during the game they won in
    function claim() public onlyAfter(endBets) onlyBefore(startNext) {
        require(msg.sender == currentWinner);
        uint total = betTotals[currentGame];

        // Sets the bet total to 0
        betTotals[currentGame] = 0;
        // Lets new game start immediately after
        startNext = block.timestamp;
        
        // Sends all bets in the current game
        Address.sendValue(payable(msg.sender), total);
        emit PrizesClaimed(currentWinner);
    }

    // View methods:

    // Gets the current bet of an address
    function getCurrentBet() public view returns (uint) {
        return bets[currentGame][msg.sender];
    }

    // Gets the current total bets of the game
    function getCurrentTotal() public view returns (uint) {
        return betTotals[currentGame];
    }

    // Gets the time left before betting closes
    function getTimeLeft() public view returns (uint) {
        require(endBets > block.timestamp);
        return endBets - block.timestamp;
    }

    // Gets whether the prize is claimable or not
    function getClaimable() public view returns (bool) {
        return block.timestamp > endBets && block.timestamp < startNext;
    }

    // Gets whether a new game is possible
    function getNewGame() public view returns (bool) {
        return block.timestamp > startNext;
    }
}