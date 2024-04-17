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
    
    address public CONTROLLER_ADDRESS;
    address[] public minters;
    mapping(address => bool) minter;
    address private owner;

    /*-------------------------------------------------------------------- *
     * Construntor
     * -------------------------------------------------------------------- *
     */
    constructor() ERC20("FRC-TESTNET", "FRCT") ERC20Permit("FRC-TESTNET") {
        owner = msg.sender;
    }
    function mint(address account, uint256 amount) external returns (bool) {
        if (!minter[msg.sender]) revert NotMinter();
        _mint(account, amount);
        return true;
    }
    /* ----------------------------------------------------------------------- *
     * Controller Setup
     * Controller address is a official governance like StakingPool Address
     * ------------------------------------------------------------------------ *
     */

    function setController(address _address) public {
        if (msg.sender != owner) revert NotOwner();
        CONTROLLER_ADDRESS = _address;
    }
    function removeMinter(address _address) external returns (bool){
        if (msg.sender != CONTROLLER_ADDRESS) revert NotController();
        if (minter[_address]) {
            minter[_address] = false;
            for(uint128 i; i < minters.length; i++){
                if (minters[i] == _address) {
                    minters[i] = minters[minters.length - 1];
                    minters.pop();
                    break;
                }
            }
        }
        return true;
    }
    function setMinter(address[] memory _address) external returns (bool){
        if (msg.sender != CONTROLLER_ADDRESS) revert NotController();
        for(uint128 i; i < _address.length;){
            if (!minter[_address[i]]) {
                minter[_address[i]] = true;
                minters.push(_address[i]);
            }
            unchecked {
                ++i;
            }
        }
        return true;
    }
    function isMinter(address _address) public view returns (bool){
        return minter[_address];
    }
    
    function MINTER_ADDRESS() public view returns (address[] memory){
        return minters;
    }
}
