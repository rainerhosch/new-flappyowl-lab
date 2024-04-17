// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
/*
 * ** author  : flappyowl foundation
 * ** package : @contracts/interfaces/IFRC.sol
 */
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
interface IFRC is IERC20 {
    /*-------------------------------------------------------------------- *
     * Error
     * -------------------------------------------------------------------- *
     */
    error NotController();
    error NotMinter();
    error NotOwner();

    error ZeroAmount();
    error ZeroAddress();
    error InitialSupplyMinted();

    event Mint(
        address indexed _account,
        uint256 indexed _amount,
        uint256 indexed _circulating_supply
    );

    function mint(address to, uint256 amount) external returns (bool);
    // function MINTER_ADDRESS() external view returns (address);
}
