// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("MockERC20", "TUSDC") {

    }

    function mint(uint256 _amount) external {
        _mint(msg.sender, _amount);
    }
}