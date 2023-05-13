import { DeployFunction } from "hardhat-deploy/types";
const fn: DeployFunction = async function ({
  deployments: { deploy },
  ethers: { getSigners, getContractFactory },
  network,
}) {
  const deployer = (await getSigners())[0];
    console.log("deployer: ", deployer.address);

  const contractDeployed = await deploy("MockERC20", {
    from: deployer.address,
    log: true,
    skipIfAlreadyDeployed: true,
    args: [
    ],
  });
  console.log(
    "npx hardhat verify --network " +
      network.name +
      " " +
      contractDeployed.address
  );
};
fn.skip = async (hre) => {
  // Skip this on ropsten or hardhat.
  const chain = parseInt(await hre.getChainId());
  return false;
};
fn.tags = ["MockERC20"];

export default fn;
