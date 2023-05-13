// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract Ticket is ERC1155Burnable {
    uint256 id = 0;

    constructor() ERC1155("https://") {

    }

    function mint(uint256 _quantity) external {
        _mint(msg.sender, id, _quantity, "");
    }
}