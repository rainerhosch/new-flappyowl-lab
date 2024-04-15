// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

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
        if (halvingCount > 0) {
            rewardPerBlock = _rewardPerBlock / 2 ** halvingCount;
            lastHalvingBlock = currentBlock;
        }
    }

    function calculateReward(
        uint256 _stakedBalance,
        uint256 _rewardPerBlock,
        uint256 _lastClaimBlock
    ) internal view returns (uint256 blocksSinceLastClaim) {
        blocksSinceLastClaim = block.number - _lastClaimBlock;
        blocksSinceLastClaim * _rewardPerBlock * _stakedBalance;
    }
}
