// SPDX-License-Identifier: MIT

/*
 * ** author  : flappyowl.fun
 * ** package : @contracts/interfaces/INftFactory.sol
 */

pragma solidity ^0.8.20;

interface INftFactory {
    function tokenURI(
        uint256 tokenId,
        uint256 seed
    ) external view returns (string memory);
}
