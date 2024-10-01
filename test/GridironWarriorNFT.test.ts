import { expect } from "chai";
import { ethers } from "hardhat";
import { GridironWarriorNFT } from "../typechain-types";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { parseEther } from "ethers";

describe("GridironWarriorNFT", function () {
  async function deployNFTFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const RandomNumberGeneratorMock = await ethers.getContractFactory(
      "RandomNumberGeneratorMock"
    );
    const rngMock = await RandomNumberGeneratorMock.deploy();
    await rngMock.waitForDeployment();

    const GridironWarriorNFT = await ethers.getContractFactory(
      "GridironWarriorNFT"
    );
    const nft = (await GridironWarriorNFT.deploy(
      rngMock.getAddress(),
      "ipfs://QmPax1ffGTot9yHsRCMmXQpRv1VdbbwcnZ5aAuRK5u79ru/"
    )) as GridironWarriorNFT;
    await nft.waitForDeployment();

    return { nft, rngMock, owner, addr1, addr2 };
  }

  it("Should mint an NFT and assign it to the correct owner", async function () {
    const { nft, rngMock, addr1 } = await loadFixture(deployNFTFixture);
    const mintPrice = parseEther("0.01");

    await nft.setTestingMode(true);

    await nft.connect(addr1).requestToMint({ value: mintPrice });

    await rngMock.fulfillRandomWords(1);

    await nft.connect(addr1).fulfillMint();

    const ownerOfToken = await nft.ownerOf(1);
    expect(ownerOfToken).to.equal(addr1.address);
  });

  it("Should return the correct tokenURI after minting", async function () {
    const { nft, rngMock, addr1 } = await loadFixture(deployNFTFixture);
    const mintPrice = parseEther("0.01");

    await nft.setTestingMode(true);

    await nft.connect(addr1).requestToMint({ value: mintPrice });

    await rngMock.fulfillRandomWords(1);

    await nft.connect(addr1).fulfillMint();

    const tokenURI = await nft.tokenURI(1);
    expect(tokenURI).to.equal(
      "ipfs://QmPax1ffGTot9yHsRCMmXQpRv1VdbbwcnZ5aAuRK5u79ru/5.json"
    );
  });

  it("Should revert mint if max supply is reached", async function () {
    const { nft, rngMock } = await loadFixture(deployNFTFixture);
    const mintPrice = parseEther("0.01");

    await nft.setTestingMode(true);

    const signers = await ethers.getSigners();
    let simulatedRequestId = 1;

    for (let i = 0; i < 10; i++) {
      const currentAddr = signers[i];

      await nft.connect(currentAddr).requestToMint({ value: mintPrice });

      await rngMock.fulfillRandomWords(i + 1);

      await nft.connect(currentAddr).fulfillMint();

      simulatedRequestId++;
    }

    const additionalAddr = signers[10];
    await expect(
      nft.connect(additionalAddr).requestToMint({ value: mintPrice })
    ).to.be.revertedWith("Max supply reached");
  });

  it("Should revert mint if insufficient payment is sent", async function () {
    const { nft, addr1 } = await loadFixture(deployNFTFixture);
    const lowPayment = parseEther("0.001");

    await expect(
      nft.connect(addr1).requestToMint({ value: lowPayment })
    ).to.be.revertedWith("Insufficient funds to mint");
  });

  it("Should allow the owner to withdraw funds", async function () {
    const { nft, owner, addr1 } = await loadFixture(deployNFTFixture);
    const mintPrice = parseEther("0.01");

    await nft.connect(addr1).requestToMint({ value: mintPrice });

    const contractBalanceBefore = await ethers.provider.getBalance(
      nft.getAddress()
    );
    expect(contractBalanceBefore).to.equal(mintPrice);

    await expect(() => nft.connect(owner).withdraw()).to.changeEtherBalance(
      owner,
      mintPrice
    );

    const contractBalanceAfter = await ethers.provider.getBalance(
      nft.getAddress()
    );
    expect(contractBalanceAfter).to.equal(0);
  });

  it("Should not allow duplicate random numbers in fulfillMint", async function () {
    const { nft, rngMock } = await loadFixture(deployNFTFixture);
    const mintPrice = parseEther("0.01");

    await nft.setTestingMode(true);

    const randomNumbers = Array.from({ length: 10 }, (_, i) => i + 1);
    const mintedNumbers = new Set();
    const signers = await ethers.getSigners();

    for (let i = 0; i < 10; i++) {
      const currentAddr = signers[i];

      await nft.connect(currentAddr).requestToMint({ value: mintPrice });

      const randomValue = randomNumbers[i];

      await rngMock.fulfillRandomWords(i + 1);

      await nft.connect(currentAddr).fulfillMint();

      expect(mintedNumbers.has(randomValue)).to.be.false;
      mintedNumbers.add(randomValue);
    }
  });

  it("Should revert if withdraw is called with zero balance", async function () {
    const { nft, owner } = await loadFixture(deployNFTFixture);

    await expect(nft.connect(owner).withdraw()).to.be.revertedWith(
      "No funds to withdraw"
    );
  });

  it("Should correctly enable and disable testing mode", async function () {
    const { nft, owner } = await loadFixture(deployNFTFixture);

    await nft.connect(owner).setTestingMode(true);
    expect(await nft.testingMode()).to.equal(true);

    await nft.connect(owner).setTestingMode(false);
    expect(await nft.testingMode()).to.equal(false);
  });

  it("Should allow minting with excess payment", async function () {
    const { nft, addr1 } = await loadFixture(deployNFTFixture);
    const excessPayment = parseEther("0.1");

    await expect(nft.connect(addr1).requestToMint({ value: excessPayment })).to
      .not.be.reverted;
  });

  it("Should not allow querying tokenURI for a non-existent token", async function () {
    const { nft } = await loadFixture(deployNFTFixture);

    await expect(nft.tokenURI(999)).to.be.revertedWith(
      "ERC721Metadata: URI query for nonexistent token"
    );
  });

  it("Should revert mint if maxSupply is changed and exceeded", async function () {
    const { nft, rngMock } = await loadFixture(deployNFTFixture);
    const mintPrice = parseEther("0.01");

    await nft.setTestingMode(true);

    await nft.setMaxSupply(5);

    const signers = await ethers.getSigners();

    for (let i = 0; i < 5; i++) {
      const currentAddr = signers[i];

      await nft.connect(currentAddr).requestToMint({ value: mintPrice });

      await rngMock.fulfillRandomWords(i + 1);

      await nft.connect(currentAddr).fulfillMint();
    }

    await expect(
      nft.connect(signers[5]).requestToMint({ value: mintPrice })
    ).to.be.revertedWith("Max supply reached");
  });

  it("Should emit MintRequested event after a mint request", async function () {
    const { nft, addr1, owner } = await loadFixture(deployNFTFixture);
    const mintPrice = parseEther("0.01");

    await nft.connect(owner).setTestingMode(true);

    await expect(nft.connect(addr1).requestToMint({ value: mintPrice }))
      .to.emit(nft, "MintRequested")
      .withArgs(addr1.address, 1);
  });
  it("Should emit NFTMinted event after the mint is fulfilled", async function () {
    const { nft, rngMock, addr1 } = await loadFixture(deployNFTFixture);
    const mintPrice = parseEther("0.01");

    await nft.setTestingMode(true);

    await nft.connect(addr1).requestToMint({ value: mintPrice });

    await rngMock.fulfillRandomWords(1);

    await expect(nft.connect(addr1).fulfillMint())
      .to.emit(nft, "NFTMinted")
      .withArgs(
        1,
        "ipfs://QmPax1ffGTot9yHsRCMmXQpRv1VdbbwcnZ5aAuRK5u79ru/5.json",
        5,
        addr1.address
      );
  });

  it("Should emit FundsWithdrawn event after the owner withdraws funds", async function () {
    const { nft, owner, addr1 } = await loadFixture(deployNFTFixture);
    const mintPrice = parseEther("0.01");

    await nft.connect(addr1).requestToMint({ value: mintPrice });

    await expect(nft.connect(owner).withdraw())
      .to.emit(nft, "FundsWithdrawn")
      .withArgs(owner.address, mintPrice);
  });

  it("Should revert if user tries to mint more than one NFT", async function () {
    const { nft, rngMock, addr1 } = await loadFixture(deployNFTFixture);
    const mintPrice = parseEther("0.01");

    await nft.setTestingMode(true);

    await nft.connect(addr1).requestToMint({ value: mintPrice });

    await rngMock.fulfillRandomWords(1);

    await nft.connect(addr1).fulfillMint();

    await expect(
      nft.connect(addr1).requestToMint({ value: mintPrice })
    ).to.be.revertedWith("You can mint only once");
  });

  it("Should return the correct tokenURI for the owner when calling findMyNFT", async function () {
    const { nft, rngMock, owner, addr1 } = await loadFixture(deployNFTFixture);
    const mintPrice = parseEther("0.01");

    await nft.connect(owner).setTestingMode(true);

    await nft.connect(addr1).requestToMint({ value: mintPrice });

    await rngMock.fulfillRandomWords(1);

    await nft.connect(addr1).fulfillMint();

    const tokenURI = await nft.connect(addr1).findMyNFT();
    expect(tokenURI).to.equal(
      "ipfs://QmPax1ffGTot9yHsRCMmXQpRv1VdbbwcnZ5aAuRK5u79ru/5.json"
    );
  });
});
