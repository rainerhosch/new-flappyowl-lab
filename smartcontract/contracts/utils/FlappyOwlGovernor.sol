// SPDX-License-Identifier: MIT
//@audit-issue
/*
 * ** author  : Flappyowl Foundation
 * ** package : @contracts/ERC721/FlappyOwlVault.sol
 */
pragma solidity ^0.8.17;

import {IFRC} from "../interfaces/IFRC.sol";
import {ILiquidityPool} from "../interfaces/ILiquidityPool.sol";
import {IStakingPoolNft} from "../interfaces/IStakingPoolNft.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {RewardLibrary} from "../libraries/RewardLibrary.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract FlappyOwlGovernor is Ownable, ReentrancyGuard {
    using RewardLibrary for uint256;
    using SafeERC20 for IFRC;

    IFRC FRC;
    ILiquidityPool liquidityPool;
    IStakingPoolNft nftStakingPool;

    /*--------------------------------------------------------------------
     * EVENTS HANDLER
     *--------------------------------------------------------------------*/
    // event ItemStaked(uint256 indexed tokenId, address indexed owner, uint256 indexed timestamp);
    // event ItemUnstaked(uint256 indexed tokenId, address indexed owner, uint256 indexed timestamp);
    event Claimed(address indexed owner, uint256 indexed reward, uint256 indexed blockclaimed);

    /*--------------------------------------------------------------------*
     * ERRORS HANDLER
     *--------------------------------------------------------------------*/
    error FlappyOwlPos__ItemAlreadyStaked();
    error FlappyOwlPos__NotItemOwner();
    error NotAuthenticNfts();
    error NotHavePoolPosition();
    error NotHaveStakedNfts();

    /*--------------------------------------------------------------------*
     * FRC TOKEN ALLOCATION AND LOGIC BASE
     *--------------------------------------------------------------------*/
    uint public initialSupply = 21 * 1e6 * 1e18;
    bool public initialSupplyMinted;
    
    uint256 internal constant halvingInterval = 10000; 
    uint256 public rewardPerBlock; //100K FRC initial block reward
    uint256 public lastHalvingBlock;
    mapping(address => uint256) public lastClaimBlock;
    // uint256 public totalItemsStaked;
    // mapping(address => uint256) public stakingLiquidity;
    // mapping(address => uint256) public stakedNftBalance;

    // addresses
    address constant FOUNDATION = 0xeE66bda0BC2C9ab72127Ce90944b4048775f5Fd9; // 15% FOR FOUNDATION LONG-TERM ENDOWMENT.
    address constant AIRDROP = 0x8e14398d793938a3e17852320CB97d1479a05fEb; // 60% AIRDROP ALOCATION.
    address constant GENESIS_POOL = 0xEE5a230528B70c6CAA1cD17fA54AEA481241deAA; // 25% GENESIS LIQUIDITY POOL.
    address[] internal INITIAL_SUPPLY_RECEIVER = [
        FOUNDATION,
        GENESIS_POOL,
        AIRDROP
    ];

    // allocations as a percentage of total supply
    uint constant FOUNDATION_ALLOCATION = 15;
    uint constant GENESIS_POOL_ALLOCATION = 25;
    uint constant AIRDROP_ALLOCATION = 60;
    uint[] internal INITIAL_SUPPLY_ALLOCATION = [
        FOUNDATION_ALLOCATION,
        GENESIS_POOL_ALLOCATION,
        AIRDROP_ALLOCATION
    ];

    /*--------------------------------------------------------------------*
     * CONSTRUCTOR
     *--------------------------------------------------------------------*/
    constructor(
        address _tokenAddress,
        address _lpStakingAddress,
        address _nftStakingAddress,
        uint256 _initialRewardPerBlock
    ) {
        FRC = IFRC(_tokenAddress);
        liquidityPool = ILiquidityPool(_lpStakingAddress);
        nftStakingPool = IStakingPoolNft(_nftStakingAddress);
        rewardPerBlock = _initialRewardPerBlock;
        lastHalvingBlock = block.number;
    }

    /*--------------------------------------------------------------------*
     * LOGIC
     *--------------------------------------------------------------------*/
    function updateReward() internal {
        (rewardPerBlock, lastHalvingBlock) = RewardLibrary.updateReward(rewardPerBlock, lastHalvingBlock);
    }
    function _unclaimedRewards(address _user) internal returns (uint256) {
        updateReward();
        uint256 liqudityStakedOfUser = liquidityPool.getLiquidityLpOf(_user);
        uint256 nftStakedOfUser = nftStakingPool.totalStakedNft(_user);
        uint256 totalAllLiquidityOfPool = liquidityPool.totalLiquidityOfPool();
        uint256 totalNftStakedOfPool = nftStakingPool.totalNftStakingOfPool();

        return RewardLibrary.calculateReward(rewardPerBlock, lastClaimBlock[_user], liqudityStakedOfUser, nftStakedOfUser, totalAllLiquidityOfPool, totalNftStakedOfPool);
    }
    function _claim(address _user) internal returns (bool){
        uint256 rewardEarned = _unclaimedRewards(_user);
        require(rewardEarned > 0, "No rewards, for claim!");
        uint256 _blockClaimed = block.number;
        // uint256 _blockTime = block.timestamp;
        lastClaimBlock[_user] = _blockClaimed;
        FRC.mint(_user, rewardEarned);
        emit Claimed(_user, rewardEarned, _blockClaimed);
        return true;
    }
    function getUnclaimedRewards(address _user) public returns (uint256) {
        return _unclaimedRewards(_user);
    }
    function claimReward(address _user) external returns (bool){
        return _claim(_user);
    }
    function _genesisSupplyFRC() external onlyOwner {
        uint256 _amount;
        address _receiver;
        uint len = INITIAL_SUPPLY_RECEIVER.length;
        require(!initialSupplyMinted, "Initial Supply Has Minted!");
        initialSupplyMinted = true;
        for (uint256 i = 0; i < len; i++) {
            _receiver = INITIAL_SUPPLY_RECEIVER[i];
            _amount = (INITIAL_SUPPLY_ALLOCATION[i] * initialSupply) / 100;
            FRC.mint(_receiver, _amount);
        }
    }

    function updateVaultInterface(
        address _tokenAddress,
        address _lpStakingAddress,
        address _nftStakingAddress
    ) external onlyOwner {
        FRC = IFRC(_tokenAddress);
        liquidityPool = ILiquidityPool(_lpStakingAddress);
        nftStakingPool = IStakingPoolNft(_nftStakingAddress);
    }
}
