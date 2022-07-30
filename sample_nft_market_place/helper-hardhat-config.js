const developmentChains = ["hardhat", "localhost"]

// 取引(新しいスマートコントラクトの作成を含む)が確定したとみなす前にブロックチェーンに追加されなければならないブロックの数
const VERIFICATION_BLOCK_CONFIRMATIONS = 6

module.exports = {developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS }
