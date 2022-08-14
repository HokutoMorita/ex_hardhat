import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"

describe("MyNFT", () => {
    const deployMyNftFixture = async () => {
        const MyNFT = await ethers.getContractFactory("MyNFT");
        const myNft = await MyNFT.deploy();

        const initTokenId = await myNft.getTokenCounter();
        return { myNft, initTokenId };
    };

    it("ミントできること", async () => {
        const { myNft, initTokenId } = await loadFixture(deployMyNftFixture);
        const [ owner ] = await ethers.getSigners();

        const mintTx = await myNft.connect(owner).mintNft();
        await mintTx.wait(1);

        // ミントすることでtokenIdに紐づくtokenURIを取得することができる
        const expectedTokenUri = "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";
        const actualTokenUri = await myNft.tokenURI(initTokenId);
        expect(actualTokenUri).to.equal(expectedTokenUri);
    });

    it("ミントすることでtokenIdが変わること", async () => {
        const { myNft, initTokenId } = await loadFixture(deployMyNftFixture);
        const [ owner ] = await ethers.getSigners();

        const mintTx = await myNft.connect(owner).mintNft();
        await mintTx.wait(1);

        const expectedTokenId = initTokenId.add(1);
        const actualTokenId = await myNft.getTokenCounter();
        expect(actualTokenId).to.equal(expectedTokenId);
    })
});
