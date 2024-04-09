// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IFlappyRewardCoin} from "../interfaces/IFlappyRewardCoin.sol";

contract PoolFactory {

    error NotPool();

    struct Stake {
        uint amount;
        uint startTime;
    }

    struct Pool {
        address creator;
        uint poolFees;
        mapping(address => Stake) stakes;
        uint maxStaked; // Max staked token in pool
        uint totalStaked;
        uint totalRewards;
        uint totalFeesCollected;
    }

    mapping(address => Pool) public pools;
    uint public maxPoolFeeCap = 5; // 5% max pool fees
    address public poolCreator;

    event Staked(address indexed poolId, address indexed staker, uint amount);
    event Withdrawn(address indexed poolId, address indexed staker, uint amount);
    event RewardPaid(address indexed poolId, address indexed staker, uint amount);

    modifier onlyCreator {
        require(msg.sender == poolCreator, "Only owner can call this function");
        _;
    }

    constructor(address _tokenAddress) {
        token = IFlappyRewardCoin(_tokenAddress);
    }

    function createPool(uint128 _poolFees, uint _maxStaked) external {
        require(_poolFees <= maxPoolFeeCap, "Joining fee percentage should be less than or equal to 5");
        pools[msg.sender].creator = msg.sender;
        pools[msg.sender].poolFees = _poolFees;
        pools[msg.sender].maxStaked = _maxStaked;
    }

    function stake(address _poolId, uint _amount) external payable {
        Pool storage pool = pools[_poolId];
        require(_amount > 0, "Amount should be greater than 0");
        require(pool.totalStaked + _amount <= pool.maxStaked, "Exceeds max staked pool limit");
        // require(msg.value >= calculateJoiningFee(_amount, pool.poolFees), "Insufficient joining fee");

        pool.stakes[msg.sender].amount += _amount;
        pool.stakes[msg.sender].startTime = block.timestamp;
        pool.totalStaked += _amount;

        token.transfer(address(this), _amount);

        emit Staked(_poolId, msg.sender, _amount);
    }

    function withdraw(uint _poolId) external {
        Pool storage pool = pools[_poolId];
        require(pool.stakes[msg.sender].amount > 0, "No stake to withdraw");

        uint amount = pool.stakes[msg.sender].amount;
        delete pool.stakes[msg.sender];

        // Transfer token ke staker (jika diperlukan)
        // Misalnya, jika Anda memiliki token ERC20:
        // token.transfer(msg.sender, amount);

        emit Withdrawn(_poolId, msg.sender, amount);
    }

    function setpoolFees(uint _poolFees) external {
        if(!pools[msg.sender].creator) revert NotPool();
        require(_poolFees <= maxPoolFeeCap, "pool fee percentage should be less than or equal to 5% of user staked reward");

        pools[msg.sender].poolFees = _poolFees;
    }

    function calculateJoiningFee(uint _amount, uint _poolFees) internal pure returns (uint) {
        return (_amount * _poolFees) / 100;
    }

    function reward(uint _poolId, uint _amount) external onlyOwner {
        Pool storage pool = pools[_poolId];
        pool.totalRewards += _amount;
    }

    function payReward(uint _poolId, address _staker, uint _amount) external onlyOwner {
        Pool storage pool = pools[_poolId];
        require(_amount <= pool.totalRewards, "Insufficient rewards");

        // Transfer reward ke staker (jika diperlukan)
        // Misalnya, jika Anda memiliki token ERC20:
        // token.transfer(_staker, _amount);

        pool.totalRewards -= _amount;
        emit RewardPaid(_poolId, _staker, _amount);
    }
}