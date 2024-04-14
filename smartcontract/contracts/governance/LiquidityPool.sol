// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.20;
pragma abicoder v2;

import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {TickMath} from "@uniswap/v3-core/contracts/libraries/TickMath.sol";
import {TransferHelper} from "@uniswap/v3-core/contracts/libraries/TransferHelper.sol";
import {INonfungiblePositionManager} from "@uniswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol";
import {IFRC} from "../interfaces/IFRC.sol";

contract LiquidityPool is IERC721Receiver {
    address public constant nonfungiblePositionManager =
        0x1238536071E1c677A632429e3655c799b22cDA52; //contract at spolia testnet
    uint24 public constant poolFee = 3000; // base pool fees is 0.3%
    uint24 public constant taxFee = 10000; // tax from earning LP fees is 1% for inceas base LP
    uint256 public totalPools;

    IFRC internal FRC;

    /// @notice Represents the deposit of an NFT
    struct Pool {
        address owner;
        uint128 liquidity;
        address token0;
        address token1;
        uint256 lockedStart;
        uint256 lockedEnd;
    }

    /// pools[tokenId] => Pool
    mapping(uint256 => Pool) public pools;

    event PoolCreated(uint256 indexed tokenId, address indexed owner);
    event PoolRemoved(uint256 indexed tokenId, address indexed owner);

    constructor(address _token) {
        FRC = IFRC(_token);
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
        // _createPool(operator, tokenId);
        return this.onERC721Received.selector;
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
            lockedStart: block.timestamp,
            lockedEnd: lockTime
        });

        totalPools++; // Increment totalPools when a new pool is created
        emit PoolCreated(tokenId, owner);
    }

    /// @notice Calls the mint function defined in periphery, mints the same amount of each token.
    /// @return tokenId The id of the newly minted ERC721
    /// @return liquidity The amount of liquidity for the position
    /// @return amount0 The amount of token0
    /// @return amount1 The amount of token1
    function creatPool(uint256 _amount0, uint256 _amount1, uint256 _lockYears)
        external
        returns (
            uint256 tokenId,
            uint128 liquidity,
            uint256 amount0,
            uint256 amount1
        )
    {
        // For this example, we will provide equal amounts of liquidity in both assets.
        // Providing liquidity in both assets means liquidity will be earning fees and is considered in-range.
        // 5 * 1e6 * 1e18; // 5M FRC for create LP
        uint256 amount0ToMint =  _amount0;
        uint256 amount1ToMint = _amount1;

        // transfer tokens to contract
        TransferHelper.safeTransferFrom(
            FRC,
            msg.sender,
            address(this),
            amount0ToMint
        );

        // Approve the position manager
        TransferHelper.safeApprove(
            FRC,
            address(nonfungiblePositionManager),
            amount0ToMint
        );

        // The values for tickLower and tickUpper may not work for all tick spacings.
        // Setting amount0Min and amount1Min to 0 is unsafe.
        INonfungiblePositionManager.MintParams memory params = INonfungiblePositionManager
            .MintParams({
                token0: FRC,
                token1: address(0), // ETH address
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
        (tokenId, liquidity, amount0, amount1) = nonfungiblePositionManager
            .mint(params);

        // Create a deposit
        _createPool(msg.sender, tokenId, _lockYears);

        // Remove allowance and refund in both assets.
        if (amount0 < amount0ToMint) {
            TransferHelper.safeApprove(
                FRC,
                address(nonfungiblePositionManager),
                0
            );
            uint256 refund0 = amount0ToMint - amount0;
            TransferHelper.safeTransfer(FRC, msg.sender, refund0);
        }

        if (amount1 < amount1ToMint) {
            TransferHelper.safeApprove(
                address(0),
                address(nonfungiblePositionManager),
                0
            );
            uint256 refund1 = amount1ToMint - amount1;
            TransferHelper.safeTransfer(address(0), msg.sender, refund1);
        }
    }

    /// @notice Collects the fees associated with provided liquidity
    /// @dev The contract must hold the erc721 token before it can collect fees
    /// @param tokenId The id of the erc721 token
    /// @return amount0 The amount of fees collected in token0
    /// @return amount1 The amount of fees collected in token1
    function collectAllFees(
        uint256 tokenId
    ) external returns (uint256 amount0, uint256 amount1) {
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

        uint256 taxForLP = (amount1 * taxFee) / 100;
        increaseLiquidityCurrentRange(0, 0, taxForLP);
        _sendToOwner(tokenId, amount0, amount1 - taxForLP);
    }

    /// @notice A function that decreases the current liquidity by half.
    /// @param tokenId The id of the erc721 token
    /// @return amount0 The amount received back in token0
    /// @return amount1 The amount returned back in token1
    function decreaseLiquidity(
        uint256 tokenId,
        uint8 percentageToRemove
    ) external returns (uint256 amount0, uint256 amount1) {
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

        (amount0, amount1) = nonfungiblePositionManager.decreaseLiquidity(
            params
        );
        _sendToOwner(tokenId, amount0, amount1);

        if (liquidityToRemove >= liquidity) {
            retrieveNFT(tokenId);
            totalPools--;
            emit PoolRemoved(tokenId, owner);
        }
    }

    /// @notice Increases liquidity in the current range
    /// @dev Pool must be initialized already to add liquidity
    /// @param tokenId The id of the erc721 token
    /// @param amountAdd0 The amount to add of token0
    /// @param amountAdd1 The amount to add of token1
    function increaseLiquidityCurrentRange(
        uint256 tokenId,
        uint256 amountAdd0,
        uint256 amountAdd1
    ) external returns (uint128 liquidity, uint256 amount0, uint256 amount1) {
        address owner = pools[tokenId].owner;
        uint256 token0 = deposits[tokenId].token0;
        uint256 token1 = deposits[tokenId].token1;
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

        (liquidity, amount0, amount1) = nonfungiblePositionManager
            .increaseLiquidity(params);

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

        if (amount1 < amount1ToMint) {
            TransferHelper.safeApprove(
                token1,
                address(nonfungiblePositionManager),
                0
            );
            uint256 refund1 = amount1ToMint - amount1;
            TransferHelper.safeTransfer(token1, owner, refund1);
        }
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
            uint256 lockedStart,
            uint256 lockedEnd
        )
    {
        Pool storage pool = pools[tokenId];
        return (
            pool.owner,
            pool.liquidity,
            pool.token0,
            pool.token1,
            pool.locked
        );
    }

    // get 
    function poolOfAddress(
        address owner
    ) external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < pools.length(); i++) {
            if (pools[i].owner == owner) {
                count++;
            }
        }
        
        uint256[] memory poolIds = new uint256[](count);
        
        uint256 index = 0;
        for (uint256 i = 0; i < totalPools; i++) {
            if (pools[i].owner == owner) {
                poolIds[index] = i;
                index++;
            }
        }

        return poolIds;
    }

    /// @notice Transfers the NFT to the owner
    /// @param tokenId The id of the erc721
    function retrieveNFT(uint256 tokenId) internal {
        collectAllFees(tokenId);
        delete pools[tokenId];
        nonfungiblePositionManager.safeTransferFrom(
            address(this),
            msg.sender,
            tokenId
        );
    }
}