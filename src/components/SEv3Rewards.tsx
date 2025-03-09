import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { useAddress } from "@thirdweb-dev/react";

const SEv3Rewards: React.FC = () => {
  const address = useAddress();
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [userStakeInfo, setUserStakeInfo] = useState<any>(null);
  const [realtimeRewards, setRealtimeRewards] = useState<string>("0");

  const contractAddress = "0x0134068820cee34aa11806158c7f7386da29b4f1"; // Dirección del contrato
  const stakingContractABI = [
    {
      "inputs": [
        { "internalType": "address", "name": "_rewardToken", "type": "address" },
        { "internalType": "address", "name": "_stakingToken", "type": "address" }
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
      "inputs": [],
      "name": "GSA_PER_USDC",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "TIME_UNIT",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    }
  ]; // ABI simplificado

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
      }, 1000); // 1 segundo

      // Limpiar intervalo al desmontar el componente
      return () => clearInterval(interval);
    }
  }, [contract, address, userStakeInfo]);

  const fetchStakeInfo = async () => {
    try {
      const stakeInfo = await contract?.getStakeInfo(address);
      if (stakeInfo) {
        const formattedStakeInfo = {
          amountStaked: ethers.utils.formatUnits(stakeInfo.amountStaked, 6), // USDC tiene 6 decimales
          amountLocked: ethers.utils.formatUnits(stakeInfo.amountLocked, 6),
          lastClaimTime: stakeInfo.lastClaimTime.toNumber(), // Timestamp
          gsaRewards: ethers.utils.formatUnits(stakeInfo.gsaRewards, 18), // GSA tiene 18 decimales
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

    // Convertir `amountStaked` a BigNumber para cálculos (USDC tiene 6 decimales)
    const amountStakedBN = ethers.utils.parseUnits(amountStaked, 6);

    // Obtener GSA_PER_USDC y TIME_UNIT del contrato
    const gsaPerUsdc = ethers.BigNumber.from(2000); // Recompensa fija por USDC
    const timeUnit = ethers.BigNumber.from(48 * 60 * 60); // 48 horas en segundos

    // Calcular recompensas acumuladas
    const accruedRewardsBN = amountStakedBN
      .mul(gsaPerUsdc)
      .mul(timeStaked)
      .div(timeUnit);

    // Convertir de BigNumber a un número decimal legible (GSA tiene 18 decimales)
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

export default SEv3Rewards;
