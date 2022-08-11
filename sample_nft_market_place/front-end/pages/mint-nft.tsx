import type { NextPage } from "next"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftAbi from "../constants/BasicNft.json"
import networkMapping from "../constants/networkMapping.json"
import { BigNumber, ethers } from "ethers"
import { ethers as hardhatEthers } from "hardhat";

type NetworkConfigItem = {
    NftMarketplace: string[]
}

type NetworkConfigMap = {
    [chainId: string]: NetworkConfigItem
}

const MintNft: NextPage = () => {
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = (networkMapping as NetworkConfigMap)[chainString].NftMarketplace[0]

    // @ts-ignore
    const { runContractFunction } = useWeb3Contract()

    const mintAndList = async () => {
        console.log("Mint開始")
        const mintOptions = {
            abi: nftAbi,
            functionName: "mintNft",
        }
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
        
        // TODO 実装すること
    }

}
export default MintNft
