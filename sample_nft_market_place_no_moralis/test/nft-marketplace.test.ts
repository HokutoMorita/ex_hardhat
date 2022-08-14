import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"

describe("NFT Marletplace", () => {
    const PRICE = ethers.utils.parseEther("0.1");

    // ミントとlistItem操作をしたのちにコントラクトインスタンスを返す
    const mintAndList = async () => {
        const NftMarketplace = await ethers.getContractFactory("NftMarketplace");
        const nftMarketplace = await NftMarketplace.deploy();
        const MyNFT = await ethers.getContractFactory("MyNFT");
        const myNft = await MyNFT.deploy();

        // getSigners()を使って20のHardhatアカウントのリストを取得し最初の3つのアドレスに変数名を与えています
        // deployer: スマートコントラクトを展開したアドレス
        // owner: NFTを鋳造して所有するアドレス
        // buyer1: 次のスクリプトでそれを購入するアドレス
        const [deployer, owner, buyer1] = await ethers.getSigners();

        // ミント
        const tokenId = await myNft.getTokenCounter();
        const mintTx = await myNft.connect(owner).mintNft();
        await mintTx.wait(1);

        // Approve
        const approvalTx = await myNft.connect(owner).approve(nftMarketplace.address, tokenId);
        await approvalTx.wait(1);

        // listItem
        const tx = await nftMarketplace.connect(owner).listItem(myNft.address, tokenId, PRICE);
        await tx.wait(1);

        return { nftMarketplace, myNft, owner, buyer1, tokenId }
    };

    it("listItemが成功すること", async () => {
        const { nftMarketplace, myNft, tokenId } = await loadFixture(mintAndList);
        const expectedPrice = ethers.utils.parseEther("0.1");
        const resultListing = await nftMarketplace.getListing(myNft.address, tokenId);
        const actualPrice = resultListing.price;
        // console.log(`actualPriceの値: ${actualPrice}`)
        expect(actualPrice).to.equal(expectedPrice);
    });

    it("listItemが失敗すること、approveしていない場合", async () => {
        const NftMarketplace = await ethers.getContractFactory("NftMarketplace");
        const nftMarketplace = await NftMarketplace.deploy();
        const MyNFT = await ethers.getContractFactory("MyNFT");
        const myNft = await MyNFT.deploy();
        const [deployer, owner, buyer1] = await ethers.getSigners();

        // ミント
        const tokenId = await myNft.getTokenCounter();
        const mintTx = await myNft.connect(owner).mintNft();
        await mintTx.wait(1);

        // Approveせずに上場
        await expect(nftMarketplace.connect(owner).listItem(myNft.address, tokenId, PRICE))
            .to.be.revertedWithCustomError(nftMarketplace, "NotApprovedForMarketplace");
    })

    it("cancelListingが成功すること", async () => {
        const { nftMarketplace, myNft, owner, tokenId } = await loadFixture(mintAndList);

        // 実行
        await nftMarketplace.connect(owner).cancelListing(myNft.address, tokenId);

        const result = await nftMarketplace.getListing(myNft.address, tokenId);
        // listingが削除されてpriceが0になっていること
        expect(result.price).to.equal(0);
    })

    it("cancelListingが失敗すること、オーナーではない場合", async () => {
        const { nftMarketplace, myNft, buyer1, tokenId } = await loadFixture(mintAndList);

        // オーナー(NFT所有者)ではない人がキャンセル
        await expect(nftMarketplace.connect(buyer1).cancelListing(myNft.address, tokenId))
            .to.be.revertedWithCustomError(nftMarketplace, "NotOwner");
    })

    it("cancelListingが失敗すること、ItemListに入っていないNFTをキャンセルしようとした場合", async () => {
        const { nftMarketplace, myNft, owner, tokenId } = await loadFixture(mintAndList);

        // 1度キャンセルしたNFTをさらにキャンセルする
        //   1度キャンセルしたので2度目のキャンセルはできない

        // 1度目のキャンセル
        await nftMarketplace.connect(owner).cancelListing(myNft.address, tokenId);

        // 2度目のキャンセル
        await expect(nftMarketplace.connect(owner).cancelListing(myNft.address, tokenId))
            .to.be.revertedWithCustomError(nftMarketplace, "NotListed");
    })

    it("buyItemが成功すること", async () => {
        const { nftMarketplace, myNft, owner, buyer1, tokenId } = await loadFixture(mintAndList);
        
        // NFTの所有者の保持金を事前に取得
        const preProceed = await nftMarketplace.getProceeds(owner.address);

        // 実行
        await nftMarketplace.connect(buyer1).buyItem(myNft.address, tokenId, {
            value: PRICE
        });

        // NFTの所有者の保持金が購入者の購入金額分増えていること
        const postProceed = await nftMarketplace.getProceeds(owner.address);
        const diff = postProceed.sub( preProceed);
        expect(diff).to.equal(PRICE);
    });

    it("buyItemが失敗すること、支払い金額が足りない場合", async () => {
        const { nftMarketplace, myNft, buyer1, tokenId } = await loadFixture(mintAndList);

        // 実行
        const price = ethers.utils.parseEther("0.01");
        await expect(nftMarketplace.connect(buyer1).buyItem(myNft.address, tokenId, {
            value: price
        })).to.be.revertedWithCustomError(nftMarketplace, "PriceNotMet");
    });

    it("buyItemが失敗すること、購入したいNFTが存在してない場合", async () => {
        const { nftMarketplace, myNft, owner, buyer1, tokenId } = await loadFixture(mintAndList);

        // キャンセルする
        await nftMarketplace.connect(owner).cancelListing(myNft.address, tokenId);

        // 実行、キャンセルされたNFTを購入する
        await expect(nftMarketplace.connect(buyer1).buyItem(myNft.address, tokenId, {
            value: PRICE
        })).to.be.revertedWithCustomError(nftMarketplace, "NotListed");
    });

    it("updateListingが成功すること", async () => {
        const { nftMarketplace, myNft, owner, tokenId } = await loadFixture(mintAndList);

        // 実行
        const newPrice = ethers.utils.parseEther("0.5");
        await nftMarketplace.connect(owner).updateListing(myNft.address, tokenId, newPrice);

        // 0.5ETHに価格が変更されていること
        const expectedPrice = ethers.utils.parseEther("0.5");
        const resultListing = await nftMarketplace.getListing(myNft.address, tokenId);
        const actualPrice = resultListing.price;
        expect(actualPrice).to.equal(expectedPrice);
    })

    it("updateListingが失敗すること、0ETHで更新しようとした場合", async () => {
        const { nftMarketplace, myNft, owner, tokenId } = await loadFixture(mintAndList);

        // 実行
        const newPrice = ethers.utils.parseEther("0");
        await expect(nftMarketplace.connect(owner).updateListing(myNft.address, tokenId, newPrice))
            .to.be.revertedWithCustomError(nftMarketplace, "PriceMustBeAboveZero");
    });

    it("updateListingが失敗すること、オーナーではない場合", async () => {
        const { nftMarketplace, myNft, owner, buyer1, tokenId } = await loadFixture(mintAndList);

        // 実行
        const newPrice = ethers.utils.parseEther("0.5");
        await expect(nftMarketplace.connect(buyer1).updateListing(myNft.address, tokenId, newPrice))
            .to.be.revertedWithCustomError(nftMarketplace, "NotOwner");
    });

    it("updateListingが失敗すること、ItemListに入っていないNFTの価格を変更しようとした場合", async () => {
        const { nftMarketplace, myNft, owner, tokenId } = await loadFixture(mintAndList);

        // キャンセルする
        await nftMarketplace.connect(owner).cancelListing(myNft.address, tokenId);

        // 実行、キャンセルされたNFTの価格を変更する
        const newPrice = ethers.utils.parseEther("0.5");
        await expect(nftMarketplace.connect(owner).updateListing(myNft.address, tokenId, newPrice))
            .to.be.revertedWithCustomError(nftMarketplace, "NotListed");
    });
});
