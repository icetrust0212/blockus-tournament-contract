import { expect } from "chai";
import { loadFixture } from "ethereum-waffle"
import {ethers} from "hardhat";
import { DEAD_ADDRESS } from "./utils";
import { fixture } from "./fixture";

describe("Tournament Test", () => {
    it("Deploy ",async () => {
        const {owner, users, tournament, currency, ticket} = await loadFixture(fixture);

        expect(await tournament.owner()).to.be.equal(owner.address);
    });

    it("Shouldn't be able to enter tournament without ticket",async () => {
        const {owner, users, tournament, currency, ticket} = await loadFixture(fixture);
        
        await expect(tournament.connect(users[0]).enterTournament()).to.be.revertedWith("Player should have ticket");
    })

    it("Shouldn't be able to enter tournament without enough currency",async () => {
        const {owner, users, tournament, currency, ticket} = await loadFixture(fixture);
        // Mint ticket
        await ticket.connect(users[0]).mint(10);
        await ticket.connect(users[1]).mint(10);
        await ticket.connect(users[2]).mint(10);

        await expect(tournament.connect(users[0]).enterTournament()).to.be.revertedWith("Insufficient underlying token balance");
    });

    it("Should be able to enter tournament with ticket and currency",async () => {
        const {owner, users, tournament, currency, ticket} = await loadFixture(fixture);
        // Mint currency
        await currency.connect(users[0]).mint(ethers.utils.parseEther("1000"));
        await currency.connect(users[1]).mint(ethers.utils.parseEther("1000"));
        await currency.connect(users[2]).mint(ethers.utils.parseEther("1000"));
        // Approve currency and ticket first
        await currency.connect(users[0]).approve(tournament.address, ethers.utils.parseEther("10000"));
        await currency.connect(users[1]).approve(tournament.address, ethers.utils.parseEther("10000"));
        await currency.connect(users[2]).approve(tournament.address, ethers.utils.parseEther("10000"));

        await ticket.connect(users[0]).setApprovalForAll(tournament.address, true);
        await ticket.connect(users[1]).setApprovalForAll(tournament.address, true);
        await ticket.connect(users[2]).setApprovalForAll(tournament.address, true);

        // contract initial pool balance
        const initialPoolBalance = await currency.balanceOf(tournament.address);
        // initial user nft balance
        const initialTicketBalance = await ticket.balanceOf(users[0].address, 0);
        await expect(tournament.connect(users[0]).enterTournament()).not.reverted;
        await expect(tournament.connect(users[1]).enterTournament()).not.reverted;
        await expect(tournament.connect(users[2]).enterTournament()).not.reverted;

        const afterPoolBalance = await currency.balanceOf(tournament.address);
        const afterTicketBalance = await ticket.balanceOf(users[0].address, 0);

        expect(afterPoolBalance.sub(initialPoolBalance)).to.be.equal(ethers.utils.parseEther("30"));
        expect(initialTicketBalance.sub(afterTicketBalance)).to.be.equal(1);
    });

    it ("Check contract status",async () => {
        const {owner, users, tournament, currency, ticket} = await loadFixture(fixture);
        // Check if users are registered in this tournament
        const tournamentId = await tournament.tournamentId();
        expect(await tournament.isUserRegistered(tournamentId, users[0].address)).to.be.equal(true);
        expect(await tournament.isUserRegistered(tournamentId, users[1].address)).to.be.equal(true);
        expect(await tournament.isUserRegistered(tournamentId, users[2].address)).to.be.equal(true);
    })

    it ("Shouldn't be able to end tournament from non-owner",async () => {
        const {owner, users, tournament, currency, ticket} = await loadFixture(fixture);
        await expect(tournament.connect(users[3]).endTournament(users[0].address, users[1].address, users[2].address)).to.be.revertedWith("Ownable: caller is not the owner");
    })

    it ("Shouldn't be able to end tournament with non-participated users",async () => {
        const {owner, users, tournament, currency, ticket} = await loadFixture(fixture);
        await expect(tournament.endTournament(users[0].address, users[1].address, users[3].address)).to.be.revertedWith("Invalid winner");
    })

    it("Should be able to end tournament",async () => {
        const {owner, users, tournament, currency, ticket} = await loadFixture(fixture);

        // Initial winner balance
        const initialCurrencyBalance = await currency.balanceOf(users[0].address);
        await expect(tournament.endTournament(users[0].address, users[1].address, users[2].address)).not.reverted;

        // after winner balance
        const afterCurrencyBalance = await currency.balanceOf(users[0].address);
        expect(afterCurrencyBalance.sub(initialCurrencyBalance)).to.be.equal(ethers.utils.parseEther("15"));
    })

})