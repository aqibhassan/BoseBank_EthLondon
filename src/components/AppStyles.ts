
import styled from 'styled-components';



export const Wrapper = styled.form`
  display: block;
  width: 100%;
  margin: 0 auto 80px;
  padding: 25px;
  position: relative;
  border-radius: 6px;
  background: rgba(255,255,255,0.05);
`;

export const ConnectButton = styled.div`
  text-align: center;
  color: #fff;
  background: #cc29ff;
  cursor: pointer;
  border-radius: 10px;
  user-select: none;
  padding: 15px 20px;
  margin-bottom: 10px;

  &:hover {
    opacity: 0.6;
  }
`;

export const LogoutButton = styled.span`
  color: #000;
  border: 1px solid #cc29ff;
  cursor: pointer;
  border-radius: 10px;
  user-select: none;
  padding: 7px 15px;
  text-align: center;
  font-size: 12px;
  display: inline-block;
  margin-top: 25px;
  
  &:hover {
    opacity: 0.6;
  }
`;

export const ConnectedWalletTitle = styled.p`
  text-align: center;
`;

export const ConnectedWallet = styled.p`
  color: #000;
  font-size: 20px;
  text-align: center;
`;

export const ConnectedWalletText = styled.p`
  color: #000;
  font-size: 16px;
  text-align: center;
  margin-bottom: 10px;
  word-break: break-all;
`;

export const ErrorMessage = styled.p`
  color: #ff0000;
  font-size: 14px;
  margin-top: 20px;
  text-align: center;
`;