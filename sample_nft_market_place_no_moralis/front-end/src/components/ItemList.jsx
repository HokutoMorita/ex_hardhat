import { ethers } from "ethers";

import { getMyNFTContract, getNftMarketplaceContract } from '../utils/contracts';

export const ItemList = ({
    tokenIds,
    itemList,
    setItemList
}) => {
    const onUpdateItemList = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const owner = provider.getSigner(0);

        const myNft = getMyNFTContract(owner);
        const nftMarketplace = getNftMarketplaceContract(owner);

        console.log(tokenIds);
        let items = [];
        tokenIds.forEach(async tokenId => {
            console.log("イテレーション");
            const item = await getItem(nftMarketplace, myNft, tokenId);
            items = [...items, item];
            setItemList(items);
        });
    }

    return (
        <>
            <section>
                <h2>ItemList</h2>
                <button onClick={onUpdateItemList}>Update ItemList</button>
            </section>
            {itemList.length !== 0 && itemList.map((item) => {
                console.log(`tokenId: ${item.tokenId}`)
                console.log(`imageURIURL: ${item.imageURIURL}`)
                console.log(`price: ${item.price}`)
                console.log(`sellerAddress: ${item.sellerAddress}`)
                return (
                    <div key={item.tokenId}>
                        <ul>
                            <li>
                                tokenID: {item.tokenId.toString()}
                            </li>
                            <li>
                                {ethers.utils.formatUnits(item.price, "ether")} ETH
                            </li>
                            <li>
                                sellerAddress: {item.sellerAddress}
                            </li>
                        </ul>
                        <div>
                          <img src={item.imageURIURL} alt="token img" />
                        </div>
                    </div>
                )
            })}
        </>
    )
}

const getItem = async (nftMarketplace, myNft, tokenId) => {
    const imageURIURL = await getImageURIURL(myNft, tokenId);
    const { price, seller } = await getListing(nftMarketplace, myNft, tokenId);
    return {
        tokenId: tokenId,
        imageURIURL: imageURIURL,
        price: price,
        sellerAddress: seller,
    };
} 

const getImageURIURL = async (myNft, tokenId) => {
    console.log("トークンURLの取得");
    const tokenURI = await myNft.tokenURI(tokenId);

    if (!tokenURI) return "";

    const requestURL = (tokenURI).replace("ipfs://", "https://ipfs.io/ipfs/");
    const tokenURIResponse = await (await fetch(requestURL)).json();
    const imageURI = tokenURIResponse.image;
    const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");

    return imageURIURL;
}

const getListing = async (nftMarketplace, myNft, tokenId) => {
    console.log("マケプレで設定している価格とウォレットアドレスの取得");
    const listing = await nftMarketplace.getListing(myNft.address, tokenId);
    const price = listing.price;
    const seller = listing.seller;
    return { price, seller };
}
