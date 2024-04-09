// SPDX-License-Identifier: MIT
/*
 * ** author  : Flappyowl Foundation
 * ** package : @contracts/ERC721/FlappyRewardCoin.sol
 */
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract FlappyRewardCoin is ERC20, ERC20Burnable, Ownable {
    //--------------------------------------------------------------------
    // VARIABLES
    using SafeERC20 for ERC20;
    using SafeMath for uint256;

    mapping(address => bool) controllers;
    mapping(address => uint256) balances;
    bool public initialMinted;

    // Initial supply: total 21M
    uint public initialSupply = 21 * 1e6 * 1e18;
    // addresses
    address constant FOUNDATION = 0xeE66bda0BC2C9ab72127Ce90944b4048775f5Fd9; // 5% FOR FOUNDATION LONG-TERM ENDOWMENT.
    address constant PUBLIC_SALE = 0x8e14398d793938a3e17852320CB97d1479a05fEb; // 70% PUBLIC SALE
    address constant GENESIS_POOL = 0xEE5a230528B70c6CAA1cD17fA54AEA481241deAA; // 15% GENESIS LIQUIDITY POOL.
    address constant AIRDROP = 0xa977bb7de34298126092738DB59177541Ab6080d; // 10% AIRDROP ALOCATION.
    address[] public INITIAL_SUPPLY_RECEIVER = [
        FOUNDATION,
        PUBLIC_SALE,
        GENESIS_POOL,
        AIRDROP
    ];

    // allocations as a percentage of total supply
    uint constant FOUNDATION_ALLOCATION = 5;
    uint constant PUBLIC_SALE_ALLOCATION = 70;
    uint constant GENESIS_POOL_ALLOCATION = 15;
    uint constant AIRDROP_ALLOCATION = 10;
    uint[] public INITIAL_SUPPLY_ALLOCATION = [
        FOUNDATION_ALLOCATION,
        PUBLIC_SALE_ALLOCATION,
        GENESIS_POOL_ALLOCATION,
        AIRDROP_ALLOCATION
    ];

    //--------------------------------------------------------------------
    // ERRORS

    error FlappyRewardCoin__OnlyControllersCanMint();

    //--------------------------------------------------------------------
    // CONSTRUCTOR

    constructor() ERC20("FRC", "FRC") {
        _genesisSupply();
    }

    //--------------------------------------------------------------------
    // FUNCTIONS
    function _genesisSupply() internal {
        uint256 _amount;
        address _receiver;
        uint len = INITIAL_SUPPLY_RECEIVER.length;
        require(!initialMinted, "Initial supply has minted.");
        initialMinted = true;
        for (uint256 i = 0; i < len; i++) {
            _receiver = INITIAL_SUPPLY_RECEIVER[i];
            _amount = (INITIAL_SUPPLY_ALLOCATION[i] * initialSupply) / 100;
            _mint(_receiver, _amount);
        }
    }

    function mint(address to, uint256 amount) external {
        if (!controllers[msg.sender])
            revert FlappyRewardCoin__OnlyControllersCanMint();
        _mint(to, amount);
    }

    function burnFrom(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    //--------------------------------------------------------------------
    // OWNER FUNCTIONS

    function setController(
        address controller,
        bool _state
    ) external payable onlyOwner {
        controllers[controller] = _state;
    }
}
