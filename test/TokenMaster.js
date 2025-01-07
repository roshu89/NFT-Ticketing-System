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
    const transaction = await tokenMaster.connect(deployer).list(EVENT_NAME, EVENT_COST, EVENT_TICKET, EVENT_DATE, EVENT_TIME, EVENT_LOCATION);
    await transaction.wait();
  })

  describe("Deployment", () => {

    it("Sets the Name", async () => {
      // await tokenMaster.deployed();
      expect(await tokenMaster.name()).equal(NAME);
      // console.log("TokenMaster address: ", tokenMaster.address);
    })

    it("Sets the Symbol", async () => {
      expect(await tokenMaster.symbol()).equal(SYMBOL)
    })

    it("Sets the Owner", async () => {
      expect(await tokenMaster.owner()).equal(deployer.address);
    })

  })

  describe("Main Events", () => {

    it("Updates Event count", async () => {
      const eventId = await tokenMaster.eventId();
      expect(eventId).equal(1);
    })
    it("Checks Event Attribute", async () => {
      const event = await tokenMaster.getEvent(1);
      expect(event.id).equal(1);
      expect(event.eventName).equal(EVENT_NAME);
      expect(event.cost).equal(EVENT_COST);
      expect(event.maxTickets).equal(EVENT_TICKET);
      expect(event.date).equal(EVENT_DATE);
      expect(event.time).equal(EVENT_TIME);
      expect(event.location).equal(EVENT_LOCATION);

    })
  })

  describe("Minting", () => {
    const ID = 1;
    const SEAT = 50;
    const AMOUNT = ethers.utils.parseUnits('1','ether');


    beforeEach(async () => {
      const transaction = await tokenMaster.connect(buyer).mint(ID, SEAT, { value: AMOUNT });
      await transaction.wait();
    })
    
    it("Updates the ticket count", async () => {
      const event = await tokenMaster.getEvent(1);
      expect(event.tickets).equal(EVENT_TICKET - 1);
    })

    it("Updates the Buying Status", async () => {
      const hasBought = await tokenMaster.hasBought(ID, buyer.address);
      expect(hasBought).equal(true)
    })
    it("Updates the Seat Taken", async () => {
      const seatTaken = await tokenMaster.seatTaken(ID, SEAT);
      expect(seatTaken).equal(buyer.address);
    })
    
    it("Updates the Contract Balance", async () => {
      const balance = await ethers.provider.getBalance(tokenMaster.address);
      expect(balance).equal(AMOUNT);
    })

  })

  describe("Widthrawing", () => {
    const ID = 1;
    const SEAT = 50;
    const AMOUNT = ethers.utils.parseUnits('1','ether');
    let balanceBefore
    
    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address);
      let transaction = await tokenMaster.connect(buyer).mint(ID, SEAT, { value: AMOUNT });
      await transaction.wait();
      transaction = await tokenMaster.connect(deployer).withdraw();;
      await transaction.wait()

    })

    it("Updates the deployer balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.greaterThan(balanceBefore);
    })

  })
})