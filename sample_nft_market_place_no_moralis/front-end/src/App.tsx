import React, { useState, useEffect } from 'react';
import { Link, BrowserRouter, Routes, Route } from 'react-router-dom';

import { ConnectSection } from './components/Connect';
import { Mint } from './components/Mint';

export const App: React.FunctionComponent = () => {
  const [tokenIds, setTokenIds] = useState([]);
  const onSetTokenIds = (tokenIds: any) => {
    setTokenIds(tokenIds);
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
        <Route path="/" element={<><p>ここにItemListを表示させる</p></>} />
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



