import { FC, useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './LandingPage.module.css';
import ConnectButtonComponent from '../ConnectButtonComponent';
import { useWeb3Auth } from '../useWeb3Auth';
type LandingPageProps = {
  walletAddress: string;
  loginWithProvider: (provider: string) => void;
};
const LandingPage: FC<LandingPageProps> = ({ walletAddress, loginWithProvider }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (walletAddress) {
      setIsModalOpen(false); // close the modal if a wallet is connected
    }
  }, [walletAddress]);
  return (
    <div className={styles.container}>
      {/* Login Button on the top right */}
      <div className={styles.loginButtonContainer}>
        {walletAddress ? (
          <span>Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
        ) : (
          <button onClick={() => setIsModalOpen(true)}>Login</button>
        )}
      </div>

      {/* Modal for Social Logins */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Login</h2>
            <ConnectButtonComponent loginWithProvider={loginWithProvider} />
            <button onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Rest of your landing page content */}
      <section className={styles.heroSection}>
        <Image src="/images/hero.jpg" alt="Financial Cityscape" layout="fill" objectFit="cover" />
        <div className={styles.heroContent}>
          <h1>Welcome to DefiBank</h1>
          <p>The future of decentralized finance</p>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.feature}>
          {/* <Image src="/images/growth.png" alt="Growth Icon" width={100} height={100} /> */}
          <h2>Lending</h2>
          <p>Earn interest by lending your assets on DefiBank.</p>
        </div>
        <div className={styles.feature}>
          {/* <Image src="/images/handCoin.png" alt="Borrowing Icon" width={100} height={100} /> */}
          <h2>Borrowing</h2>
          <p>Borrow assets with flexible terms and low fees.</p>
        </div>
        <div className={styles.feature}>
          {/* <Image src="/images/vault.svg" alt="Security Icon" width={100} height={100} /> */}
          <h2>Security</h2>
          <p>Trust in the security and transparency of blockchain technology.</p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>&copy; 2023 DefiBank. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
