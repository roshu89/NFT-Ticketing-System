const {expect} = require("chai");
const { ethers } = require("hardhat");

describe("TokenMaster", () => {
  describe("Deployment", () => {
    it("Sets the Name", async () => {
      const TokenMaster = await ethers.getContractFactory("TokenMaster");
      let tokenMaster = await TokenMaster.deploy("TokenMaster", "TM21");
      // await tokenMaster.deployed();
      let name = await tokenMaster.name();
      expect(name).equal("TokenMaster")
      console.log("TokenMaster address: ", tokenMaster.address);
    })
  })
})