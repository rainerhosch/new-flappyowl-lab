// SPDX-License-Identifier: MIT
/*
 * ** author  : flappyowl foundation
 * ** package : @contracts/interface/IStakingPoolNft.sol
 */
pragma solidity ^0.8.17;

interface IStakingPoolNft {
    /*--------------------------------------------------------------------*
     * EVENTS HANDLER
     *---------------------------------------------------------------------*/
    event ItemStaked(
        uint256 indexed tokenId,
        address indexed owner,
        uint256 indexed timestamp
    );
    event ItemUnstaked(
        uint256 indexed tokenId,
        address indexed owner,
        uint256 indexed timestamp
    );
    event Claimed(address indexed owner, uint256 indexed reward);

    /*--------------------------------------------------------------------*
     * ERROR HANDLER
     *---------------------------------------------------------------------*/
    error FlappyOwlPos__ItemAlreadyStaked();
    error FlappyOwlPos__NotItemOwner();
    error NotAuthenticNfts();
    error NotHavePoolPosition();
    error NotHaveStakedNfts();
    error ForbidenAccess();
    // function balanceOf(address user) external view returns (uint256 nftStakedbalance);
    function tokensOfOwner(address user) external view returns (uint256[] memory tokens);
    function totalNftStakingOfPool() external view returns (uint256);
    function totalStakedNft(address user) external view returns (uint256);
}
