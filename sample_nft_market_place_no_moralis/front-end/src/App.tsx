import React, { useState } from 'react';
import { ethers } from "ethers";
import './App.css';

import { Wallet } from './components/Wallet';

import contractAddress from './contracts/contract-address.json';
import MyNFTArtifact from './contracts/MyNFT.json'
import NftMarketplaceArtifact from './contracts/NftMarketplace.json'


export const App = () => {
  const [selectedAddress, setSelectedAddress] = useState('');

  const initMyNft = new ethers.Contract('0x', MyNFTArtifact.abi, undefined);
  const [mynft, setMyNft] = useState(initMyNft);

  const initNftMarketplace= new ethers.Contract('0x', NftMarketplaceArtifact.abi, undefined);
  const [nftMarketplace, seNftMarketplace] = useState(initNftMarketplace);

  const connectWallet = async () => {
    // typescriptだと(window as any)にしないとエラーになる
    const [userAddress] = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    setSelectedAddress(userAddress);
  
    // TODO プロバイダーどうする？
    // TODO メタマスクのアカウントを変えるたびにコントラクトインスタンスを生成すること
  }

  const initializeEthers = async () => {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const _mynft = new ethers.Contract(
      contractAddress.MyNFT, MyNFTArtifact.abi,  provider.getSigner(0));
     setMyNft(_mynft);
    const _nftMarketplace = new ethers.Contract(
      contractAddress.NftMarketplace, NftMarketplaceArtifact.abi,  provider.getSigner(0));
    seNftMarketplace(_nftMarketplace);

    // TODO ココカラファイン、initializeEthers関数の実装の続きから！！！！
  }

  return (
    <div className="App">
      <Wallet 
        connectWallet={() => connectWallet}
      />
    </div>
  );
}



