// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.15;

interface IUniswapV2Factory {
    function createPair(
        address tokenA,
        address tokenB
    ) external returns (address pair);
}
