// SPDX-License-Identifier: MIT
/*
 * ** author  : Flappyowl Foundation
 * ** package : @contracts/ERC721/FlappyRewardCoin.sol
 * ** The native token in the Flappyowl ecosystem
 */
pragma solidity ^0.8.17;

import {IFRC} from "../interfaces/IFRC.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract FRC is IFRC, ERC20Permit {
    using SafeERC20 for ERC20;
    using SafeMath for uint256;
    
    address public controller;
    address public minter;
    address private owner;

    /*-------------------------------------------------------------------- *
     * Construntor
     * -------------------------------------------------------------------- *
     */
    constructor() ERC20("FRCTestNet", "FRC") ERC20Permit("FRCTestNet") {
        owner = msg.sender;
        // _genesisSupply();
        // rewardPerBlock = _initialRewardPerBlock;
        // lastHalvingBlock = block.number;
    }
    function mint(address account, uint256 amount) external returns (bool) {
        if (msg.sender != minter) revert NotMinter();
        // if (account == address(0)) revert ZeroAddress();
        _mint(account, amount);
        return true;
    }

    /* ----------------------------------------------------------------------- *
     * Controller Setup
     * Controller address is a official governance like StakingPool Address
     * ------------------------------------------------------------------------ *
     */

    function setController(address account) external {
        if (msg.sender != owner) revert NotOwner();
        controller = account;
    }
    function setMinter(address account) external {
        if (msg.sender != owner) revert NotOwner();
        minter = account;
    }
}
