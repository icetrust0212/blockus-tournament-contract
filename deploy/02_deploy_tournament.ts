import { DeployFunction } from "hardhat-deploy/types";
const fn: DeployFunction = async function ({
  deployments: { deploy, get },
  ethers: { getSigners, getContractFactory },
  network,
}) {
  const deployer = (await getSigners())[0];
    console.log("deployer: ", deployer.address);

    const currency = await get('MockERC20');
    const ticket = await get('Ticket');

    console.log('currency: ', currency.address, ticket.address);
  const contractDeployed = await deploy("Tournament", {
    from: deployer.address,
    log: true,
    skipIfAlreadyDeployed: false,
    args: [
        currency.address,
        ticket.address,
        0
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
fn.tags = ["Tournament"];
fn.dependencies = ['MockERC20', 'Ticket']
export default fn;
