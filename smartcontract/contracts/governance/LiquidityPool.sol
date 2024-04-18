// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.17;
pragma abicoder v2;

/*
 * ** author  : flappyowl foundation
 * ** package : @contracts/governance/LiquidityPool.sol
 */

import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {TickMath} from "../libraries/TickMath.sol";
import {TransferHelper} from "../libraries/TransferHelper.sol";
import {INonfungiblePositionManager} from "../interfaces/INonfungiblePositionManager.sol";
import {IFRC} from "../interfaces/IFRC.sol";
import {ILiquidityPool} from "../interfaces/ILiquidityPool.sol";
import {IWETH} from "../interfaces/IWETH.sol";

contract LiquidityPool is IERC721Receiver, ILiquidityPool {
    INonfungiblePositionManager public nonfungiblePositionManager = INonfungiblePositionManager(0x1238536071E1c677A632429e3655c799b22cDA52);
    IWETH private constant weth = IWETH(0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14);
    
    uint256 internal constant WEEK = 7 days;
    uint256 internal constant MONTH = 30 days;
    uint256 internal constant YEAR = 365 days;

    uint24 public constant poolFee = 3000; // base pool fees is 0.3%
    uint24 public constant taxFee = 10000; // tax from earning LP fees is 1% for inceas base LP
    uint256 public totalPools;
    uint256 public totalLiquidityStaked;
    address public CONTROLLER_ADDRESS;
    address private contract_owner;

    IFRC internal FRC;

    /// @notice Represents the deposit of an NFT
    struct Pool {
        address owner;
        uint128 liquidity;
        address token0;
        address token1;
        uint256 timePower;
        uint256 lockedEnd;
    }

    /// pools[tokenId] => Pool
    mapping(uint256 => Pool) public pools;
    // Mapping from pool owner to their list of token IDs
    mapping(address => uint256[]) private ownerPools;

    event PoolCreated(uint256 indexed tokenId, address indexed owner);
    event PoolRemoved(uint256 indexed tokenId, address indexed owner);

    constructor(address _token) {
        FRC = IFRC(_token);
        contract_owner = msg.sender;
        totalPools = 0;
    }

    // Implementing `onERC721Received` so this contract can receive custody of erc721 tokens
    // the operator is recorded as the owner of the deposited NFT
    function onERC721Received(
        address operator,
        address,
        uint256 tokenId,
        bytes calldata
    ) external override returns (bytes4) {
        require(
            msg.sender == address(nonfungiblePositionManager),
            "not a univ3 nft"
        );
        _createPool(operator, tokenId, 5);
        return IERC721Receiver.onERC721Received.selector;
    }

    function _createPool(address owner, uint256 tokenId, uint256 lockYears) internal {
        (
            ,
            ,
            address token0,
            address token1,
            ,
            ,
            ,
            uint128 liquidity,
            ,
            ,
            ,

        ) = nonfungiblePositionManager.positions(tokenId);
        
        // Calculate locked end time based on lock duration in years
        uint256 lockedEnd = block.timestamp + (lockYears * 365 days);
        // set the owner and data for position
        pools[tokenId] = Pool({
            owner: owner,
            liquidity: liquidity,
            token0: token0,
            token1: token1,
            timePower: block.timestamp,
            lockedEnd: lockedEnd
        });

        totalPools++; // Increment totalPools when a new pool is created
        totalLiquidityStaked += liquidity; // Increment total liquidity has staked at Pools

        ownerPools[owner].push(tokenId);
        emit PoolCreated(tokenId, owner);
    }
    /// @notice Collects the fees associated with provided liquidity
    /// @dev The contract must hold the erc721 token before it can collect fees
    /// @param tokenId The id of the erc721 token
    /// @return amount0 The amount of fees collected in token0
    /// @return amount1 The amount of fees collected in token1
    function _collectAllFees(
        uint256 tokenId
    ) internal returns (uint256 amount0, uint256 amount1) {
        // Caller must own the ERC721 position, meaning it must be a deposit
        // set amount0Max and amount1Max to type(uint128).max to collect all fees
        // alternatively can set recipient to msg.sender and avoid another transaction in `sendToOwner`
        INonfungiblePositionManager.CollectParams
            memory params = INonfungiblePositionManager.CollectParams({
                tokenId: tokenId,
                recipient: address(this),
                amount0Max: type(uint128).max,
                amount1Max: type(uint128).max
            });

        (amount0, amount1) = nonfungiblePositionManager.collect(params);
        uint256 taxAmount0 = (amount0 * taxFee) / 100;
        uint256 taxAmount1 = (amount1 * taxFee) / 100;
        amount0 = amount0 - taxAmount0;
        amount1 = amount1 - taxAmount1;
        _increaseLiquidityCurrentRange(0, taxAmount0, taxAmount1);
        _sendToOwner(tokenId, amount0, amount1);
    }
    

    /// @notice Increases liquidity in the current range
    /// @dev Pool must be initialized already to add liquidity
    /// @param tokenId The id of the erc721 token
    /// @param amountAdd0 The amount to add of token0
    /// @param amountAdd1 The amount to add of token1
    function _increaseLiquidityCurrentRange(
        uint256 tokenId,
        uint256 amountAdd0,
        uint256 amountAdd1
    ) internal returns (uint128 liquidity, uint256 amount0, uint256 amount1) {
        address owner = pools[tokenId].owner;
        address token0 = pools[tokenId].token0;
        address token1 = pools[tokenId].token1;
        uint256 liquidityBefor = pools[tokenId].liquidity;
        TransferHelper.safeTransferFrom(
            token0,
            msg.sender,
            address(this),
            amountAdd0
        );
        TransferHelper.safeTransferFrom(
            token1,
            msg.sender,
            address(this),
            amountAdd1
        );

        TransferHelper.safeApprove(
            token0,
            address(nonfungiblePositionManager),
            amountAdd0
        );
        TransferHelper.safeApprove(
            token1,
            address(nonfungiblePositionManager),
            amountAdd1
        );

        INonfungiblePositionManager.IncreaseLiquidityParams
            memory params = INonfungiblePositionManager
                .IncreaseLiquidityParams({
                    tokenId: tokenId,
                    amount0Desired: amountAdd0,
                    amount1Desired: amountAdd1,
                    amount0Min: 0,
                    amount1Min: 0,
                    deadline: block.timestamp
                });

        (liquidity, amount0, amount1) = nonfungiblePositionManager.increaseLiquidity(params);
        
        //counter
        totalLiquidityStaked += (liquidity-liquidityBefor);

        // Remove allowance and refund in both assets.
        if (amount0 < amountAdd0) {
            TransferHelper.safeApprove(
                token0,
                address(nonfungiblePositionManager),
                0
            );
            uint256 refund0 = amountAdd0 - amount0;
            TransferHelper.safeTransfer(token0, owner, refund0);
        }

        if (amount1 < amountAdd1) {
            TransferHelper.safeApprove(
                token1,
                address(nonfungiblePositionManager),
                0
            );
            uint256 refund1 = amountAdd1 - amount1;
            TransferHelper.safeTransfer(token1, owner, refund1);
        }
    }

    /// @notice Calls the mint function defined in periphery, mints the same amount of each token.
    /// @return tokenId The id of the newly minted ERC721
    /// @return liquidity The amount of liquidity for the position
    /// @return amount0 The amount of token0
    /// @return amount1 The amount of token1
    function creatPool(uint256 _amount0, uint256 _amount1, uint256 _lockYears) external returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1){
        // For this example, we will provide equal amounts of liquidity in both assets.
        // Providing liquidity in both assets means liquidity will be earning fees and is considered in-range.
        // 5 * 1e6 * 1e18; // 5M FRC for create LP
        require(FRC.balanceOf(msg.sender) >= _amount0, "Insufficient FRC balace!");
        require(weth.balanceOf(msg.sender) >= _amount1, "Insufficient WETH balance!");

        uint256 amount0ToMint =  _amount0;
        uint256 amount1ToMint = _amount1;

        // transfer tokens to contract
        TransferHelper.safeTransferFrom(address(FRC),msg.sender,address(this),amount0ToMint);
        TransferHelper.safeTransferFrom(address(weth), msg.sender, address(this), amount1ToMint);

        // Approve the position manager
        TransferHelper.safeApprove(address(FRC), address(nonfungiblePositionManager),amount0ToMint);
        TransferHelper.safeApprove(address(weth), address(nonfungiblePositionManager), amount1ToMint);

        // The values for tickLower and tickUpper may not work for all tick spacings.
        // Setting amount0Min and amount1Min to 0 is unsafe.
        INonfungiblePositionManager.MintParams memory params = INonfungiblePositionManager
            .MintParams({
                token0: address(FRC),
                token1: address(weth),
                fee: poolFee,
                tickLower: TickMath.MIN_TICK,
                tickUpper: TickMath.MAX_TICK,
                amount0Desired: amount0ToMint,
                amount1Desired: amount1ToMint,
                amount0Min: 0,
                amount1Min: 0,
                recipient: address(this),
                deadline: block.timestamp
            });

        // Note that the pool defined by FRC/ETH and fee tier 0.3% must already be created and initialized in order to mint
        (tokenId, liquidity, amount0, amount1) = nonfungiblePositionManager.mint(params);

        // Create a deposit
        _createPool(msg.sender, tokenId, _lockYears);

        // Remove allowance and refund in both assets.
        if (amount0 < amount0ToMint) {
            TransferHelper.safeApprove(address(FRC),address(nonfungiblePositionManager),0);
            uint256 refund0 = amount0ToMint - amount0;
            TransferHelper.safeTransfer(address(FRC), msg.sender, refund0);
        }

        if (amount1 < amount1ToMint) {
            TransferHelper.safeApprove(address(weth),address(nonfungiblePositionManager),0);
            uint256 refund1 = amount1ToMint - amount1;
            TransferHelper.safeTransfer(address(weth), msg.sender, refund1);
        }
    }

    function increaseLiquidityCurrentRange(
        uint256 tokenId,
        uint256 amountAdd0,
        uint256 amountAdd1
    ) external returns (uint128 liquidity, uint256 amount0, uint256 amount1){
        return _increaseLiquidityCurrentRange(tokenId, amountAdd0, amountAdd1);
    }

    /// @notice A function that decreases the current liquidity by half.
    /// @param tokenId The id of the erc721 token
    /// @return amount0 The amount received back in token0
    /// @return amount1 The amount returned back in token1
    function _decreaseLiquidity(
        uint256 tokenId,
        uint8 percentageToRemove
    ) internal returns (uint256 amount0, uint256 amount1) {
        // caller must be the owner of the NFT
        require(msg.sender == pools[tokenId].owner, "Not the owner");
        require(
            percentageToRemove > 0 && percentageToRemove <= 100,
            "Invalid percentage value"
        );
        require(block.timestamp >= pools[tokenId].lockedEnd,"Lock time not met");

        // get liquidity data for tokenId
        uint128 liquidity = pools[tokenId].liquidity;
        uint128 liquidityToRemove = (liquidity * percentageToRemove) / 100;
        require(liquidityToRemove > 0, "Liquidity to remove cannot be zero");

        // amount0Min and amount1Min are price slippage checks
        // if the amount received after burning is not greater than these minimums, transaction will fail
        INonfungiblePositionManager.DecreaseLiquidityParams
            memory params = INonfungiblePositionManager
                .DecreaseLiquidityParams({
                    tokenId: tokenId,
                    liquidity: liquidityToRemove,
                    amount0Min: 0,
                    amount1Min: 0,
                    deadline: block.timestamp
                });

        (amount0, amount1) = nonfungiblePositionManager.decreaseLiquidity(params);
        _sendToOwner(tokenId, amount0, amount1);

        if (liquidityToRemove == liquidity) {
            retrieveNFT(tokenId);
            totalPools--;
            emit PoolRemoved(tokenId, msg.sender);
        }
        //Counter
        totalLiquidityStaked -= liquidityToRemove;
    }
    function decreaseLiquidity(
        uint256 tokenId,
        uint8 percentageToRemove
    ) external returns (uint256 amount0, uint256 amount1) {
        return _decreaseLiquidity(tokenId, percentageToRemove);
    }

    /// @notice Transfers funds to owner of NFT
    /// @param tokenId The id of the erc721
    /// @param amount0 The amount of token0
    /// @param amount1 The amount of token1
    function _sendToOwner(
        uint256 tokenId,
        uint256 amount0,
        uint256 amount1
    ) private {
        // get owner of contract
        address owner = pools[tokenId].owner;
        address token0 = pools[tokenId].token0;
        address token1 = pools[tokenId].token1;
        // send collected fees to owner
        TransferHelper.safeTransfer(token0, owner, amount0);
        TransferHelper.safeTransfer(token1, owner, amount1);
    }
    
    // getting pools infos
    function getPoolInfo(
        uint256 tokenId
    )
        external
        view
        returns (
            address owner,
            uint128 liquidity,
            address token0,
            address token1,
            uint256 timePower,
            uint256 lockedEnd
        )
    {
        Pool storage pool = pools[tokenId];
        return (
            pool.owner,
            pool.liquidity,
            pool.token0,
            pool.token1,
            pool.timePower,
            pool.lockedEnd
        );
    }

    function poolLockInfo(address _user) public view returns (uint256 lockPower){
        uint256 calculateVotingPower = 0;
        uint256[] memory tokens = ownerPools[_user];
        require(tokens.length > 0, "Not have pool position!");
        for(uint256 i; i < tokens.length;){
            uint256 unlockTime = pools[tokens[i]].lockedEnd - block.timestamp;
            uint256 timePower = block.timestamp - pools[tokens[i]].timePower;
            uint256 _votePower = _calculateTimePower(timePower);
            calculateVotingPower += (_votePower * unlockTime) / 1 days;
            unchecked {
                ++i;
            }
        }
        return lockPower = calculateVotingPower;
    }
    function resetTimePower(address _user) external returns (bool){
        require(msg.sender == CONTROLLER_ADDRESS, "Unauthorize address!");
        uint256[] memory tokens = ownerPools[_user];
        for (uint256 i; i < tokens.length; ) {
            pools[tokens[i]].timePower = block.timestamp;
            unchecked {
                ++i;
            }
        }
        return true;
    }

    function _calculateTimePower(
        uint256 timePower
    ) internal view returns (uint256 votePower) {
        if (timePower <= WEEK) {
            votePower = (totalLiquidityStaked * 100) / totalPools;
        } else if (timePower <= MONTH) {
            votePower = (totalLiquidityStaked * 200) / totalPools;
        }else if (timePower <= 6 * MONTH) {
            votePower = (totalLiquidityStaked * 400) / totalPools;
        } else if (timePower <= YEAR) {
            votePower = (totalLiquidityStaked * 800) / totalPools;
        } else if (timePower <= 2 * YEAR) {
            votePower = (totalLiquidityStaked * 1600) / totalPools;
        } else if (timePower <= 3 * YEAR) {
            votePower = (totalLiquidityStaked * 3200) / totalPools;
        } else if (timePower <= 4 * YEAR) {
            votePower = (totalLiquidityStaked * 6400) / totalPools;
        } else if (timePower > 4 * YEAR) {
            votePower = (totalLiquidityStaked * 12800) / totalPools;
        }
    }

    // get 
    function poolOfAddress(
        address _owner
    ) public view returns (uint256[] memory) {
        return ownerPools[_owner];
    }

    function totalLiquidityOfPool() public view returns (uint256){
        return totalLiquidityStaked;
    }
    function totalPool() public view returns (uint256){
        return totalPools;
    }

    function getLiquidityLpOf(address user) public view returns (uint128){
        uint256 tokenId;
        uint128 liquidityOf;
        uint256 index = 0;
        for (uint256 i = 0; i < totalPools; i++) {
            if (pools[i].owner == user) {
                tokenId = i;
                index++;
            }
        }

        Pool storage pool = pools[tokenId];
        liquidityOf += pool.liquidity;
        return liquidityOf;
    }

    /// @notice Transfers the NFT to the owner
    /// @param tokenId The id of the erc721
    function retrieveNFT(uint256 tokenId) internal {
        _collectAllFees(tokenId);
        delete pools[tokenId];
        nonfungiblePositionManager.safeTransferFrom(address(this),msg.sender,tokenId);
    }
    function setController(address _address) public {
        require(msg.sender == contract_owner,"Unauthorize address!");
        CONTROLLER_ADDRESS = _address;
    }
}
