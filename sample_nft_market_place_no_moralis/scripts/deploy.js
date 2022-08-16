const { ethers } = require("hardhat");
// import { ethers } from "hardhat";

const main = async () => {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account: ", await deployer.getAddress());
  console.log("Account balance: ", (await deployer.getBalance()).toString());

  // NFTコントラクトのデプロイ
  const MyNFT = await ethers.getContractFactory("MyNFT");
  const myNft = await MyNFT.deploy();
  await myNft.deployed();
  console.log("MyNFT contract address: ", myNft.address);

  // NFTマーケットプレイスコントラクトのデプロイ
  const NftMarketPlace = await ethers.getContractFactory("NftMarketplace");
  const nftMarketPlace = await NftMarketPlace.deploy();
  await nftMarketPlace.deployed();
  console.log("NftMarketPlace contract address: ", nftMarketPlace.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(myNft, nftMarketPlace);

}

const saveFrontendFiles = (myNft, nftMarketPlace) => {
  const path = require("path");
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "front-end", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({
       NyNFT: myNft.address,
       NftMarketplace: nftMarketPlace.address
      }, 
      undefined, 
      2
    )
  );

  const MyNFTArtifact = artifacts.readArtifactSync("MyNFT");
  fs.writeFileSync(
    path.join(contractsDir, "MyNFT.json"),
    JSON.stringify(MyNFTArtifact, null, 2)
  );

  const NftMarketplaceArtifact = artifacts.readArtifactSync("NftMarketplace");
  fs.writeFileSync(
    path.join(contractsDir, "NftMarketplace.json"),
    JSON.stringify(NftMarketplaceArtifact, null, 2)
  );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
