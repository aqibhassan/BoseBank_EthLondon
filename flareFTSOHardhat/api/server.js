const express = require('express');
const app = express();
const PORT = 3001;
const { ethers, waffle } = require('hardhat');

let contract;

async function initContract() {
    console.log("Deploying contract...");
    const ContractFactory = await ethers.getContractFactory("GettingDataFeeds");
    contract = await ContractFactory.deploy();
    console.log("Contract deployed.");
}

app.get('/price/:token', async (req, res) => {
    try {
        console.log("Fetching price...");
        // Get token price
        const result = await contract.getTokenPriceWei(req.params.token);
        
        res.json({
            timestamp: result._timestamp.toString(),
            decimals: result._decimals.toString(),
            price: result._price.toString()
        });
        console.log("Price fetched.");
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ error: 'Failed to fetch price' });
    }
});

app.listen(PORT, async () => {
    await initContract(); // Initialize the contract when starting the server
    console.log(`Server started on http://localhost:${PORT}`);
});
