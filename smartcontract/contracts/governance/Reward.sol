// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IReward} from "../interfaces/IReward.sol";

contract Reward is IReward {
    address public owner;
    uint256 public rewardPerBlock; // 100KFRC for initial reward per block, this will decrease every halving
    uint256 public halvingInterval; // halving set every 10K block
    uint256 public lastHalvingBlock;

    // mapping(address => uint256) public stakedBalance;
    // mapping(address => uint256) public lastClaimBlock;

    // event Staked(address indexed user, uint256 amount);
    // event Unstaked(address indexed user, uint256 amount);
    // event Claimed(address indexed user, uint256 amount);

    constructor(uint256 _initialRewardPerBlock, uint256 _halvingInterval) {
        owner = msg.sender;
        rewardPerBlock = _initialRewardPerBlock;
        lastHalvingBlock = block.number;
        halvingInterval = _halvingInterval;
    }

    // modifier onlyOwner() {
    //     require(msg.sender == owner, "Only owner can call this function");
    //     _;
    // }

    // function stake(uint256 _amount) external override {
    //     require(_amount > 0, "Amount must be greater than 0");
    //     updateReward();
    //     stakedBalance[msg.sender] += _amount;
    //     lastClaimBlock[msg.sender] = block.number;
    //     emit Staked(msg.sender, _amount);
    // }

    // function unstake(uint256 _amount) external override {
    //     require(_amount > 0 && _amount <= stakedBalance[msg.sender], "Invalid amount");
    //     updateReward();
    //     stakedBalance[msg.sender] -= _amount;
    //     lastClaimBlock[msg.sender] = block.number;
    //     emit Unstaked(msg.sender, _amount);
    // }

    // function claim() external override {
    //     updateReward();
    //     uint256 reward = calculateReward(msg.sender);
    //     require(reward > 0, "No reward to claim");
    //     lastClaimBlock[msg.sender] = block.number;
    //     // Transfer reward to user
    //     // For simplicity, let's assume the reward is in Ether
    //     payable(msg.sender).transfer(reward);
    //     emit Claimed(msg.sender, reward);
    // }
    function claim() external override {
        updateReward();
        uint256 reward = calculateReward(msg.sender, block.number, stakedBalance[msg.sender]);
        require(reward > 0, "No reward to claim");
        lastClaimBlock[msg.sender] = block.number;
        // Transfer reward to user
        // For simplicity, let's assume the reward is in Ether
        payable(msg.sender).transfer(reward);
        emit Claimed(msg.sender, reward);
    }

    function updateReward() internal {
        uint256 currentBlock = block.number;
        uint256 blocksSinceLastHalving = currentBlock - lastHalvingBlock;
        uint256 halvingCount = blocksSinceLastHalving / halvingInterval;
        if (halvingCount > 0) {
            rewardPerBlock = rewardPerBlock / 2**halvingCount;
            lastHalvingBlock = currentBlock;
        }
    }

    function calculateReward(address _user, uint256 _lastClaimBlock, uint256 _stakedBalance) internal view returns (uint256) {
        uint256 blocksSinceLastClaim = block.number - _lastClaimBlock;
        return blocksSinceLastClaim * rewardPerBlock * _stakedBalance;
    }
}