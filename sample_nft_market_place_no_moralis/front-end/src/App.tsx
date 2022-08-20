import React, { useState, useEffect } from 'react';
import { Link, BrowserRouter, Routes, Route } from 'react-router-dom';
import { ethers } from "ethers";

import { ConnectSection } from './components/Connect';
import { ItemList } from './components/ItemList';

import contractAddress from './contracts/contract-address.json'
import MyNFTArtifact from './contracts/MyNFT.json'
import NftMarketplaceArtifact from './contracts/NftMarketplace.json'


export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <h2>NFTマーケットプレイス</h2>
      <ul>
        <li>
          <Link to='/'>ItemList </Link>
        </li>
        <li>
          <Link to='/mint'>Mint </Link>
        </li>
      </ul>
      <hr />
      <Routes>
        <Route path="/" element={<ItemList />} />
        <Route path="/mint" element={<ConnectSection />} />
      </Routes>
    </BrowserRouter>
  );
};



