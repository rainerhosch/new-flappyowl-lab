// SPDX-License-Identifier: MIT
/*
 * ** author  : flappyowl foundation
 * ** package : @contracts/interface/ILiquidityPool.sol
 */
pragma solidity ^0.8.20;

interface ILiquidityPool {
    function getPoolInfo(uint256 tokenId) external view returns (
        address owner,
        uint128 liquidity,
        address token0,
        address token1,
        uint256 lockedStart,
        uint256 lockedEnd
    );

    function poolOfAddress(address owner) external view returns (uint256[] memory);
}