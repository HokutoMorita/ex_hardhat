import { ethers } from "hardhat";

const TOKEN_ID = 0;

async function buyItem() {
    const accounts = await ethers.getSigners();
    const [deployer, owner, buyer1] = accounts;

    const IDENTITIES = {
        [deployer.address]: "DEPLOYER",
        [owner.address]: "OWNER",
        [buyer1.address]: "BUYER_1",
    };

    const nftMarketplaceContract = await ethers.getContract("NftMarketplace");
    
}
