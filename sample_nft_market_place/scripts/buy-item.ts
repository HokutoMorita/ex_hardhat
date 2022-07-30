import { ethers } from "hardhat";

const TOKEN_ID = 1

async function buyItem() {
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

    const listing = await nftMarketplaceContract.getListing(basicNftContract.address, TOKEN_ID);

    const price = listing.price.toString();
    const tx = await nftMarketplaceContract
        .connect(buyer1)
        .buyItem(basicNftContract.address, TOKEN_ID, {
            value: price
        });
    await tx.wait(1)
    console.log("NFT Bought!")

    const newOwner = await basicNftContract.ownerOf(TOKEN_ID);
    console.log(`New owner of Token ID ${TOKEN_ID} is ${newOwner} with identity of ${IDENTITIES[newOwner]} `)
}

buyItem()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
