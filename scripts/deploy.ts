import { ethers } from "hardhat";
import { AirdropToken, Airdrop } from "../typechain-types";

async function main() {
    // Get name and symbol from command line arguments
    const [name, symbol] = process.argv.slice(2);

    if (!name || !symbol) {
        throw new Error("Please provide token name and symbol as arguments");
    }

    console.log(`Deploying token with name: ${name} and symbol: ${symbol}`);

    // Get deployer
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);

    // Deploy Token
    const Token = await ethers.getContractFactory("AirdropToken");
    const token = await Token.deploy(name, symbol) as AirdropToken;
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    console.log("Token deployed to:", tokenAddress);

    // Deploy Airdrop
    const Airdrop = await ethers.getContractFactory("Airdrop");
    const airdrop = await Airdrop.deploy(tokenAddress) as Airdrop;
    await airdrop.waitForDeployment();
    const airdropAddress = await airdrop.getAddress();
    console.log("Airdrop deployed to:", airdropAddress);

    // Transfer tokens to airdrop contract
    const transferAmount = ethers.parseEther("10000");
    await token.transfer(airdropAddress, transferAmount);
    console.log(`Transferred ${ethers.formatEther(transferAmount)} tokens to airdrop contract`);

    // Save deployment info
    console.log("\nDeployment Summary:");
    console.log("Token Address:", tokenAddress);
    console.log("Airdrop Address:", airdropAddress);
    console.log("Token Name:", name);
    console.log("Token Symbol:", symbol);
}

main().catch((error) => {
    console.error("Error during deployment:", error);
    process.exitCode = 1;
});