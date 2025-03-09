import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { useAddress } from "@thirdweb-dev/react";

const SEv3Rewards: React.FC = () => {
  const address = useAddress();
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [userStakeInfo, setUserStakeInfo] = useState<any>(null);
  const [realtimeRewards, setRealtimeRewards] = useState<string>("0");

  const contractAddress = "0x0134068820cee34aa11806158c7f7386da29b4f1";
  const stakingContractABI = [
    {
      "inputs": [{ "internalType": "address", "name": "_rewardToken", "type": "address" }],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "claimRewards",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getRewardTokenBalance",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
      "name": "getStakeInfo",
      "outputs": [
        { "internalType": "uint256", "name": "amountStaked", "type": "uint256" },
        { "internalType": "uint256", "name": "amountLocked", "type": "uint256" },
        { "internalType": "uint256", "name": "lastClaimTime", "type": "uint256" },
        { "internalType": "uint256", "name": "gsaRewards", "type": "uint256" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
  ];

  const rewardRate = 2000;
  const rewardDuration = 48 * 60 * 60;

  useEffect(() => {
    if (!window.ethereum) {
      console.error("No se encontró MetaMask o un proveedor de Ethereum.");
      return;
    }

    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(web3Provider);

    const stakingContract = new ethers.Contract(contractAddress, stakingContractABI, web3Provider.getSigner());
    setContract(stakingContract);
  }, []);

  useEffect(() => {
    if (contract && address) {
      fetchStakeInfo();
    }
  }, [contract, address]);

  useEffect(() => {
    if (userStakeInfo) {
      const interval = setInterval(() => {
        calculateRealtimeRewards();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [userStakeInfo]);

  const fetchStakeInfo = async () => {
    try {
      console.log("Obteniendo información del stake para:", address);
      const stakeInfo = await contract?.getStakeInfo(address);
      console.log("Respuesta del contrato:", stakeInfo);

      if (stakeInfo) {
        setUserStakeInfo({
          amountStaked: ethers.utils.formatUnits(stakeInfo.amountStaked, 6),
          amountLocked: ethers.utils.formatUnits(stakeInfo.amountLocked, 6),
          lastClaimTime: stakeInfo.lastClaimTime.toNumber(),
          gsaRewards: ethers.utils.formatUnits(stakeInfo.gsaRewards, 18),
        });
      }
    } catch (error) {
      console.error("Error al obtener la información del stake:", error);
    }
  };

  const calculateRealtimeRewards = () => {
    if (!userStakeInfo) return;

    const { amountStaked, lastClaimTime } = userStakeInfo;
    const currentTime = Math.floor(Date.now() / 1000);
    const timeStaked = currentTime - lastClaimTime;

    if (timeStaked <= 0 || amountStaked === "0.0") {
      setRealtimeRewards("0.00");
      return;
    }

    const amountStakedBN = ethers.utils.parseUnits(amountStaked, 6);
    const accruedRewardsBN = amountStakedBN.mul(rewardRate).mul(timeStaked).div(rewardDuration);
    const accruedRewards = ethers.utils.formatUnits(accruedRewardsBN, 18);
    
    setRealtimeRewards(parseFloat(accruedRewards).toFixed(2));
  };

  return <div><p>{realtimeRewards} GSA</p></div>;
};

export default SEv3Rewards;
