const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token contract", () => {
    const deployTokenFixture = async () => {
        const Token = await ethers.getContractFactory("Token");
        const [owner, addr1, addr2] = await ethers.getSigners();

        // デプロイが開始され、Contractに解決されるPromiseが返されます
        // これは、Tokenコントラクトの各機能に対応するメソッドを持つオブジェクトです
        const hardhatToken = await Token.deploy();
        await hardhatToken.deployed();

        return { Token, hardhatToken, owner, addr1, addr2 };

    };

    describe("Deployment", () => {
        it("Should set the right owner", async () => {
            const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
            expect(await hardhatToken.owner()).to.equal(owner.address);
        });

        it("should assign the total supply of token to the owner", async () => {
            const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
    
            const ownerBalance = await hardhatToken.balanceOf(owner.address);
    
            expect(await hardhatToken.totalSupply()).to.be.equal(ownerBalance);
        });
    });

    describe("Transactions", () => {
        it("Should transfer tokens between accounts", async () => {
            const { hardhatToken, addr1, addr2 } = await loadFixture(deployTokenFixture);
    
            // Transfer 50 tokens from owner to addr1
            await hardhatToken.transfer(addr1.address, 50);
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50);
    
            // Transfer 50 tokens from addr1 to addr2
            // デフォルト以外のアカウントからトランザクションを送信してコードをテストする必要がある場合、connect()メソッドを使用して別のアカウントに接続することが可能です
            await hardhatToken.connect(addr1).transfer(addr2.address, 50);
            expect(await hardhatToken.balanceOf(addr2.address)).to.equal(50)
        });
    
        it("Should confirm to change tokens, transfer tokens between accounts ", async () => {
            const { hardhatToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
          
              // Transfer 50 tokens from owner to addr1
              await expect(
                hardhatToken.transfer(addr1.address, 50)
              ).to.changeTokenBalances(hardhatToken, [owner, addr1], [-50, 50]);
          
              // Transfer 50 tokens from addr1 to addr2
              await expect(
                hardhatToken.connect(addr1).transfer(addr2.address, 50)
              ).to.changeTokenBalances(hardhatToken, [addr1, addr2], [-50, 50]);
        });

        it("Should emit Transfer events", async () => {
            const { hardhatToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);

            await expect(hardhatToken.transfer(addr1.address, 50))
                .to.emit(hardhatToken, "Transfer")
                .withArgs(owner.address, addr1.address, 50);

            await expect(hardhatToken.connect(addr1).transfer(addr2.address, 50))
                .to.emit(hardhatToken, "Transfer")
                .withArgs(addr1.address, addr2.address, 50);
        });

        it("Should fail if sender doesn't have enough tokens", async () => {
            const { hardhatToken, owner, addr1 } = await loadFixture(deployTokenFixture);
            const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

            await expect(
                hardhatToken.connect(addr1).transfer(owner.address, 1)
            ).to.be.revertedWith("Not enough tokens");

            expect(await hardhatToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
        });
    }); 
});
