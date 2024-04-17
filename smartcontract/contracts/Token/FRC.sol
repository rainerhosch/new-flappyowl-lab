// SPDX-License-Identifier: MIT
/*
 * ** author  : Flappyowl Foundation
 * ** package : @contracts/Token/FRC.sol
 * ** The native token in the Flappyowl ecosystem
 */
pragma solidity ^0.8.17;

import {IFRC} from "../interfaces/IFRC.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract FRC is IFRC, ERC20Permit, ERC20Burnable {
    using SafeERC20 for ERC20;
    using SafeMath for uint256;
    
    address public MINTER_ADDRESS;
    address private owner;

    /*-------------------------------------------------------------------- *
     * Construntor
     * -------------------------------------------------------------------- *
     */
    constructor() ERC20("FRC-TESTNET", "FRCT") ERC20Permit("FRC-TESTNET") {
        owner = msg.sender;
    }
    function mint(address account, uint256 amount) external returns (bool) {
        if (msg.sender != MINTER_ADDRESS) revert NotMinter();
        _mint(account, amount);
        return true;
    }
    /* ----------------------------------------------------------------------- *
     * Controller Setup
     * Controller address is a official governance like StakingPool Address
     * ------------------------------------------------------------------------ *
     */

    function setMinter(address _address) public {
        if (msg.sender != owner) revert NotOwner();
        MINTER_ADDRESS = _address;
    }
}
