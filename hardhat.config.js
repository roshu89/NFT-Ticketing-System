require('@nomiclabs/hardhat-ethers');
require('dotenv').config({ path: '.env.local' });

const { API_URL, PRIVATE_KEY } = process.env;

if (!API_URL || !PRIVATE_KEY) {
  throw new Error('Missing environment variables. Check your .env.local file.');
}
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.11',
  defaultNetwork: 'volta',
  networks: {
    hardhat: {},
    volta: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      gas: 300000, // Adjusted gas limit for minting ERC-721 NFTs
      gasPrice: 2000000000, // Adjusted gas price in wei (2 Gwei)
    },
  },
};
