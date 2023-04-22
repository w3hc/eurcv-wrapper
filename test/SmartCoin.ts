import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { parseEther } from 'ethers/lib/utils';

describe("SmartCoin", function () {

  async function deployContractsFixture() {
    const [bank, alice, bob] = await ethers.getSigners();
    const EUR = await ethers.getContractFactory("SmartCoin")
    const eur = await EUR.deploy(bank.address)
    await eur.deployed()
    expect(await eur.registrar()).to.equal(bank.address)
    await eur.addAddressToWhitelist(bank.address)
    await eur.mint(bank.address, parseEther('10000'))
    return { eur, bank, alice, bob }
  }

  describe("Deployment", function () {
    it("Should set the right registrar", async function () {
      const { eur, bank } = await loadFixture(deployContractsFixture)
      expect(await eur.registrar()).to.equal(bank.address)
    })
  })

  describe("Interactions", function () {

    it("Should mint 10,000 units", async function () {
      const { eur, bank } = await loadFixture(deployContractsFixture)
      expect(await eur.balanceOf(bank.address)).to.equal(parseEther('10000'))
    })

    it("Should transfer 5 units to Alice but Alice's balance remains 0", async function () {
      const { eur, alice } = await loadFixture(deployContractsFixture)
      await eur.addAddressToWhitelist(alice.address)
      await eur.transfer(alice.address, parseEther('10'))
      expect(await eur.balanceOf(alice.address)).to.equal(0)
    })

    it("Should transfer 5 units to Alice", async function () {
      const { eur, alice } = await loadFixture(deployContractsFixture)

      // Alice gets whitelisted
      await eur.addAddressToWhitelist(alice.address)

      // The bank transfers 10 units to Alice
      const transfer10 = await eur.transfer(alice.address, parseEther('10'))
      const blockNumber = transfer10.blockNumber
      const transferRequested = await eur.queryFilter('TransferRequested' as any, blockNumber)
      const trasferHash = transferRequested[0].args.transferHash

      // The bank allows allows Alice to receive the money
      await eur.validateTransfer(trasferHash)
      expect(await eur.balanceOf(alice.address)).to.equal(parseEther('10'))
    })

    it("Should transfer 1 unit to Bob", async function () {
      const { eur, alice, bob } = await loadFixture(deployContractsFixture)

      // Alice gets whitelisted
      await eur.addAddressToWhitelist(alice.address)

      // The bank transfers 10 units to Alice
      const transfer10 = await eur.transfer(alice.address, parseEther('10'))
      const blockNumber = transfer10.blockNumber
      const transferRequested = await eur.queryFilter('TransferRequested' as any, blockNumber)
      const trasferHash = transferRequested[0].args.transferHash

      // The bank allows allows Alice to receive the money
      await eur.validateTransfer(trasferHash)
      expect(await eur.balanceOf(alice.address)).to.equal(parseEther('10'))

      // Bob gets whitelisted
      await eur.addAddressToWhitelist(bob.address)

      // Alice gives 1 unit to Bob
      const transfer2 = await eur.connect(alice).transfer(bob.address, parseEther('1'))
      const blockNumber2 = transfer2.blockNumber
      const transferRequested2 = await eur.queryFilter('TransferRequested' as any, blockNumber2)

      // The bank allows allows Bob to receive the money
      const trasferHash2 = transferRequested2[0].args.transferHash
      await eur.validateTransfer(trasferHash2)
      expect(await eur.balanceOf(bob.address)).to.equal(parseEther('1'))
    })

    it("Should confiscate Bob's money (1 unit)", async function () {
      const { eur, alice, bob } = await loadFixture(deployContractsFixture)

      // Alice gets whitelisted
      await eur.addAddressToWhitelist(alice.address)

      // The bank transfers 10 units to Alice
      const transfer10 = await eur.transfer(alice.address, parseEther('10'))
      const blockNumber = transfer10.blockNumber
      const transferRequested = await eur.queryFilter('TransferRequested' as any, blockNumber)
      const trasferHash = transferRequested[0].args.transferHash

      // The bank allows allows Alice to receive the money
      await eur.validateTransfer(trasferHash)
      expect(await eur.balanceOf(alice.address)).to.equal(parseEther('10'))

      // Bob gets whitelisted
      await eur.addAddressToWhitelist(bob.address)

      // Alice gives 1 unit to Bob
      const transfer2 = await eur.connect(alice).transfer(bob.address, parseEther('1'))
      const blockNumber2 = transfer2.blockNumber
      const transferRequested2 = await eur.queryFilter('TransferRequested' as any, blockNumber2)

      // The bank allows allows Bob to receive the money
      const trasferHash2 = transferRequested2[0].args.transferHash
      await eur.validateTransfer(trasferHash2)
      expect(await eur.balanceOf(bob.address)).to.equal(parseEther('1'))

      // The bank confiscates 1 unit from Bob (!)
      await eur.recall(bob.address, parseEther('1'))
      expect(await eur.balanceOf(bob.address)).to.equal(parseEther('0'))
    })

  })
})