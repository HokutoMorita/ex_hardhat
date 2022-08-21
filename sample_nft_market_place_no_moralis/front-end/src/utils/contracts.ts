import { ethers } from "ethers";

import contractAddress from '../contracts/contract-address.json';
import MyNFTArtifact from '../contracts/MyNFT.json';
import NftMarketplaceArtifact from '../contracts/NftMarketplace.json';

export const getMyNFTContract = (owner: any) => {
    const myNft = new ethers.Contract(
        contractAddress.MyNFT,
        MyNFTArtifact.abi,
        owner
    )
    return myNft;
}

export const getNftMarketplaceContract = (owner: any) => {
    const nftMarketplace = new ethers.Contract(
        contractAddress.NftMarketplace,
        NftMarketplaceArtifact.abi,
        owner
    )
    return nftMarketplace;
}
