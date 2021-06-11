// SPDX-License-Identifier: MIT
// Made by Chance Vodnoy - 6/5/2021
pragma solidity ^0.8.4;

import "../../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../../node_modules/@openzeppelin/contracts/utils/Address.sol";

// Admin of a contract
contract Admin is Ownable {
    // External libraries
    using Address for address;

    // Calls ownable constructor
    constructor () Ownable() {}

    // Withdraws funds from the contract
    function adminWithdraw(uint amount) public onlyOwner {
        require(amount <= address(this).balance);
        Address.sendValue(payable(owner()), amount);
    }
}