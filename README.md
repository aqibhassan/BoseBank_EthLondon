# EthLondon-2023

> ## Abstract
Defi Bank is designed at its core to be simplistic and user friendly with the capability to allow borrowers and lenders to leverage their assets
to create a decentralized platform releasing equity from assets held within the crypto eco-system. Currently individuals have a lengthy process to exit the market and in many instances do not wish to
sell their positions for a loss; or for a perceived loss. Defi Bank will allow them to lock their tokens at an agreed amount and make regular payments to recieve their 
assets back at the initial loan price plus interest. This creates a scenario whereby should the locked asset increase in value to a greater amount within the duration of the loan agreement the borrower can realize the original value and take advantage of the increase in asset price once the loan + interest has been paid in full.

> ## Team Members
- [Karl Timmins](https://github.com/Karlitoyo)
- [Aqib Hassan](https://github.com/aqibhassan)

> ## High-level overview of the project
<p align="center">
  <img width="900" height="600" src="https://github.com/Karlitoyo/BossBank-EthLondon/blob/main/eth-london-diagram.jpg">
</p>
<!-- ![Alt text](eth-Page-1.drawio.png) -->

> ## Project implementation
Tech stack:
- [Next](https://nextjs.org/) - Front end framework
- [Ethereum](https://ethereum.org/en/) - Blockchain
- [Daisy UI](https://daisyui.com/) - CSS Framework
- [Foundry](https://github.com/foundry-rs/foundry) - Testing Framework
- [EtherSpot](https://etherspot.io/) - Account Abstraction / Transaction Bundling
- [Flare](https://flare.network/) - On chain Oracles
- [WormHole](https://wormhole.com/) - Cross Chain

 > ## UX

The UX has been designed to be simple and with the aim of targeting every type of user, from people with little to no previous experience in financial markets and lending, to seasoned defi users. The UX is created to be straight forward and encourage users to provide liquidity and connect with the platform.

## Users

The website has a target audience of both new entrants to the DeFi eco-system and existing users. The age 
profile is based on bank account users within our targeted demographic. Any individual with digital assets can make use of the service.

## Strategy

Initial strategy will be to target crypto users who currently require cash for their assests and migrate users from centralized exchanges. This will allow individuals to
retain their assets at the price agreed when taking the loan and to repay the loan to redeem their asset. There is a mechanism built into the contract to mitigate exchange rate risk due to fluxuations in asset price. Should the asset price drop below a specific treshold the borrower is required to fund their position to keep the loan 'alive'. This ensures volatility in the market is managed and lenders and borrowers are rotected against wild swings in assets prices which can occur in all markets during periods of volatility.

## Scope

The Scope of the service is to create financial literacy and encourage saving from a wider range of individuals.
This product can benefit individuals who rely on high interest loans or payday loans, this service can also benefit
current mortgage holders who are struggling to meet regular repayments or who may be in negative equity.

<hr>

> ## Wireframes

### Landing Page selected:
<p align="center">
  <img width="600" height="600" src="https://github.com/aqibhassan/DefiBank_EthLondon/blob/main/homepage.jpg">
</p>

### Social Login:
<p align="center">
  <img width="600" height="600" src="https://github.com/aqibhassan/DefiBank_EthLondon/blob/main/social%20login.jpg">
</p>

### Dashboard:
<p align="center">
  <img width="600" height="600" src="https://github.com/aqibhassan/DefiBank_EthLondon/blob/main/dashboard.jpg">
</p>

<video src="https://github.com/aqibhassan/DefiBank_EthLondon/blob/main/video-project_compressed.mp4"></video>

 > ## Current-Features

## Development

We currently have 3 vault contracts created which have individual time periods for duration - 

 - 6 month time lock
 - 12 month time lock
 - 24 month time lock

This gives users (both lenders and borrowers) the flexibility to choose a time period which best suits their needs. The users can also redeem early (which incurrs a fee). Borrowers have the ability to deposit assets as collateral and withdraw funds based on the total LTV calculated and floating interest rate as shown on the dashbord UI. Users can log into the application using account abstraction and also track asset prices.


## Further Development

We currently have development plans to include a machine learning algorithm to track users payments through social logins and provide preferable rates of interest should they disclose their identity via the platform. This will allow us to create credit scoring models based on a user's on chain activity.

> ## User-Stories

## First case example user experience

Middle income user who has difficulty meeting loan obligations and struggles with regular savings -

Individual who holds crypto assets requires stablecoin loan to make payment for an upcoming holiday. User feels their asset will rise in value in the short to
medium term. The current method for exiting funds out of the crypto eco-system requires a user to trade the asset on a centralized exhange for a choice of Ethereum/Bitcoin or another asset and this incurrs high fees through a crypto bank for cash and then to withdraw funds. Making use of Defi users can trade the token they hold for stablecoins at an agreed amount, term, and rate of interest. Withdraw the cash to bank and repay loan over term. During the term of the loan the value of the asset held as collateral increases 2x. The user repays the loan in full to the lender capital + interest and the asset is released at the original price that the borrower recieved the funds for.

## Second case example user experience

Low income user who is in arrears on their mortgage repayments and cannot maintain current levels of debt (however holds crypto asset) -

Borrower has digital asset to the value of €1100 which the user places against a loan as collateral for €1000 + 10% interest. User agrees term of 11 months @ €100 per month. The borrower makes 5 payments of €100. During this period the value of the asset drops to €600, the borrower
decides not to continue with the repayment of the loan. The asset + €500 paid in the 5 monthly installments revert to the lender.

> ## Instruction pipeline
![Alt text](EthLondon-Instructions.drawio.png)

> ## SWOT

- Strengths

Personal finances applications market is an increasing market. Recent analysis by Statista -
(https://www.statista.com/statistics/1256249/worldwide-personal-finance-software-market-revenues/)
indicates market growth to over €1 Billion in value by 2023 in the United States alone. A growth of 25%
from its current position.

The system has numerous strengths which include simple user-friendly UI making use of blockchain technology
, dectralized finance and allowing users to leverage their assets.

- Weaknesses (Challenges)

Challenges identified predominantly relate to smart contract development, bounty integration and time for development. We are confident we can overcome development challenges with time to allow for a full scale offering ready for mainnet deployment.

- Opportunities

Similiar models are in practice currently however, competiors make use of differing strategies when lending. Lending within the crypto eco-system is not fully adopted however this is an area within the space which will become more prevalent as the industry matures.

- Threats

Threats relate to similar products. However this is an emerging space within the crypto industry. Threats also relate to the value of
assets reducing leaving investor open to losses, similar to impairement loss currently faced through providing liquidity. The interest cost being fixed within the original asset collatoral can mitigate this risk.

> ## Deployed contracts: 

## Sample asset token -

https://goerli.etherscan.io/token/0x9bfadcd7f4e48be85ba9ec70094a62017c6c73a8#code

## Lending NFT contract -

https://goerli.etherscan.io/address/0xc308e1ee919182964c4ba6981d111c53bea631a8#code

## Sample Collateral Token -

https://goerli.etherscan.io/address/0xff063796c38a2ad3411e96b7bd12ffb9755a068e#code

## Main Platform token -

https://goerli.etherscan.io/address/0x6a0d5d3e8d54aa453e62c4d1da566dc55f7b940a/advanced#code

> ## How to run

`npm install` / `yarn install` - install dependencies

`npm run dev` -  deploy

Front end is in `frontend` folder (Next.js-app).
