// SPDX-License-Identifier: MIT
/*
 * ** author  : Flappyowl Foundation
 * ** package : @contracts/ERC721/FlappyOwlVault.sol
 */
pragma solidity 0.8.17;

import "../interfaces/IFlappyOwlNftTestnet.sol";
import "../interfaces/IFlappyRewardCoin.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FlappyOwlVault is Ownable, IERC721Receiver {
    //--------------------------------------------------------------------
    // VARIABLES

    // Total Staked Item
    uint256 public totalItemsStaked;
    // Reward rate per second (wei)
    // uint256 public rewardRatePerSecond = 100;
    uint256 private constant MONTH = 30 days;

    IFlappyOwlNftTestnet nft;
    IFlappyRewardCoin rewardCoin;

    struct Stake {
        address owner;
        uint256 stakingStartTime;
    }

    mapping(uint256 => Stake) vault;

    //--------------------------------------------------------------------
    // EVENTS

    event ItemStaked(uint256 tokenId, address owner, uint256 timestamp);
    event ItemUnstaked(uint256 tokenId, address owner, uint256 timestamp);
    event Claimed(address owner, uint256 reward);

    //--------------------------------------------------------------------
    // ERRORS

    error FlappyOwlPos__ItemAlreadyStaked();
    error FlappyOwlPos__NotItemOwner();

    //--------------------------------------------------------------------
    // CONSTRUCTOR

    constructor(address _nftAddress, address _tokenAddress) {
        nft = IFlappyOwlNftTestnet(_nftAddress);
        rewardCoin = IFlappyRewardCoin(_tokenAddress);
    }

    //--------------------------------------------------------------------
    // FUNCTIONS
    function updateVaultInterface(
        address _nftAddress,
        address _tokenAddress
    ) external onlyOwner {
        rewardCoin = IFlappyRewardCoin(_tokenAddress);
        nft = IFlappyOwlNftTestnet(_nftAddress);
    }

    function stake(uint256[] calldata tokenIds) external {
        uint256 tokenId;
        uint256 stakedCount;

        uint256 len = tokenIds.length;
        for (uint256 i; i < len; ) {
            tokenId = tokenIds[i];
            if (vault[tokenId].owner != address(0)) {
                revert FlappyOwlPos__ItemAlreadyStaked();
            }
            if (nft.ownerOf(tokenId) != msg.sender) {
                revert FlappyOwlPos__NotItemOwner();
            }

            nft.safeTransferFrom(msg.sender, address(this), tokenId);

            vault[tokenId] = Stake(msg.sender, block.timestamp);

            emit ItemStaked(tokenId, msg.sender, block.timestamp);

            unchecked {
                stakedCount++;
                ++i;
            }
        }
        totalItemsStaked = totalItemsStaked + stakedCount;
    }

    function unstake(uint256[] calldata tokenIds) external {
        _claim(msg.sender, tokenIds, true);
    }

    function claim(uint256[] calldata tokenIds) external {
        _claim(msg.sender, tokenIds, false);
    }

    function _claim(
        address user,
        uint256[] calldata tokenIds,
        bool unstakeAll
    ) internal {
        uint256 tokenId;
        uint256 calculatedReward;
        uint256 rewardEarned;

        uint256 len = tokenIds.length;
        for (uint256 i; i < len; ) {
            tokenId = tokenIds[i];
            if (vault[tokenId].owner != user) {
                revert FlappyOwlPos__NotItemOwner();
            }
            uint256 _stakedAt = vault[tokenId].stakingStartTime;

            uint256 stakingPeriod = block.timestamp - _stakedAt;
            uint256 _dailyReward = _calculateReward(stakingPeriod);
            calculatedReward +=
                (100 * _dailyReward * stakingPeriod * 1e18) /
                1 days;

            vault[tokenId].stakingStartTime = block.timestamp;

            unchecked {
                ++i;
            }
        }

        rewardEarned = calculatedReward / 100;

        if (rewardEarned != 0) {
            rewardCoin.mint(user, rewardEarned);
            emit Claimed(user, rewardEarned);
        }

        if (unstakeAll) {
            _unstake(user, tokenIds);
        }
    }

    function _unstake(address user, uint256[] calldata tokenIds) internal {
        uint256 tokenId;
        uint256 unstakedCount;

        uint256 len = tokenIds.length;
        for (uint256 i; i < len; ) {
            tokenId = tokenIds[i];
            require(vault[tokenId].owner == user, "Not Owner");

            nft.safeTransferFrom(address(this), user, tokenId);

            delete vault[tokenId];

            emit ItemUnstaked(tokenId, user, block.timestamp);

            unchecked {
                unstakedCount++;
                ++i;
            }
        }
        totalItemsStaked = totalItemsStaked - unstakedCount;
    }

    // calculate the daily staking reward based on the NFT staking period
    function _calculateReward(
        uint256 stakingPeriod
    ) internal view returns (uint256 dailyReward) {
        // if (totalItemsStaked == 0) {
        //     totalItemsStaked + 1;
        // }
        if (stakingPeriod <= MONTH) {
            dailyReward = 100 / totalItemsStaked;
        } else if (stakingPeriod < 3 * MONTH) {
            dailyReward = 200 / totalItemsStaked;
        } else if (stakingPeriod < 6 * MONTH) {
            dailyReward = 400 / totalItemsStaked;
        } else if (stakingPeriod >= 6 * MONTH) {
            dailyReward = 800 / totalItemsStaked;
        }
    }

    //--------------------------------------------------------------------
    // VIEW FUNCTIONS

    function calculateReward(
        uint256 stakingPeriod
    ) external view returns (uint256 rewardEstimate) {
        rewardEstimate = _calculateReward(stakingPeriod);
    }

    function getTotalRewardEarned(
        address user
    ) external view returns (uint256 rewardEarned) {
        uint256 calculatedReward;
        uint256[] memory tokens = tokensOfOwner(user);

        uint256 len = tokens.length;
        for (uint256 i; i < len; ) {
            uint256 _stakedAt = vault[tokens[i]].stakingStartTime;
            uint256 stakingPeriod = block.timestamp - _stakedAt;
            uint256 _dailyReward = _calculateReward(stakingPeriod);
            calculatedReward +=
                (100 * _dailyReward * stakingPeriod * 1e18) /
                1 days;
            unchecked {
                ++i;
            }
        }
        rewardEarned = calculatedReward / 100;
    }

    function getRewardEarnedPerNft(
        uint256 _tokenId
    ) external view returns (uint256 rewardEarned, uint256 stakingPeriod) {
        uint256 _stakedAt = vault[_tokenId].stakingStartTime;
        stakingPeriod = block.timestamp - _stakedAt;
        uint256 _dailyReward = _calculateReward(stakingPeriod);
        uint256 calculatedReward = (100 * _dailyReward * stakingPeriod * 1e18) /
            1 days;
        rewardEarned = calculatedReward / 100;
    }

    function balanceOf(
        address user
    ) public view returns (uint256 nftStakedbalance) {
        uint256 supply = nft.totalSupply();
        unchecked {
            for (uint256 i; i <= supply; ++i) {
                if (vault[i].owner == user) {
                    nftStakedbalance += 1;
                }
            }
        }
    }

    function tokensOfOwner(
        address user
    ) public view returns (uint256[] memory tokens) {
        uint256 balance = balanceOf(user);
        uint256 supply = nft.totalSupply();
        tokens = new uint256[](balance);

        uint256 counter;

        if (balance == 0) {
            return tokens;
        }

        unchecked {
            for (uint256 i; i <= supply; ++i) {
                if (vault[i].owner == user) {
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
