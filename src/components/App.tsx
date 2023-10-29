    'use client';
    import '../styles/global.css'
    import React from 'react';
    import { Oval } from 'react-loader-spinner';
    import { Wrapper, LogoutButton, ConnectedWalletTitle, ConnectedWallet, ConnectedWalletText, ErrorMessage } from './AppStyles';
    import { useWeb3Auth } from './useWeb3Auth';
    import LandingPage from '../components/LandingPage/LandingPage';
    import Dashboard from '../components/dashboard/Dashboard'; 
   


    const App = () => {

      const { isConnecting, errorMessage, walletAddress, etherspotPrimeSdk, contract, mySigner, loginWithProvider, logout } = useWeb3Auth();
     
     
      // If user is connected, show their Ethereum address and provide a logout button
      if (walletAddress) {
        return (
          <Wrapper>
            <Dashboard 
              walletAddress={walletAddress}
              etherspotPrimeSdk={etherspotPrimeSdk}
              contract={contract}
              mySigner={mySigner}
              loginWithProvider={loginWithProvider}
              logout={logout}

            />
         
            {/* <ConnectedWallet>
              <ConnectedWalletTitle>
                Your address on Ethereum blockchain:
              </ConnectedWalletTitle>
              <ConnectedWalletText>
                <strong>{walletAddress}</strong>
                
              </ConnectedWalletText>
              <LogoutButton onClick={logout}>Logout</LogoutButton>
            </ConnectedWallet> */}
          </Wrapper>
        );
      }
    
      // If the app is currently connecting to a wallet, show a loader/spinner
      if (isConnecting) {
        return (
          <Wrapper>
            <Oval
              height={30}
              width={30}
              color="#fff"
              secondaryColor="#cc29ff"
              strokeWidth={6}
              strokeWidthSecondary={6}
              wrapperStyle={{ display: 'flex', justifyContent: 'center' }}
            />
          </Wrapper>
        );
      }
    
      // If there's an error, display the error message
      if (errorMessage) {
        return (
          <Wrapper>
            <ErrorMessage>{errorMessage}</ErrorMessage>
            {/* Maybe add a retry button or other corrective action here */}
          </Wrapper>
        );
      }
    
      // If none of the above conditions are met, show the LandingPage
      return <LandingPage 
      walletAddress={walletAddress} 
      loginWithProvider={loginWithProvider} 

    />;
    }
    
    export default App;
    