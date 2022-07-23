async function main() {
    // ethersをインポートせずに使用していることに注意してください。
    // これは、Hardhat Runtime Environmentで利用可能なすべてのものが、スクリプトでもグローバルに利用可能であるためです
    const accounts = await ethers.getSigners();
  
    for (const account of accounts) {
      console.log(account.address);
    }
  }
  
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
