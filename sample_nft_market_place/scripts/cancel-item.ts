import { ethers } from "hardhat";

const TOKEN_ID = 2

async function cancelListing() {
    const accounts = await ethers.getSigners();
    const [deployer, owner] = accounts;

    const nftMarketplaceContract = await ethers.getContract("NftMarketplace");
    const basicNftContract = await ethers.getContract("BasicNft");

    const tx = await nftMarketplaceContract
        .connect(owner)
        .cancelListing(basicNftContract.address, TOKEN_ID);
    const cancelTxReceipt = await tx.wait(1);
    const args = cancelTxReceipt.events[0].args;
    console.log(`NFT with ID ${TOKEN_ID} Canceled...`);

    const canceledListing = await nftMarketplaceContract.getListing(basicNftContract.address, TOKEN_ID);
    console.log("Seller is Zero Address (i.e no one!)", canceledListing.seller);
}

cancelListing()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
