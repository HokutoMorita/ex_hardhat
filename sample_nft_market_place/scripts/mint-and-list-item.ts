import { ethers } from "hardhat";

const PRICE = ethers.utils.parseEther("0.1")

async function mintAndList() {
    const accounts = await ethers.getSigners();

    // getSigners()を使って20のHardhatアカウントのリストを取得し最初の3つのアドレスに変数名を与えています
    // deployer: スマートコントラクトを展開したアドレス
    // owner: NFTを鋳造して所有するアドレス
    // buyer1: 次のスクリプトでそれを購入するアドレス
    const [deployer, owner, buyer1] = accounts;

    const IDENTITIES = {
        [deployer.address]: "DEPLOYER",
        [owner.address]: "OWNER",
        [buyer1.address]: "BUYER_1",
    };

    const nftMarketplaceContract = await ethers.getContract("NftMarketplace");
    const basicNftContract = await ethers.getContract("BasicNft");

    console.log(`Minting NFT for ${owner.address}`);
    const mintTx = await basicNftContract.connect(owner).mintNft();
    const mintTxReceipt = await mintTx.wait(1);
    const tokenId = mintTxReceipt.events[0].args.tokenId;

    console.log("Approving Marketplace as operator of NFT...");
    const approvalTx = await basicNftContract
        .connect(owner)
        .approve(nftMarketplaceContract.address, tokenId)
    await approvalTx.wait(1);

    console.log("Listing NFT...");
    const tx = await nftMarketplaceContract
        .connect(owner)
        .listItem(basicNftContract.address, tokenId, PRICE);
    await tx.wait(1);
    console.log("NFT Listed with token ID: ", tokenId.toString());

    const mintedBy = await basicNftContract.ownerOf(tokenId);
    // mintedByの値がマーケットプレイスのスマートコントラクトから読み込まれ、そのアドレスがオーナーと同じであることを確認できます
    console.log(`NFT with ID ${tokenId} minted and listed by owner ${mintedBy} with identity ${IDENTITIES[mintedBy]}.`);
}

// exit(0)は正常終了
mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

