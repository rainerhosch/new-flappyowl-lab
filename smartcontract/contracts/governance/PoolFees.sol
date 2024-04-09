// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IFlappyRewardCoin} from "../interfaces/IFlappyRewardCoin.sol";

/// @title PoolFees
/// @notice Contract used as 1:1 pool relationship to split out fees.
/// @notice Ensures curve does not need to be modified for LP shares.
contract PoolFees {
    using SafeERC20 for IFlappyRewardCoin;

    address internal immutable pool; // The pool it is bonded to
    uint128 internal fee; // The fee it is bonded to
    address internal immutable token; // token of pool, saved localy and statically for gas optimization

    uint128 public maxPoolFeeCap = 5; // 5% max pool fees

    error NotPoolCreator();
    error maxPoolFeeExeced();

    // constructor(address _pool, uint128 _fee) {
    //     pool = _pool;
    //     fee = _fee;
    // }

    /// @notice Allow the creator to change pool fees
    function setPoolFees(uint128 _amount) external {
        if (msg.sender != pool) revert NotPoolCreator();
        if (_amount <= maxPoolFeeCap) revert maxPoolFeeExeced();
        fee = _amount;
    }



    /// @notice Allow the pool to transfer fees to pool creator
    function claimPoolFees(uint256 _amount) external {
        if (msg.sender != pool) revert NotPoolCreator();
        if (_amount > 0) IFlappyRewardCoin(token).transferFrom(address(this), msg.sender, _amount);
    }
}