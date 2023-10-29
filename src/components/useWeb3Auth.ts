'use client';

import React from 'react';
import { PrimeSdk, Web3WalletProvider } from '@etherspot/prime-sdk';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from '@web3auth/base';
import { ethers, Contract } from 'ethers';
import YourContractMetadata from '../contracts/BossVault_metadata.json';
const web3auth = new Web3AuthNoModal({
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: process.env.NEXT_PUBLIC_WEB3AUTH_CHAIN_ID_HEX,
    },
    clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID as string,
  });
  
  const openloginAdapter = new OpenloginAdapter();
  web3auth.configureAdapter(openloginAdapter);
export const useWeb3Auth = () => {
    const [isConnecting, setIsConnecting] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [walletAddress, setWalletAddress] = React.useState('');
    const [contract, setContract] = React.useState<Contract | null>(null);
    const [mySigner, setMySigner] = React.useState<ethers.providers.JsonRpcSigner | null>(null);
    const [etherspotPrimeSdk, setEtherspotPrimeSdk] = React.useState<PrimeSdk | null>(null);

    const contractAddress = '0x6A0d5D3e8D54Aa453E62c4D1dA566Dc55F7B940A'; // Replace with your contract's address
    
    const ABI = YourContractMetadata.output.abi;
  
    const logout = async () => {
      setWalletAddress('');
      try {
        await web3auth.logout({ cleanup: true });
        web3auth.clearCache();
      } catch (e) {
        //
      }
    }
  
    console.log();
  
    const loginWithProvider = async (loginProvider: string) => {
      if (isConnecting) return;
      setIsConnecting(true);
      setErrorMessage('');
      setWalletAddress('');
  
      if ((web3auth.status !== 'connected')) {
        await web3auth.init();
      }
  
      let newErrorMessage;
  
      if ((web3auth.status !== 'connected')) {
        try {
          await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
            loginProvider,
            mfaLevel: 'none',
          });
        } catch (e) {
          // @ts-ignore
          newErrorMessage = e?.message;
        }
      }
  
      if (newErrorMessage) {
        setErrorMessage(newErrorMessage);
        setIsConnecting(false);
        return;
      }
  
      if (web3auth.status !== 'connected' || !web3auth.provider) {
        setErrorMessage('Something went wrong, please try again later.');
        setIsConnecting(false);
        return;
      }
  
      const mappedProvider = new Web3WalletProvider(web3auth.provider);
      await mappedProvider.refresh();
  
      // @ts-ignore
      const etherspotPrimeSdk = new PrimeSdk(mappedProvider, {
        chainId: ethers.BigNumber.from(process.env.NEXT_PUBLIC_WEB3AUTH_CHAIN_ID_HEX as string).toNumber()
      });
      const address = await etherspotPrimeSdk.getCounterFactualAddress();

    
      if (!address) {
        setErrorMessage('Something went wrong, please try again later.');
        setIsConnecting(false);
        return;
      }
      
      const provider = new ethers.providers.Web3Provider(web3auth.provider);
      const signer = provider.getSigner();
      const myContract = new Contract(contractAddress, ABI, signer);
      setContract(myContract);
      setWalletAddress(address);
      setMySigner(signer);
      setIsConnecting(false);
      setEtherspotPrimeSdk(etherspotPrimeSdk);
    }

  return { isConnecting, errorMessage, walletAddress, etherspotPrimeSdk, contract, mySigner,  loginWithProvider, logout };
};
