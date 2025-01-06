const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "TokenMaster";
const SYMBOL = "TM21";

const EVENT_NAME = "Test ETH";
const EVENT_COST = ethers.utils.parseUnits('1', 'ether');
const EVENT_MAX_TICKET = 100;
const EVENT_DATE = "Dec 20 2025";
const EVENT_TIME = "12:00 PM IST";
const EVENT_LOCATION = "Test Location";


describe("TokenMaster", () => {
  let tokenMaster;
  let deployer, buyer

  beforeEach("Deploy the Contract", async () => {
    [deployer, buyer] = await ethers.getSigners();
    const TokenMaster = await ethers.getContractFactory(NAME);
    tokenMaster = await TokenMaster.deploy(NAME, SYMBOL);
    const addEvent = await tokenMaster.connect(deployer).list(EVENT_NAME, EVENT_COST, EVENT_MAX_TICKET, EVENT_DATE, EVENT_TIME, EVENT_LOCATION);
    await addEvent.wait();
  })

  describe("Deployment", () => {

    it("Sets the Name", async () => {
      // await tokenMaster.deployed();
      expect(await tokenMaster.name()).equal(NAME)
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
      expect(event.maxTickets).equal(EVENT_MAX_TICKET);
      expect(event.date).equal(EVENT_DATE);
      expect(event.time).equal(EVENT_TIME);
      expect(event.location).equal(EVENT_LOCATION);

    })
  })

})