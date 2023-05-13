import { HardhatUserConfig, task } from "hardhat/config";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "hardhat-deploy";
import "@openzeppelin/hardhat-upgrades";
import "solidity-coverage";
import {config as envConfig} from "dotenv-flow";
envConfig();

/**
 * @dev Supported networks
  ETH mainnet
  Goerli
*/

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.0',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          },
        },
      },
      {
        version: '0.8.1',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          },
        },
      },
      {
        version: '0.8.2',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          },
        },
      }
    ]
  },
  
  networks: {
    mainnet: {
      url: process.env.MAINNET_URL || "",
      accounts: [process.env.PRIVATE_KEY || "", process.env.OTHER_PRIVATE_KEY || ""]
    },
    goerli: {
      url: process.env.GOERLI_URL || "",
      accounts: [process.env.PRIVATE_KEY || "", process.env.OTHER_PRIVATE_KEY || ""],
    },
  },
  namedAccounts: {
    account0: 0
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
}

export default config;
