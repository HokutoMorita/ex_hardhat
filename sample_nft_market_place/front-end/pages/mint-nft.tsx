import type { NextPage } from "next"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import nftAbi from "../constants/BasicNft.json"
import networkMapping from "../constants/networkMapping.json"
import { BigNumber, ethers } from "ethers"
import { Button, useNotification } from "web3uikit"

type NetworkConfigItem = {
    NftMarketplace: string[]
}

type NetworkConfigMap = {
    [chainId: string]: NetworkConfigItem
}

const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS

const MintNft: NextPage = () => {
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = (networkMapping as NetworkConfigMap)[chainString].NftMarketplace[0]

    const dispatch = useNotification()

    // @ts-ignore
    const { runContractFunction } = useWeb3Contract()

    const mintAndList = async () => {
        console.log("Mint開始")
        const mintOptions = {
            abi: nftAbi,
            contractAddress: NFT_CONTRACT_ADDRESS,
            functionName: "mintNft",
        }
        console.log(`NFTコントラクトアドレスの確認: ${NFT_CONTRACT_ADDRESS}`)
        await runContractFunction({
            params: mintOptions,
            onSuccess: handleMintSuccess,
            onError: (error) => {
                console.log(error)
            },
        })
    }
    const handleMintSuccess = async (mintTx: any) => {
        console.log("Approve開始")
        const mintTxReceipt = await mintTx.wait(1)
        const tokenId = mintTxReceipt.events[0].args.tokenId;
        const decimals = 18;
        const price = ethers.utils.parseUnits("0.1", decimals).toString()

        const approveOptions = {
            abi: nftAbi,
            contractAddress: NFT_CONTRACT_ADDRESS,
            functionName: "approve",
            params: {
                to: marketplaceAddress,
                tokenId: tokenId,
            },
        }

        await runContractFunction({
            params: approveOptions,
            onSuccess: () => handleApproveSuccess(tokenId, price),
            onError: (error) => {
                console.log(error)
            },
        })
    }

    const handleApproveSuccess = async (tokenId: string, price: string) => {
        console.log("ItemListに格納")
        
        const listItemOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "listItem",
            params: {
                nftAddress: NFT_CONTRACT_ADDRESS,
                tokenId: tokenId,
                price: price,
            },
        }

        await runContractFunction({
            params: listItemOptions,
            onSuccess: () => handleListSuccess(),
            onError: (error) => {
                console.log(error)
            },
        })

    }

    const handleListSuccess = async () => {
        dispatch({
            type: "success",
            message: "NFT Minted and Listed successfully ",
            title: "NFT Minted and Listed",
            position: "topR",
        })
    }

    return (
        <div className="py-4">
            <h2 className="text-2xl">Mint NFT</h2>
            <Button
                id="mint-and-list-item"
                onClick={() => mintAndList()}
                text="mint-and-list-item"
                theme="primary"
                type="button"
            />
        </div>
    )

}
export default MintNft
