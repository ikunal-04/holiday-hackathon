import { Deployer } from "@matterlabs/hardhat-zksync";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Wallet } from "zksync-ethers";
import dotenv from "dotenv";

export default async function (hre: HardhatRuntimeEnvironment) {
  const wallet = new Wallet(process.env.PRIVATE_KEY!);

  const deployer = new Deployer(hre, wallet);

  const artifact = await deployer.loadArtifact("Storage");

  const initialNumber = 42;
  const greeterContract = await deployer.deploy(artifact, [initialNumber]);

  console.log(
    `${
      artifact.contractName
    } was deployed to ${await greeterContract.getAddress()}`
  );
}