// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
library RewardLibrary {
    using SafeMath for uint256;
    uint256 internal constant halvingInterval = 10000; // halving set every 10K block

    function updateReward(
        uint256 _rewardPerBlock,
        uint256 _lastHalvingBlock
    ) internal view returns (uint256 rewardPerBlock, uint256 lastHalvingBlock) {
        uint256 currentBlock = block.number;
        uint256 blocksSinceLastHalving = currentBlock - _lastHalvingBlock;
        uint256 halvingCount = blocksSinceLastHalving / halvingInterval;

        rewardPerBlock = _rewardPerBlock;
        lastHalvingBlock = _lastHalvingBlock;

        if (halvingCount > 0) {
            rewardPerBlock = _rewardPerBlock / 2 ** halvingCount;
            lastHalvingBlock = currentBlock;
        }
    }
    function calculateReward(
        uint256 _rewardPerBlock,
        uint256 _lastClaimBlock,
        uint256 _liqudityStakedOfUser,
        uint256 _nftStakedOfUser,
        uint256 _totalAllLiquidityOfPool,
        uint256 _totalNftStakedOfPool
    ) internal view returns (uint256) {
        uint256  blocksSinceLastClaim = block.number - _lastClaimBlock;
        uint256 liquidityBaseReward = ((_rewardPerBlock * 70) / 100);
        uint256 nftStakingBaseReward = ((_rewardPerBlock * 30) / 100);

        uint256 liquidityReward = (liquidityBaseReward * _liqudityStakedOfUser) / _totalAllLiquidityOfPool;
        uint256 nftStakingReward = (nftStakingBaseReward * _nftStakedOfUser) / _totalNftStakedOfPool;

        uint256 totalReward = blocksSinceLastClaim * (liquidityReward + nftStakingReward);
        return totalReward;

    }
}
