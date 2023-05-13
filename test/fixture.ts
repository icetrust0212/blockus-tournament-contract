import { ethers, upgrades } from "hardhat";
import { ZERO_ADDRESS } from "./utils";

export async function fixture() {
  const [owner, ...users] = await ethers.getSigners();

  const currencyFactory = await ethers.getContractFactory("MockERC20");
  const currency = await currencyFactory.deploy();
  
  const ticketFactory = await ethers.getContractFactory("Ticket");
  const ticket = await ticketFactory.deploy();

  const tournamentFactory = await ethers.getContractFactory('Tournament');
  const tournament = await tournamentFactory.deploy(
    currency.address,
    ticket.address,
    0
  );

  return {  owner, users, tournament, currency, ticket };
}