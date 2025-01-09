const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "TokenMaster";
const SYMBOL = "TM21";

const EVENT_NAME = "Test ETH";
const EVENT_COST = ethers.utils.parseUnits('1', 'ether');
const EVENT_TICKET = 100;
const EVENT_DATE = "Dec 20 2025";
const EVENT_TIME = "12:00 PM IST";
const EVENT_LOCATION = "Test Location";

describe("TokenMaster", () => {
  let tokenMaster;
  let deployer, buyer;

  beforeEach("Deploy the Contract", async () => {
    [deployer, buyer] = await ethers.getSigners();
    const TokenMaster = await ethers.getContractFactory(NAME);
    tokenMaster = await TokenMaster.deploy(NAME, SYMBOL);
    const transaction = await tokenMaster
      .connect(deployer)
      .list(EVENT_NAME, EVENT_COST, EVENT_TICKET, EVENT_DATE, EVENT_TIME, EVENT_LOCATION);
    await transaction.wait();
  });

  describe("Deployment", () => {
    it("Sets the Name", async () => {
      expect(await tokenMaster.name()).to.equal(NAME);
    });

    it("Sets the Symbol", async () => {
      expect(await tokenMaster.symbol()).to.equal(SYMBOL);
    });

    it("Sets the Owner", async () => {
      expect(await tokenMaster.owner()).to.equal(deployer.address);
    });
  });

  describe("Main Events", () => {
    it("Updates Event count", async () => {
      const eventId = await tokenMaster.eventId();
      expect(eventId.toNumber()).to.equal(1);
    });

    it("Checks Event Attribute", async () => {
      const event = await tokenMaster.getEvent(1);
      expect(event.id.toNumber()).to.equal(1);
      expect(event.eventName).to.equal(EVENT_NAME);
      expect(event.cost.toString()).to.equal(EVENT_COST.toString());
      expect(event.tickets).to.equal(EVENT_TICKET);
      expect(event.date).to.equal(EVENT_DATE);
      expect(event.time).to.equal(EVENT_TIME);
      expect(event.location).to.equal(EVENT_LOCATION);
    });
  });

  describe("Minting", () => {
    const ID = 1;
    const SEAT = 50;
    const AMOUNT = ethers.utils.parseUnits('1', 'ether');

    beforeEach(async () => {
      const transaction = await tokenMaster.connect(buyer).mint(ID, SEAT, { value: AMOUNT });
      await transaction.wait();
    });

    it("Updates the ticket count", async () => {
      const event = await tokenMaster.getEvent(1);
      expect(event.tickets).to.equal(EVENT_TICKET - 1);
    });

    it("Updates the Buying Status", async () => {
      const hasBought = await tokenMaster.hasBought(ID, buyer.address);
      expect(hasBought).to.equal(true);
    });

    it("Updates the Seat Taken", async () => {
      const seatTaken = await tokenMaster.seatTaken(ID, SEAT);
      expect(seatTaken).to.equal(buyer.address);
    });

    it("Updates the Contract Balance", async () => {
      const balance = await ethers.provider.getBalance(tokenMaster.address);
      // eslint-disable-next-line no-unused-expressions
      expect(balance.eq(AMOUNT)).to.be.true; // Use `.eq()` for BigNumber comparison | Using Ethers' BigNumber Methods
    });
  });

  describe("Withdrawing", () => {
    const ID = 1;
    const SEAT = 50;
    const AMOUNT = ethers.utils.parseUnits('1', 'ether');
    let balanceBefore;

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address);
      let transaction = await tokenMaster.connect(buyer).mint(ID, SEAT, { value: AMOUNT });
      await transaction.wait();
      transaction = await tokenMaster.connect(deployer).withdraw();
      await transaction.wait();
    });

    it("Updates the deployer balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      // eslint-disable-next-line no-unused-expressions
      expect(balanceAfter.gt(balanceBefore)).to.be.true; // Use `.gt()` for BigNumber comparison | Using Ethers' BigNumber Methods
    });
  });
});
