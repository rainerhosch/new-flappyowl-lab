// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
/*
 * ** author  : flappyowl.fun
 * ** package : @contracts/interfaces/INftFactory.sol
 */

interface INftFactory {
    function tokenURI(
        uint256 tokenId,
        uint256 seed
    ) external view returns (string memory);
}
