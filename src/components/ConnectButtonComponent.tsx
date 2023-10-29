// ConnectButtonComponent.tsx
import React from 'react';
import { ConnectButton } from './AppStyles';
import { LOGIN_PROVIDER } from '@toruslabs/base-controllers';
type ConnectButtonProps = {
    loginWithProvider: (provider: string) => void;
  };
  const ConnectButtonComponent: React.FC<ConnectButtonProps> = ({ loginWithProvider }) => (
  <>
    <ConnectButton onClick={() => loginWithProvider(LOGIN_PROVIDER.GOOGLE)}>
      Login with Google
    </ConnectButton>
    <ConnectButton onClick={() => loginWithProvider(LOGIN_PROVIDER.LINKEDIN)}>
      Login with LinkedIn
    </ConnectButton>
    <ConnectButton onClick={() => loginWithProvider(LOGIN_PROVIDER.GITHUB)}>
      Login with GitHub
    </ConnectButton>
  </>
);

export default ConnectButtonComponent;