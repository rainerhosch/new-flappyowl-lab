// SPDX-License-Identifier: MIT
//@audit-issue
/*
 * ** author  : Flappyowl Foundation
 * ** package : @contracts/ERC721/FlappyOwlVault.sol
 */
pragma solidity ^0.8.20;

import {IFRC} from "../interfaces/IFRC.sol";
import {ILiquidityPool} from "../interfaces/ILiquidityPool.sol";
import {IStakingPoolNft} from "../interfaces/IStakingPoolNft.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {RewardLibrary} from "../libraries/RewardLibrary.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract FlappyOwlGovernor is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for IFRC;
    uint256 public totalItemsStaked;

    IFRC FRC;
    ILiquidityPool liquidityPool;
    IStakingPoolNft nftStakingPool;

    // mapping(address => uint256) public stakingLiquidity;
    mapping(address => uint256) public stakedNftBalance;
    mapping(address => uint256) public lastClaimBlock;

    /*--------------------------------------------------------------------
     * EVENTS HANDLER
     *--------------------------------------------------------------------*/
    event ItemStaked(uint256 tokenId, address owner, uint256 timestamp);
    event ItemUnstaked(uint256 tokenId, address owner, uint256 timestamp);
    event Claimed(address owner, uint256 reward);

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
    uint256 internal constant halvingInterval = 10000; 
    
    bool public initialSupplyMinted;

    uint256 public rewardPerBlock; //100K FRC initial block reward
    uint256 public lastHalvingBlock;

    // addresses
    address constant FOUNDATION = 0xeE66bda0BC2C9ab72127Ce90944b4048775f5Fd9; // 15% FOR FOUNDATION LONG-TERM ENDOWMENT.
    address constant AIRDROP = 0x8e14398d793938a3e17852320CB97d1479a05fEb; // 60% AIRDROP ALOCATION.
    address constant GENESIS_POOL = 0xEE5a230528B70c6CAA1cD17fA54AEA481241deAA; // 25% GENESIS LIQUIDITY POOL.
    address[] public INITIAL_SUPPLY_RECEIVER = [
        FOUNDATION,
        AIRDROP,
        GENESIS_POOL
    ];

    // allocations as a percentage of total supply
    uint constant FOUNDATION_ALLOCATION = 15;
    uint constant GENESIS_POOL_ALLOCATION = 25;
    uint constant AIRDROP_ALLOCATION = 60;
    uint[] public INITIAL_SUPPLY_ALLOCATION = [
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
    function _updateReward(uint256 _rewardPerBlock) internal {
        uint256 currentBlock = block.number;
        uint256 blocksSinceLastHalving = currentBlock - lastHalvingBlock;
        uint256 halvingCount = blocksSinceLastHalving / halvingInterval;
        if (halvingCount > 0) {
            rewardPerBlock = _rewardPerBlock / 2 ** halvingCount;
            lastHalvingBlock = currentBlock;
        }
    }
    function calculateReward(address _user) external view returns (uint256) {
        _updateReward(rewardPerBlock);
        uint256 blocksSinceLastClaim = block.number - lastClaimBlock[_user];
        uint256 totalBalanceLP = liquidityPool.getLiquidityLpOf(_user);
        uint256 totalNftStaked = nftStakingPool.totalStakedNft(_user);

        uint256 liquidityBaseReward = ((rewardPerBlock * 70) / 100);
        uint256 nftStakingBaseReward = ((rewardPerBlock * 30) / 100);

        uint256 liquidityReward = (liquidityBaseReward * totalBalanceLP) / liquidityPool.totalLiquidityOfPool();
        uint256 nftStakingReward = (nftStakingBaseReward * totalNftStaked) / nftStakingPool.totalNftStakingOfPool();

        uint256 totalReward = blocksSinceLastClaim * (liquidityReward + nftStakingReward);
        return totalReward;
    }

    function _getRewadStakingPool(address _user) internal view returns (uint256) {
        nftStakingPool.tokensOfOwner(_user);
    }
    function _getRewadLiquidityPool(
        address _user
    )
        internal
        view
        returns (
            address owner,
            uint128 liquidity,
            address token0,
            address token1,
            uint256 lockedStart,
            uint256 lockedEnd
        )
    {
        uint256 tokenId = liquidityPool.poolOfAddress(_user);
        (
            owner,
            liquidity,
            token0,
            token1,
            lockedStart,
            lockedEnd
        ) = liquidityPool.getPoolInfo(tokenId);
        // RewardLibrary.updateReward(rewardPerBlock, lastHalvingBlock);
        // RewardLibrary.calculateReward(_stakedBalance, rewardPerBlock, _lastClaimBlock);
    }

    function claimRewardStakingNFT() external {}
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
