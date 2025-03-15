import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { useAddress } from "@thirdweb-dev/react";

const SEv5Rewards: React.FC = () => {
  const address = useAddress();
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [userStakeInfo, setUserStakeInfo] = useState<any>(null);
  const [realtimeRewards, setRealtimeRewards] = useState<string>("0");

  const contractAddress = "0xDA99b83Effd726f25f6bbB49fBf70844D1B85DbD"; // Dirección del contrato
  const stakingContractABI = [
    {
      "inputs": [
        { "internalType": "address", "name": "_rewardToken", "type": "address" }
      ],
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
    {
      "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "stake",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    // Agrega aquí el resto de funciones que necesites en el ABI
  ]; // ABI del contrato

  const rewardRate = 4000; // Recompensa fija por MATIC
  const rewardDuration = 48 * 60 * 60; // 48 horas en segundos

  useEffect(() => {
    if (window.ethereum) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);

      const stakingContract = new ethers.Contract(contractAddress, stakingContractABI, web3Provider.getSigner());
      setContract(stakingContract);
    }
  }, []);

  useEffect(() => {
    if (contract && address) {
      fetchStakeInfo();
      // Actualiza las recompensas más rápidamente
      const interval = setInterval(() => {
        calculateRealtimeRewards();
      }, 100); // 100 ms = 0.1 segundo

      // Limpiar intervalo al desmontar el componente
      return () => clearInterval(interval);
    }
  }, [contract, address, userStakeInfo]);

  const fetchStakeInfo = async () => {
    try {
      const stakeInfo = await contract?.getStakeInfo(address);
      if (stakeInfo) {
        const formattedStakeInfo = {
          amountStaked: ethers.utils.formatEther(stakeInfo.amountStaked),
          amountLocked: ethers.utils.formatEther(stakeInfo.amountLocked),
          lastClaimTime: stakeInfo.lastClaimTime.toNumber(), // Timestamp
          gsaRewards: ethers.utils.formatUnits(stakeInfo.gsaRewards, 18),
        };
        setUserStakeInfo(formattedStakeInfo);
      }
    } catch (error) {
      console.error("Error fetching stake info:", error);
    }
  };

  const calculateRealtimeRewards = () => {
    if (!userStakeInfo) return;

    const { amountStaked, lastClaimTime } = userStakeInfo;

    // Obtener el tiempo actual y el tiempo que ha pasado desde la última reclamación
    const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
    const timeStaked = currentTime - lastClaimTime; // Tiempo en segundos desde la última reclamación

    // Convertir `amountStaked` a BigNumber para cálculos
    const amountStakedBN = ethers.utils.parseUnits(amountStaked, 18);

    // Calcular recompensas acumuladas
    const accruedRewardsBN = amountStakedBN
      .mul(rewardRate)
      .mul(timeStaked)
      .div(rewardDuration);

    // Convertir de BigNumber a un número decimal legible y limitar a 4 decimales
    const accruedRewards = ethers.utils.formatUnits(accruedRewardsBN, 18);
    const formattedAccruedRewards = parseFloat(accruedRewards).toFixed(2);

    setRealtimeRewards(formattedAccruedRewards);
  };

  return (
    <div>
      <p>{realtimeRewards} WGSA</p>
    </div>
  );
};

export default SEv5Rewards;
