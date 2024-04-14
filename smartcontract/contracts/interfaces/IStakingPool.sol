// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
/*
* @author   : flappyowl foundation
* @file     : staking pool interface
*/
interface IStakingPool {
    function createPool(address stakingReward, uint256 rewardPerBlock, uint256 halvingInterval) external returns (uint256);
    function stake(uint256 poolId, uint256 amount) external;
    function unstake(uint256 poolId, uint256 amount) external;
    function claim(uint256 poolId) external;
    function getPoolInfo(uint256 poolId) external view returns (address stakingReward, uint256 totalStaked, uint256 rewardPerBlock, uint256 lastHalvingBlock, uint256 halvingInterval);
}
