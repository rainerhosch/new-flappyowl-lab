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
        uint256 _amount,
        uint256 _circulating_supply
    );

    function mint(address to, uint256 amount) external returns (bool);
    function removeMinter(address _address) external returns (bool);
    function setMinter(address[] memory _address) external returns (bool);
    function isMinter(address _address) external view returns (bool);
    function CONTROLLER_ADDRESS() external view returns (address);
    function MINTER_ADDRESS() external view returns (address[] memory);
}
