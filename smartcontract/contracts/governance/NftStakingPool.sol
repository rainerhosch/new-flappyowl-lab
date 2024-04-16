// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
/*
 * ** author  : flappyowl foundation
 * ** package : @contracts/governance/NftStakingPool.sol
 */
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {IFlappyOwlNftTestnet} from "../interfaces/IFlappyOwlNftTestnet.sol";
import {IStakingPoolNft} from "../interfaces/IStakingPoolNft.sol";

contract NftStakingPool is IERC721Receiver, IStakingPoolNft {
    using SafeMath for uint256;
    IFlappyOwlNftTestnet nft;

    struct StakedNft {
        address owner;
        uint256 stakingStartTime;
    }

    // address public controller;
    uint256 public totalNftStakingPool;

    // mapping(address => bool) controllers;
    mapping(uint256 => StakedNft) pools;
    mapping(address => uint256) public stakedNftBalance;
    mapping(address => uint256) public lastClaimBlock;

    constructor(address _nftAddress) {
        nft = IFlappyOwlNftTestnet(_nftAddress);
    }

    function stake(uint256[] calldata tokenIds) external {
        uint256 tokenId;
        uint256 stakedCount;
        uint256 len = tokenIds.length;
        for (uint256 i; i < len; ) {
            tokenId = tokenIds[i];
            if (pools[tokenId].owner != address(0)) {
                revert FlappyOwlPos__ItemAlreadyStaked();
            }
            if (nft.ownerOf(tokenId) != msg.sender) {
                revert FlappyOwlPos__NotItemOwner();
            }

            nft.safeTransferFrom(msg.sender, address(this), tokenId);
            // nft.setApprovalForAll(address(nft), true);
            pools[tokenId] = StakedNft(msg.sender, block.timestamp);
            emit ItemStaked(tokenId, msg.sender, block.timestamp);
            unchecked {
                stakedCount++;
                ++i;
            }
        }
        stakedNftBalance[msg.sender] += stakedCount;
        totalNftStakingPool = totalNftStakingPool + stakedCount;
    }

    function unstake(address user, uint256[] calldata tokenIds) external returns (uint256[] memory unstakedToken){
        _unstake(user, tokenIds);
        return unstakedToken = tokenIds;
    }

    function _unstake(address user, uint256[] calldata tokenIds) internal {
        uint256 tokenId;
        uint256 unstakedCount;
        uint256 len = tokenIds.length;
        for (uint256 i; i < len; ) {
            tokenId = tokenIds[i];
            require(pools[tokenId].owner == user, "Not Owner");
            nft.safeTransferFrom(address(this), user, tokenId);
            delete pools[tokenId];
            emit ItemUnstaked(tokenId, user, block.timestamp);
            unchecked {
                unstakedCount++;
                ++i;
            }
        }
        stakedNftBalance[msg.sender] -= unstakedCount;
        totalNftStakingPool = totalNftStakingPool - unstakedCount;
    }
    //--------------------------------------------------------------------
    // VIEW FUNCTIONS
    
    function totalNftStakingOfPool() external view returns (uint256){
        return totalNftStakingPool;
    }
    function totalStakedNft(address user) external view returns (uint256 poolBalance){
        return poolBalance = stakedNftBalance[user];
    }

    function tokensOfOwner(
        address user
    ) public view returns (uint256[] memory tokens) {
        uint256 balance = stakedNftBalance[user];
        uint256 supply = nft.totalSupply();
        tokens = new uint256[](balance);

        uint256 counter;

        if (balance == 0) {
            return tokens;
        }

        unchecked {
            for (uint256 i; i <= supply; ++i) {
                if (pools[i].owner == user) {
                    tokens[counter] = i;
                    counter++;
                }
                if (counter == balance) {
                    return tokens;
                }
            }
        }
    }
    
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}
