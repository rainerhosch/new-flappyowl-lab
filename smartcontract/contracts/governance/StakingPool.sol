// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IFlappyRewardCoin} from "../interfaces/IFlappyRewardCoin.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract StakingPool is Ownable {
    using SafeERC20 for IFlappyRewardCoin;
    IFlappyRewardCoin public token;

    /* --------------------------------------------------- *
     * Error Handler
     * ---------------------------------------------------- *
     */
    error NotPool();
    error NotPoolCreator();
    error NotRegistedToken();
    error MaxFeeExeced();
    error NotOwner();

    /* --------------------------------------------------- *
     * Struct
     * ---------------------------------------------------- *
     */
    struct Stake {
        uint amount;
        uint startTime;
    }

    struct Pool {
        IFlappyRewardCoin token;
        uint256 rewardRate;
        uint256 totalStaked;
        uint256 totalRewards;
        uint128 poolFees;
        uint256 totalFeesCollected;
        mapping(address => Stake) stakes;
        // bool isActive;
    }

    /* --------------------------------------------------- *
     * Mapping
     * ---------------------------------------------------- *
     */

    uint128 internal MAX_POOL_FEE_CAP = 5; // 5% max pool fees
    uint256 internal constant MIN_INITIAL_AMOUNT = 5000000 * 10**18; // 5M tokens is minimum initial stake amount for create pool
    mapping(address => Pool) public pools;
    mapping(address => bool) public registedToken;
    mapping(uint256 => mapping(address => uint256)) public balances;
    mapping(uint256 => mapping(address => uint256)) public stakeTimestamps;

    /* --------------------------------------------------- *
     * Event Handler
     * ---------------------------------------------------- *
     */
    event PoolCreated(
        address indexed poolId,
        address stakingToken,
        uint256 initialStakeAmount
    );
    event Deposite(
        uint256 indexed poolId,
        address indexed user,
        uint256 amount
    );
    event Claimed(uint256 indexed poolId, address indexed user, uint256 reward);
    event Withdrawn(address indexed poolId, address indexed user, uint amount);
    event RewardPaid(address indexed poolId, address indexed user, uint amount);
    event RegisterPoolToken(address token, bool allowed);

    /* --------------------------------------------------- *
     * Logic Function
     * ---------------------------------------------------- *
     */
    function createPool(
        address _stakingToken,
        uint256 _initialAmount,
        uint128 _poolFees
    ) external returns (bool) {
        if (!registedToken[_stakingToken]) revert NotRegistedToken();
        if (pools[msg.sender].poolFees > MAX_POOL_FEE_CAP) revert MaxFeeExeced();

        pools[msg.sender].token = IFlappyRewardCoin(_stakingToken);
        pools[msg.sender].poolFees = _poolFees;
        pools[msg.sender].totalStaked = _initialAmount;
        pools[msg.sender].totalFeesCollected = 0;
        emit PoolCreated(msg.sender, _stakingToken, _initialAmount);
        return true;
    }

    function calculateReward(
        uint256 _amount,
        uint256 _days
    ) external pure returns (uint256) {
        // return _amount * _days * REWARD_PER_TOKEN_PER_DAY;
    }
    
    function poolFeeCalculation(uint _amount, uint _poolFees) internal pure returns (uint) {
        return (_amount * _poolFees) / 100;
    }

    function withdraw(address _poolId) external {
        Pool storage pool = pools[_poolId];
        require(pool.stakes[msg.sender].amount > 0, "No stake to withdraw");

        uint amount = pool.stakes[msg.sender].amount;
        delete pool.stakes[msg.sender];

        // Transfer token ke staker (jika diperlukan)
        // Misalnya, jika Anda memiliki token ERC20:
        // token.transfer(msg.sender, amount);

        emit Withdrawn(_poolId, msg.sender, amount);
    }

    function setAllowedToken(address _token) external returns (bool) {
        if(msg.sender != owner()) revert NotOwner();
        registedToken[_token] = true;
        emit RegisterPoolToken(_token, true);
        return true;
    }
}
