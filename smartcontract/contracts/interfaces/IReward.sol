// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


interface IReward {
    function stake(uint256 amount) external;
    function unstake(uint256 amount) external;
    function claim() external;
    function stakedBalance(address user) external view returns (uint256);
}