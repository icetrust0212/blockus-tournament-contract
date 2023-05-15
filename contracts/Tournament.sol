// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Tournament is ERC1155Holder, Ownable {
    using SafeERC20 for IERC20;

    address public currencyAddress;
    address public ticketNFT; // ERC1155
    uint256 public ticketNFTId; // id of ERC1155
    uint256 public entryPrice = 10 ether;

    uint256 public tournamentId = 0;

    mapping(uint256 => mapping(address => bool)) public players;
    mapping(uint256 => uint256) numPlayers;

    event TournamentEnded(uint256 indexed tournamentId, address first, address second, address third);
    event CurrencySet(address indexed currency);
    event TicketNFTSet(address indexed ticket, uint256 ticketId);
    event EntryPriceSet(uint256 price);

    constructor(
        address _currencyAddress,
        address _ticket,
        uint256 _ticketNFTId
    ) {
        require(_currencyAddress != address(0), "Invalid token");
        require(_ticket != address(0), "Invalid ticket");

        currencyAddress = _currencyAddress;
        ticketNFT = _ticket;
        ticketNFTId = _ticketNFTId;
    }

    function enterTournament() external {
        address _playerAddress = msg.sender;

        require(
            ERC1155(ticketNFT).balanceOf(_playerAddress, ticketNFTId) > 0,
            "Player should have ticket"
        );

        require(
            IERC20(currencyAddress).balanceOf(_playerAddress) >= entryPrice,
            "Insufficient underlying token balance"
        );

        // Burn ticket NFT
        ERC1155Burnable(ticketNFT).burn(_playerAddress, ticketNFTId, 1);

        IERC20(currencyAddress).safeTransferFrom(
            _playerAddress,
            address(this),
            entryPrice
        );

        players[tournamentId][_playerAddress] = true;
        numPlayers[tournamentId]++;
    }

    function endTournament(
        address first,
        address second,
        address third
    ) external onlyOwner {
        require(
            numPlayers[tournamentId] > 2,
            "Not enough players in the tournament"
        );
        require(players[tournamentId][first], "Invalid winner");
        require(players[tournamentId][second], "Invalid winner");
        require(players[tournamentId][third], "Invalid winner");

        uint256 poolSize = IERC20(currencyAddress).balanceOf(address(this));

        uint256 firstPlacePrize = poolSize / 2;
        uint256 secondPlacePrize = (poolSize * 3) / 10;
        uint256 thirdPlacePrize = poolSize - firstPlacePrize - secondPlacePrize;

        IERC20(currencyAddress).safeTransfer(first, firstPlacePrize);
        IERC20(currencyAddress).safeTransfer(second, secondPlacePrize);
        IERC20(currencyAddress).safeTransfer(third, thirdPlacePrize);

        emit TournamentEnded(tournamentId, first, second, third);

        tournamentId ++;
    }

    function isUserRegistered(uint256 tournamentId, address user) public view returns(bool) {
        return players[tournamentId][user];
    }

    function setCurrencyAddress(address _newCurrency) external onlyOwner {
        require(_newCurrency != currencyAddress, "Aleady set");
        require(_newCurrency != address(0), "Invalid token");

        currencyAddress = _newCurrency;

        emit CurrencySet(currencyAddress);
    }

    function setTicketNFT(address _ticket, uint256 _tickeTokenId) external onlyOwner {
        require(_ticket != ticketNFT, "Already set");
        require(_ticket != address(0), "Invalid ticket");

        ticketNFT = _ticket;
        ticketNFTId = _tickeTokenId;

        emit TicketNFTSet(ticketNFT, ticketNFTId);
    }

    function setEntryPrice(uint256 _price) external onlyOwner {
        entryPrice = _price;

        emit EntryPriceSet(entryPrice);
    }
}
