import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import RewardsContractABI from '../../contracts/RewardsContractABI.json';
import React from 'react';

const contractAddress = '0xD38bD38f9b96c9B34000A1336614506B272Fe913';
const CACHE_KEY = 'staking_check_cache';
const CACHE_EXPIRY = 8 * 60 * 60 * 1000; // 8 horas en milisegundos

interface StakingCheckProps {
  onVerificationStatus: (isVerified: boolean, loading: boolean) => void;
}

const StakingCheck2: React.FC<StakingCheckProps> = ({ onVerificationStatus }) => {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const checkStakingStatus = async () => {
      try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const currentTime = new Date().getTime();

        if (cachedData) {
          const { timestamp, verified, address } = JSON.parse(cachedData);
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const connectedAddress = await signer.getAddress();

          if (currentTime - timestamp < CACHE_EXPIRY && address === connectedAddress) {
            setIsVerified(verified);
            setLoading(false);
            onVerificationStatus(verified, false);
            return;
          }
        }

        if (typeof window.ethereum !== 'undefined') {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(contractAddress, RewardsContractABI, signer);

          const connectedAddress = await signer.getAddress();
          const stakeInfo = await contract.getStakeInfo(connectedAddress);
          const nftCount = stakeInfo[0].length;

          const verified = nftCount >= 0;
          setIsVerified(verified);
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: currentTime,
            verified,
            address: connectedAddress
          }));
          onVerificationStatus(verified, false);
        } else {
          console.error('No hay billetera conectada');
        }
      } catch (error) {
        console.error('Error fetching staking info:', error);
        onVerificationStatus(false, false);
      } finally {
        setLoading(false);
      }
    };

    checkStakingStatus();
  }, [onVerificationStatus]);

  return (
    <div>
      {loading ? (
        <p style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center" // Centra el texto
        }}>
          Verifying staked NFTs...
        </p>
      ) : isVerified ? (
        <p style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center" // Centra el texto
        }}>
          Verified Miner ✅
        </p>
      ) : (
        <div>
          <p style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center" // Centra el texto
          }}>
            Simple Earn v2.1 is deprecated withdraw your staked tokens🚫
          </p>
        </div>
      )}
    </div>
  );
};

export default StakingCheck2;
