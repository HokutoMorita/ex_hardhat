import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

if (process.env.NODE_ENV !== 'production') {
  // プロジェクトのルートにある.envファイルを自動的に読み込み値を初期化する
  require('dotenv').config();
}

const infuraRopstenUrl = process.env.INFURA_ROPSTEN_URL || "";
const metaMaskPrivateKey = process.env.META_MASK_PRIVATE_KEY || "";

console.log(`INFURA_ROPSTEN_URLの確認: ${infuraRopstenUrl}`)

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 1337 // We set 1337 to make interacting with MetaMask simpler
    },
    ropsten: {
      url: infuraRopstenUrl,
      accounts: [metaMaskPrivateKey],
    },
  }
};

export default config;
