import React from 'react';
import { ethers } from "ethers";

import { getMyNFTContract, getNftMarketplaceContract } from '../utils/contracts';

type Props = {
    tokenIds: number[]
    setTokenIds: (tokenIds: number[]) => void
}

export const Mint: React.FunctionComponent<Props> = ({ tokenIds, setTokenIds }) => {

    const onClickMint = async () => {
        console.log(`ネットワークIDの確認: ${(window as any).ethereum.networkVersion}`)

        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        const owner = provider.getSigner(0);

        const myNft = getMyNFTContract(owner);
        const nftMarketplace = getNftMarketplaceContract(owner);

        
        try {
            // ミント
            console.log("Minting NFT");
            const mintTx = await myNft.connect(owner).mintNft();
            const mintTxReceipt = await mintTx.wait(1);
            const tokenId = mintTxReceipt.events[0].args.tokenId;

            // Approve
            console.log("Approving Marketplace as operator of NFT...");
            const approvalTx = await myNft
                .connect(owner)
                .approve(nftMarketplace.address, tokenId);
            await approvalTx.wait(1);

             // Listing NFT
            const decimals = 18;
            const price = ethers.utils.parseUnits("0.1", decimals).toString()
            const tx = await nftMarketplace
                .connect(owner)
                .listItem(myNft.address, tokenId, price);
            await tx.wait(1);

            setTokenIds([...tokenIds, tokenId]);
        } catch (error) {
            console.log("Mint処理のエラーメッセージ");
            console.log(error);
        }
    }

    return (
        <section>
            <h2>Mint</h2>
            <button onClick={onClickMint}>Mint</button>
        </section>
    )
}
