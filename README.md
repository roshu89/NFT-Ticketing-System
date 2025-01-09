# Web3 Ticket Booking as NFTs

This project implements a Web3-based ticket booking system, where tickets are issued as NFTs (Non-Fungible Tokens) on the blockchain. The system ensures fair distribution of tickets, leveraging smart contracts written in Solidity and interacting with the blockchain using Ethers.js.

## Technology Stack & Tools
- **Solidity**: Writing Smart Contracts & Tests (Version: ^0.8.9)
- **Javascript**: React & Testing
- **Hardhat**: Development Framework (Version: ^2.12.7)
- **Ethers.js**: Blockchain Interaction (Version: ^5.7.2)
- **React.js**: Frontend Framework (Version: ^18.2.0)
- **MetaMask**: Browser Extension for Blockchain Interaction
- **Node.js**: JavaScript runtime (Version: v18.20.5)

## Requirements For Initial Setup
1. **Install Node.js**: Recommended to use the LTS version (v18.20.5).
2. **Install MetaMask**: Add MetaMask extension to your browser for interacting with the Ethereum network.

## Setting Up

1. **Clone/Download the Repository**

   Clone this repository to your local machine:
   ```bash
   git clone https://github.com/your-username/ticketmaster-web3.git
   ```

2. **Install Dependencies**

   Navigate to the project folder and install the required dependencies:
   ```bash
   cd ticketmaster-web3
   npm install
   ```

3. **Run Tests**

   Execute the tests to ensure everything is set up correctly:
   ```bash
   npx hardhat test
   ```

4. **Start Hardhat Node**

   Start the local Hardhat network for deployment:
   ```bash
   npx hardhat node
   ```

5. **Run Deployment Script**

   In a separate terminal, run the deployment script to deploy the smart contract to the local Hardhat network:
   ```bash
   npx hardhat run ./scripts/deploy.js --network localhost
   ```

6. **Start Frontend**

   Start the React frontend to interact with the deployed smart contract:
   ```bash
   npm run start
   ```

## Features
- **NFT Ticket Booking**: Users can book tickets as NFTs on the blockchain.
- **Equal Ticket Distribution**: Tickets are distributed fairly to prevent hoarding.
- **MetaMask Integration**: MetaMask is used for wallet connection and transactions.
- **Smart Contract Testing**: Comprehensive tests are written in Solidity to ensure security and functionality.
