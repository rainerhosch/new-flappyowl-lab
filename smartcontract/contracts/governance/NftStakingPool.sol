// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
/*
 * ** author  : flappyowl foundation
 * ** package : @contracts/governance/NftStakingPool.sol
 */
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {IFlappyOwlNftTestnet} from "../interfaces/IFlappyOwlNftTestnet.sol";
import {IStakingPoolNft} from "../interfaces/IStakingPoolNft.sol";

contract NftStakingPool is IERC721Receiver, IStakingPoolNft {
    uint256 internal constant WEEK = 7 days;
    uint256 internal constant MONTH = 30 days;
    uint256 internal constant YEAR = 365 days;

    using SafeMath for uint256;
    IFlappyOwlNftTestnet nft;

    struct StakedNft {
        address owner;
        uint256 stakingTime;
    }

    // address public controller;
    uint256 public totalNftStakingPool;

    address public CONTROLLER_ADDRESS;
    address private owner;
    mapping(uint256 => StakedNft) pools;
    mapping(address => uint256) public stakedNftBalance;
    mapping(address => uint256) public lastClaimBlock;

    constructor(address _nftAddress) {
        owner = msg.sender;
        nft = IFlappyOwlNftTestnet(_nftAddress);
    }

    function stake(uint256[] calldata tokenIds) external {
        uint256 tokenId;
        uint256 stakedCount;
        uint256 len = tokenIds.length;
        for (uint256 i; i < len; ) {
            tokenId = tokenIds[i];
            if (pools[tokenId].owner != address(0)) {
                revert FlappyOwlPos__ItemAlreadyStaked();
            }
            if (nft.ownerOf(tokenId) != msg.sender) {
                revert FlappyOwlPos__NotItemOwner();
            }

            nft.safeTransferFrom(msg.sender, address(this), tokenId);
            // nft.setApprovalForAll(address(nft), true);
            pools[tokenId] = StakedNft(msg.sender, block.timestamp);
            emit ItemStaked(tokenId, msg.sender, block.timestamp);
            unchecked {
                stakedCount++;
                ++i;
            }
        }
        stakedNftBalance[msg.sender] += stakedCount;
        totalNftStakingPool = totalNftStakingPool + stakedCount;
    }

    function unstake(address user, uint256[] calldata tokenIds) external returns (uint256[] memory unstakedToken){
        _unstake(user, tokenIds);
        return unstakedToken = tokenIds;
    }

    function _unstake(address user, uint256[] calldata tokenIds) internal {
        uint256 tokenId;
        uint256 unstakedCount;
        uint256 len = tokenIds.length;
        for (uint256 i; i < len; ) {
            tokenId = tokenIds[i];
            require(pools[tokenId].owner == user, "Not Owner");
            nft.safeTransferFrom(address(this), user, tokenId);
            delete pools[tokenId];
            emit ItemUnstaked(tokenId, user, block.timestamp);
            unchecked {
                unstakedCount++;
                ++i;
            }
        }
        stakedNftBalance[msg.sender] -= unstakedCount;
        totalNftStakingPool = totalNftStakingPool - unstakedCount;
    }
    //--------------------------------------------------------------------
    // VIEW FUNCTIONS
    
    function totalNftStakingOfPool() public view returns (uint256){
        return totalNftStakingPool;
    }
    function poolStakingInfo(address _user) public view returns (uint256 votingPower){
        uint256 balance = stakedNftBalance[_user];
        uint256 calculateVotingPower;
        require(balance > 0, "Not have staked nfts!");
        uint256[] memory tokens = tokensOfOwner(_user);
        for (uint256 i; i < tokens.length; ) {
            uint256 stakingPeriod = block.timestamp - pools[tokens[i]].stakingTime;
            uint256 _votePower = _calculateVotePower(stakingPeriod);
            calculateVotingPower += (100 * _votePower * stakingPeriod * 1e18) / 1 days;
            unchecked {
                ++i;
            }
        }
        return votingPower = calculateVotingPower;
    }

    function resetStakingTime(address _user) public returns (bool){
        require(msg.sender == CONTROLLER_ADDRESS, "Unauthorize address!");
        uint256[] memory tokens = tokensOfOwner(_user);
        for (uint256 i; i < tokens.length; ) {
            pools[tokens[i]].stakingTime = block.timestamp;
            unchecked {
                ++i;
            }
        }
        return true;
    }

    function _calculateVotePower(
        uint256 stakingPeriod
    ) internal view returns (uint256 votePower) {
        if (stakingPeriod <= WEEK) {
            votePower = 100 / totalNftStakingPool;
        } else if (stakingPeriod < MONTH) {
            votePower = 200 / totalNftStakingPool;
        }else if (stakingPeriod < 6 * MONTH) {
            votePower = 400 / totalNftStakingPool;
        } else if (stakingPeriod >= 6 * MONTH) {
            votePower = 800 / totalNftStakingPool;
        } else if (stakingPeriod >= YEAR) {
            votePower = 1600 / totalNftStakingPool;
        }
    }
    
    function tokensOfOwner(
        address user
    ) public view returns (uint256[] memory tokens) {
        uint256 balance = stakedNftBalance[user];
        require(balance > 0, "Not have staked nfts!");
        uint256 supply = nft.totalSupply();
        tokens = new uint256[](balance);
        uint256 counter;
        if (balance == 0) {
            return tokens;
        }

        unchecked {
            for (uint256 i; i <= supply; ++i) {
                if (pools[i].owner == user) {
                    tokens[counter] = i;
                    counter++;
                }
                if (counter == balance) {
                    return tokens;
                }
            }
        }
    }
    function setController(address _address) public {
        require(msg.sender == owner,"Unauthorize address!");
        CONTROLLER_ADDRESS = _address;
    }
    
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}
