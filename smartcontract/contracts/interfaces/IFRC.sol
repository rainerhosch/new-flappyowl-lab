// SPDX-License-Identifier: MIT
/*
 * ** author  : flappyowl foundation
 * ** package : @contracts/interfaces/IFRC.sol
 */
pragma solidity ^0.8.20;


interface IFRC{
    
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    function mint(address to, uint256 amount) external returns (bool);

    function burnFrom(address account, uint256 amount) external returns (bool);
}
