import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Contract } from "ethers";

describe("Lock", () => {
    const deployOneYearLockFixture = async () => {
        const lockedAmount = 1_000_000_000;
        const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
        const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

        // deploy a lock contract where funds can be withdrawn one year in the future
        const Lock = await ethers.getContractFactory("Lock");
        const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

        return { lock, unlockTime, lockedAmount };
    };

    it("Should set the right unlockTime", async () => {
        // assert that the value is correct
        const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);
        expect(await lock.unlockTime()).to.equal(unlockTime);
    });

    it("Should revert with the right error it called too soon", async () => {
        const { lock } = await loadFixture(deployOneYearLockFixture);

        // await expectとしている理由
        // トランザクションが終了するまで待機しなければならないので、アサーション全体が非同期となります。
        // つまり、expectの呼び出しはプロミスを返すので、それを待つ必要があります。
        await expect(lock.withdraw()).to.be.revertedWith("You can't withdraw yet");
    });

    it("Should transfer the funds to the owner", async () => {
        const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);
        await time.increaseTo(unlockTime);

        // this will throw it the transaction recerts
        await lock.withdraw();
    });

    it("Should revert with the right error if called from another account", async () => {
        const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);
        const [owner, otherAccount] = await ethers.getSigners();

        // we increase the time of the chain to pass the first check
        await time.increaseTo(unlockTime);

        // We use lock.connect() to send a transaction from another account
        await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith("You aren't the owner");
    });
});
