import React, { useState, useEffect } from 'react';
import { Link, BrowserRouter, Routes, Route } from 'react-router-dom';

import { ItemList } from './components/ItemList';
import { ConnectSection } from './components/Connect';
import { Mint } from './components/Mint';

export const App: React.FunctionComponent = () => {
  const [tokenIds, setTokenIds] = useState([]);
  const onSetTokenIds = (tokenIds: any) => {
    setTokenIds(tokenIds);
  }

  const [itemList, setItemList] = useState([]);
  const onSetItemList = (itemList: any) => {
    setItemList(itemList);
  }

  useEffect(() => {
    console.log(`tokenIdsの状態変化確認: ${tokenIds}`)
  }, [tokenIds])

  return (
    <BrowserRouter>
      <h2>NFTマーケットプレイス</h2>
      <ul>
        <li>
          <Link to='/'>ItemList </Link>
        </li>
        <li>
          <Link to='/connect-wallet'>ConnectWallet </Link>
        </li>
        <li>
          <Link to='/mint'>Mint </Link>
        </li>

      </ul>
      <hr />
      <Routes>
        <Route 
          path="/" 
          element={
            <ItemList
              tokenIds={tokenIds}
              itemList={itemList}
              setItemList={onSetItemList}
            />
          } 
        />
        <Route path="/connect-wallet" element={<ConnectSection />} />
        <Route 
          path="/mint"
          element={
            <Mint
              tokenIds={tokenIds}
              setTokenIds={onSetTokenIds}
            />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};



