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

    // mapping(address => bool) controllers;
    // mapping(address => bool) minter;
    // mapping(address => uint256) balances;

    // // Initial supply: total 21M
    // uint public initialSupply = 21 * 1e6 * 1e18;
    // bool public initialMinted;
    // uint256 public rewardPerBlock;
    // uint256 public lastHalvingBlock;

    // // addresses
    // address constant FOUNDATION = 0xeE66bda0BC2C9ab72127Ce90944b4048775f5Fd9; // 15% FOR FOUNDATION LONG-TERM ENDOWMENT.
    // address constant AIRDROP = 0x8e14398d793938a3e17852320CB97d1479a05fEb; // 60% AIRDROP ALOCATION.
    // address constant GENESIS_POOL = 0xEE5a230528B70c6CAA1cD17fA54AEA481241deAA; // 25% GENESIS LIQUIDITY POOL.
    // address[] public INITIAL_SUPPLY_RECEIVER = [
    //     FOUNDATION,
    //     AIRDROP,
    //     GENESIS_POOL
    // ];

    // // allocations as a percentage of total supply
    // uint constant FOUNDATION_ALLOCATION = 15;
    // uint constant GENESIS_POOL_ALLOCATION = 25;
    // uint constant AIRDROP_ALLOCATION = 60;
    // uint[] public INITIAL_SUPPLY_ALLOCATION = [
    //     FOUNDATION_ALLOCATION,
    //     GENESIS_POOL_ALLOCATION,
    //     AIRDROP_ALLOCATION
    // ];

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

    /*-------------------------------------------------------------------- *
     * Logic Function
     * -------------------------------------------------------------------- *
     */
    // function _genesisSupply() internal {
    //     uint256 _amount;
    //     address _receiver;
    //     uint len = INITIAL_SUPPLY_RECEIVER.length;
    //     if (!initialMinted) revert InitialSupplyMinted();
    //     initialMinted = true;
    //     for (uint256 i = 0; i < len; i++) {
    //         _receiver = INITIAL_SUPPLY_RECEIVER[i];
    //         _amount = (INITIAL_SUPPLY_ALLOCATION[i] * initialSupply) / 100;
    //         _mint(_receiver, _amount);
    //     }
    // }

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
