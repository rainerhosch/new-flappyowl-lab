// SPDX-License-Identifier: MIT
/*
 * ** author  : flappyowl lab
 * ** package : @contracts/governance/Reward.sol
 */
pragma solidity ^0.8.20;

import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {TimeLibrary} from "../libraries/TimeLibrary.sol";
import {IPoolReward} from "../interfaces/governance/IPoolReward.sol";
import {IFlappyRewardCoin} from "../interfaces/IFlappyRewardCoin.sol";


abstract contract PoolReward is IPoolReward, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    address internal immutable pool; // The pool it is bonded to
    uint128 internal immutable fee; // The fee it is bonded to
    address internal immutable token; // token of pool, saved localy and statically for gas optimization

    constructor(address _pool, uint128 _fee) {
        pool = _pool;
        fee = _fee;
    }
}
