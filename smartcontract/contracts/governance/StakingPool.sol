// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IFlappyRewardCoin} from "../interfaces/IFlappyRewardCoin.sol";

contract StakingPool{
    IFlappyRewardCoin public token;
    // RewardPoolCalculation public rewardCalc;
    error NotPool();
    error NotPoolCreator();

    struct Stake {
        uint amount;
        uint startTime;
    }

    struct Pool {
        IFlappyRewardCoin token;
        uint256 rewardRate;
        uint256 totalStaked;
        uint256 totalRewards;
        uint256 totalFeesCollected;
        mapping(address => Stake) stakes;
        // bool isActive;
    }

    // Pool[] public pools;
    mapping(address => Pool) public pools;
    mapping(uint256 => mapping(address => uint256)) public balances;
    mapping(uint256 => mapping(address => uint256)) public stakeTimestamps;

    event PoolCreated(address indexed poolId, address stakingToken, uint256 initialStakeAmount);
    event Deposite(uint256 indexed poolId, address indexed user, uint256 amount);
    event Claimed(uint256 indexed poolId, address indexed user, uint256 reward);
    event Withdrawn(address indexed poolId, address indexed user, uint amount);
    event RewardPaid(address indexed poolId, address indexed user, uint amount);

    function createPool(address _stakingToken, uint256 _initialAmount) external {
        pools[msg.sender].token = IFlappyRewardCoin(_stakingToken);
        pools[msg.sender].totalStaked = _initialAmount;
        pools[msg.sender].totalFeesCollected = 0;
        // pools.push(Pool({
        //     token: IFlappyRewardCoin(_stakingToken),
        //     rewardRate: _rewardRate,
        //     isActive: true
        // }));

        emit PoolCreated(msg.sender, _stakingToken, _initialAmount);
    }
    function calculateReward(uint256 _amount, uint256 _days) external pure returns (uint256) {
        // return _amount * _days * REWARD_PER_TOKEN_PER_DAY;
    }
}