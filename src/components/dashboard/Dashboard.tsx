import React, { useState, useEffect } from 'react';
import { PrimeSdk } from '@etherspot/prime-sdk';
import { ethers, utils, Contract } from 'ethers';
function sleep(sec: number): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, sec * 1000));
  }

type DashboardProps = {
  walletAddress: string;
  loginWithProvider: (provider: string) => void;
  etherspotPrimeSdk: PrimeSdk; 
  contract: Contract; 
  mySigner: ethers.providers.JsonRpcSigner;
  logout: () => void; 
};
type VaultAsset = {
    asset: string;
    name: string;
    symbol: string;
    totalDeposited: number;
    totalAvailable: number;
    totalEarnedInterest: number;
    extraLiquidity: number;
  };
// Assuming ERC20_ABI is the ABI for the standard ERC20 token
const ERC20_ABI = [
    // ... other ERC20 function signatures
    "function approve(address _spender, uint256 _value) public returns (bool success)"
];

const Dashboard: React.FC<DashboardProps> = ({ walletAddress, etherspotPrimeSdk, contract, mySigner , loginWithProvider,logout }) => {
    const YOUR_LENDING_CONTRACT_ADDRESS = contract.address;
const YOUR_LENDING_CONTRACT_ABI = contract.interface.fragments;

    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState<number>(0);
  const [ltvRatio, setLtvRatio] = useState<number>(0);
  const [interestRates, setInterestRates] = useState<{ [key: string]: number }>({
});
const [vaultAssets, setVaultAssets] = useState<{ [key: string]: VaultAsset[] }>({});
  const [lentAmount, setLentAmount] = useState<number>(0);
  const [borrowedAmount, setBorrowedAmount] = useState<number>(0);
  const [lendInput, setLendInput] = useState<number>(0);
  const [borrowInput, setBorrowInput] = useState<number>(0);

  useEffect(() => {
    // Fetch initial data when the component mounts
    fetchBalance();
    fetchLTVRatio();
    fetchVaultData();
    fetchLentAmount();
    fetchBorrowedAmount();
  }, []);
// In your component render

  const fetchBalance = async () => {
    try {
      const balanceInWei = await etherspotPrimeSdk.getNativeBalance();
      
      console.log(etherspotPrimeSdk.state.account$);
      // const balanceInWei = await mySigner.getBalance(walletAddress);
      if (balanceInWei) {
      console.log(balanceInWei);
 
        setBalance(parseFloat(balanceInWei)); 
      } else {
        console.error("Failed to fetch the balance");
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };
  
  const fetchLTVRatio = async () => {
    const ratio = await contract.getLTVRatio();
    setLtvRatio(ratio.toNumber());
};  
// const fetchInterestRate = async () => {
//     const interestBigNumber = await contract.getAnnualBorrowRate("6_Month");
//     const interest = parseFloat(utils.formatUnits(interestBigNumber, 18)) * 100;
//     console.log(interest);
//     setInterestRate(interest);
// };  
const fetchVaultData = async () => {
    const vaultNames = ["6_Month", "12_Month", "24_Month"];
    const newInterestRates: { [key: string]: number } = {};
    const fetchedVaultAssets: { [key: string]: VaultAsset[] } = {};
  
    try {
      const interestBigNumbers = await Promise.all(vaultNames.map(vault => contract.getAnnualBorrowRate(vault)));
  
      interestBigNumbers.forEach((interestBigNumber, index) => {
        const interest = parseFloat(utils.formatUnits(interestBigNumber, 18)) * 100;
        newInterestRates[vaultNames[index]] = interest;
      });
  
      for (let vaultName of vaultNames) {
        const { vaultAssetAddresses } = await contract.getVault(vaultName);
        const assetsData: VaultAsset[] = [];
  
        for (let assetAddress of vaultAssetAddresses) {
          const assetData = await contract.getVaultAsset(vaultName, assetAddress);
          assetsData.push(assetData);
        }
  
        fetchedVaultAssets[vaultName] = assetsData;
      }
  
      setInterestRates(newInterestRates);
      setVaultAssets(fetchedVaultAssets);
      setLoading(false);
  
    } catch (error) {
      console.error("Error fetching vault data:", error);
    }
  };
  
  const fetchLentAmount = async () => {
    // Replace this with a call to your API or smart contract
    setLentAmount(200); // Example lent amount
  };

  const fetchBorrowedAmount = async () => {
    // Replace this with a call to your API or smart contract
    setBorrowedAmount(150); // Example borrowed amount
  };

  const handleLend = async (vaultName: string, amount: number, assetAddress: string) => {
    vaultName=vaultName.replace(" ", "_")
    console.log(`Lending ${amount} of asset ${assetAddress} in ${vaultName} vault`);
    let rawAmount = ethers.BigNumber.from(amount.toString()).mul(ethers.BigNumber.from('1000000000000000000'));
    // Encoding the data for the ERC20 approval call

    
    const erc20Contract = new ethers.Contract(assetAddress, ERC20_ABI, mySigner);
    const approvalData = erc20Contract.interface.encodeFunctionData('approve', [YOUR_LENDING_CONTRACT_ADDRESS, rawAmount]);

    // Encoding the data for the deposit call
    const transactionData = contract.interface.encodeFunctionData('deposit', [vaultName, assetAddress, rawAmount]);
    console.log(`Lending ${rawAmount} of asset ${assetAddress} in ${vaultName} vault`);
    const callerAddress = etherspotPrimeSdk.state.walletAddress
    console.log("Caller Address:", callerAddress);

    // get address of EtherspotWallet...
const address: string = await etherspotPrimeSdk.getCounterFactualAddress();
console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address: ${address}`);
    try {
        // 1. Clear the existing transaction batch
        await etherspotPrimeSdk.clearUserOpsFromBatch();

        // 2. Add the approval transaction to the batch
        let transactionBatch =  await etherspotPrimeSdk.addUserOpsToBatch({ to: assetAddress, data: approvalData });
       
        console.log('transactions: ', transactionBatch);

        // 4. Estimate gas for the batched transactions
        const op = await etherspotPrimeSdk.estimate();
      
        // 5. Sign and send the transaction batch
        const uoHash = await etherspotPrimeSdk.send(op);
        console.log(`Batch Transaction Identifier (UserOpHash): ${uoHash}`);

        // 6. Wait for the transaction to be mined and get the receipt
         // get transaction hash...
  console.log('Waiting for transaction...');
  let userOpsReceipt = null;
  const timeout = Date.now() + 60000; // 1 minute timeout
  while((userOpsReceipt == null) && (Date.now() < timeout)) {
    await sleep(2);
    userOpsReceipt = await etherspotPrimeSdk.getUserOpReceipt(uoHash);
  }
  console.log('\x1b[33m%s\x1b[0m', `Transaction Receipt: `, userOpsReceipt);
    } catch (error) {
        console.error('Error during approval operation:', error);
    }
    try {
      // 1. Clear the existing transaction batch
      await etherspotPrimeSdk.clearUserOpsFromBatch();


      // 3. Add the deposit transaction to the batch
      let transactionBatch =  await etherspotPrimeSdk.addUserOpsToBatch({ to: YOUR_LENDING_CONTRACT_ADDRESS, data: transactionData });
      console.log('transactions: ', transactionBatch);

      // 4. Estimate gas for the batched transactions
      const op = await etherspotPrimeSdk.estimate();
    
      // 5. Sign and send the transaction batch
      const uoHash = await etherspotPrimeSdk.send(op);
      console.log(`Batch Transaction Identifier (UserOpHash): ${uoHash}`);

      // 6. Wait for the transaction to be mined and get the receipt
       // get transaction hash...
console.log('Waiting for transaction...');
let userOpsReceipt = null;
const timeout = Date.now() + 60000; // 1 minute timeout
while((userOpsReceipt == null) && (Date.now() < timeout)) {
  await sleep(2);
  userOpsReceipt = await etherspotPrimeSdk.getUserOpReceipt(uoHash);
}
console.log('\x1b[33m%s\x1b[0m', `Transaction Receipt: `, userOpsReceipt);
  } catch (error) {
      console.error('Error during lending operation:', error);
  }
};

// ... rest of your code remains unchanged ...



  const handleBorrow = (vaultName: string, amount: number) => {
    // Logic to borrow assets. Call your API or smart contract here.
    console.log(`Borrowing ${amount} from ${vaultName} vault`);
  };
  type VaultProps = {
    vaultName: string;
    interestRate: number;
    onLend: (vaultName: string, amount: number, assetAddress: string) => void;
    onBorrow: (vaultName: string, amount: number) => void;
    vaultAssets: VaultAsset[]; 
};

const VaultCard: React.FC<VaultProps> = ({ vaultName, interestRate, onLend, onBorrow, vaultAssets }) => {
    const [selectedAsset, setSelectedAsset] = useState(vaultAssets[0]?.asset); // default to the first asset
    const [lendAmount, setLendAmount] = useState<number>(0);
  
    return (
    <div className="bg-white p-8 rounded-xl shadow-lg space-y-8">
      <div className="border-b pb-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{vaultName} Vault</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="block text-sm text-gray-600 uppercase tracking-wide">Lending</span>
            <span className="block text-lg font-medium">{Number(interestRate * 0.95).toFixed(2)}% APR</span>
          </div>
          <div>
            <span className="block text-sm text-gray-600 uppercase tracking-wide">Borrowing</span>
            <span className="block text-lg font-medium">{Number(interestRate).toFixed(2)}% APR</span>
          </div>
        </div>
      </div>

      {/* Lending Section */}
      <div className="border-b pb-4 mb-4 space-y-4">
        <span className="block text-lg font-medium text-gray-700">Lend</span>
       {/* Asset Dropdown */}
       <select 
          value={selectedAsset} 
          onChange={e => setSelectedAsset(e.target.value)} 
          className="border rounded p-2 w-full mb-2"
        >
          {vaultAssets.map(asset => (
            <option key={asset.asset} value={asset.asset}>
              {asset.name} ({asset.symbol})
            </option>
          ))}
        </select>

        {/* Amount Input */}
        <input 
          type="number" 
          placeholder="Enter amount to lend" 
          value={lendAmount} 
          onChange={e => setLendAmount(Number(e.target.value))} 
          className="border rounded p-2 w-full mb-2"
        />

        {/* Adjusted Lend Button */}
        <button 
          className="btn btn-primary w-full" 
          onClick={(e) => {
            e.preventDefault();
            onLend(vaultName, lendAmount, selectedAsset);
          }}
        >
          Lend {lendAmount} {vaultAssets.find(asset => asset.asset === selectedAsset)?.symbol}
        </button>
      </div>
      {/* Borrowing Section */}
      <div className="space-y-4">
        <span className="block text-lg font-medium text-gray-700">Borrow</span>
        <span className="block text-gray-600">Borrowed Amount: ${/* Add your borrowed amount here */}</span>
        <button className="btn btn-primary w-full" onClick={() => onBorrow(vaultName, 50)}>Borrow $50</button>
      </div>
       {/* Assets Section */}
    <div className="space-y-4">
      <span className="block text-lg font-medium text-gray-700">Assets</span>
      <ul>
        {vaultAssets.map(asset => (
          <li key={asset.asset} className="text-gray-600">
            {asset.name} ({asset.symbol})
          </li>
        ))}
      </ul>
    </div>
  
    </div>
    
  
    );
  };



  return (
    <div className="bg-gray-100 h-full min-h-screen">
 <div className="container mx-auto px-4">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold text-gray-900">DefiBank</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Connected: {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Not Connected'}</span>
          {/* Assuming you have a default user image, change path accordingly */}
          <img className="h-10 w-10 rounded-full" src="/path-to-your-default-user-image.png" alt="User Profile" />
          {/* Log Out Button */}
          <button className="btn btn-secondary mt-8" onClick={logout} >Log Out</button>
        </div>
      </nav>

      {/* User Information Card */}
      <div className="bg-white p-6 rounded-xl shadow-lg space-y-6 mb-8">
         <div className="border-b pb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Ethereum Address</h2>
          <span className="text-gray-600">{walletAddress}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-gray-900">${balance}</span>
          <div className="w-1/2 h-2 bg-blue-200 rounded">
            <div style={{ width: `${(balance / 1000) * 100}%` }} className="h-2 bg-blue-600 rounded"></div>
          </div>
        </div>
      </div>
        {/* Interest Rates */}
        {/* <div className="bg-white p-6 rounded-xl shadow-lg space-y-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">Current Interest Rates</h2>
          <div className="flex justify-between">
          <span>Lending: {Number(interestRate * 0.95).toFixed(2)}% APR</span>
            <span>Borrowing: {interestRate}% APR</span>
          </div>
        </div> */}

        {/* (LTV) Ratio */}
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900">Loan-to-Value (LTV) Ratio</h2>
            <div className="flex justify-center">
                <span>LTV Ratio: {ltvRatio}%</span>
            </div>
        </div>

      {/* Vaults Section */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
{/* Iterate over the vaults */}
{loading ? (
  <div>Loading...</div>
) : (
  ["6 Month", "12 Month", "24 Month"].map((vaultName) => {
    const vaultKey = vaultName.replace(" ", "_");
    return (
      <VaultCard 
        key={vaultName} 
        vaultName={vaultName} 
        interestRate={interestRates[vaultKey]}
        vaultAssets={vaultAssets[vaultKey] || []}  // Pass the vault assets data
        onLend={handleLend} 
        onBorrow={handleBorrow} 
      />
    );
  })
)}






      </div>
   {/* Transaction History */}
   <div className="bg-white p-6 rounded-xl shadow-lg space-y-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
          {/* Display a list of recent transactions here */}
        </div>

        {/* Total Earnings & Due */}
        <div className="flex justify-between mt-8 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-1/2 mr-2">
            <h2 className="text-xl font-semibold text-gray-900">Total Earnings</h2>
            <span>$... {/* Total interest earned */}</span>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg w-1/2 ml-2">
            <h2 className="text-xl font-semibold text-gray-900">Total Due</h2>
            <span>$... {/* Total amount due from borrowing */}</span>
          </div>
        </div>
        
    </div>
    </div>
  );
};

export default Dashboard;
