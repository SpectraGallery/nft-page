require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

const fs = require("fs");
const projectId = "02521f217d9f4161b05e56d5a909b691";
const privateKey = process.env.PRIVATE_KEY;

module.exports = {
  networks: {
    hardhat: {
      chainId: 31337  // Corrected from chainID to chainId
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${projectId}`,  // Changed to use backticks for string interpolation
      accounts: [privateKey]
    },
    mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/${projectId}`,  // Corrected the URL for the mainnet and used backticks
      accounts: [privateKey]
    }
  },
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
};
