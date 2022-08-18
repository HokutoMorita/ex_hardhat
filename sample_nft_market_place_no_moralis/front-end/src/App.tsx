import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";

import { ConnectSection } from './components/Connect';

import contractAddress from './contracts/contract-address.json'
import MyNFTArtifact from './contracts/MyNFT.json'
import NftMarketplaceArtifact from './contracts/NftMarketplace.json'


export const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);

  // TODO ココカラファイン！！！
  const onConnect = (walletAddress: string) => {
    setIsConnected(!!walletAddress);
  }

  return (
    <div className="App">
      <ConnectSection onConnect={onConnect} />
      {isConnected && (
        <p>接続完了</p>
      )}
    </div>
  );
};



