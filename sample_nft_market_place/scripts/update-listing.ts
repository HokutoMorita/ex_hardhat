import { ethers } from "hardhat";

const TOKEN_ID = 1

async function updateListing() {
    const accounts = await ethers.getSigners();
    // getSigners()を使って20のHardhatアカウントのリストを取得し最初の3つのアドレスに変数名を与えています
    // deployer: スマートコントラクトを展開したアドレス
    // owner: NFTを鋳造して所有するアドレス
    // buyer1: 次のスクリプトでそれを購入するアドレス
    const [deployer, owner, buyer1] = accounts;

    const nftMarketplaceContract = await ethers.getContract("NftMarketplace");
    const basicNftContract = await ethers.getContract("BasicNft");

    console.log(`Updating listing for token ID ${TOKEN_ID} with a new price`);
    const updateTx = await nftMarketplaceContract
        .connect(owner)
        .updateListing(basicNftContract.address, TOKEN_ID, ethers.utils.parseEther("0.5"));
    
    const updateTxReceipt = await updateTx.wait(1);
    const updatePrice = updateTxReceipt.events[0].args.price;
    console.log("updated price: ", updatePrice.toString());

    // Confirm the listing is updated.
    const updatedListing = await nftMarketplaceContract.getListing(basicNftContract.address, TOKEN_ID);
    console.log(`Updated listing has price of ${updatedListing.price.toString()}`);
}

updateListing()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
