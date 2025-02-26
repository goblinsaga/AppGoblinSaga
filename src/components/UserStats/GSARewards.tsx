import {
  useAddress,
  useContract,
  useContractRead,
  useTokenBalance,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { stakingContractAddress } from "../../../consts/Details";
import React from "react";

const GSARewards = () => {
  const address = useAddress();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const { contract: staking } = useContract(stakingContractAddress, "custom");
  const { data: rewardTokenAddress } = useContractRead(staking, "rewardToken");
  const { data: stakingTokenAddress } = useContractRead(staking, "stakingToken");

  const { contract: stakingToken } = useContract(stakingTokenAddress, "token");
  const { contract: rewardToken } = useContract(rewardTokenAddress, "token");

  const { data: stakingTokenBalance } = useTokenBalance(stakingToken, address);
  const { data: rewardTokenBalance } = useTokenBalance(rewardToken, address);

  const { data: stakeInfo, refetch: refetchStakingInfo } = useContractRead(staking, "getStakeInfo", [address || "0"]);

  useEffect(() => {
    const interval = setInterval(refetchData, 500);
    return () => clearInterval(interval);
  }, []);

  const refetchData = () => {
    refetchStakingInfo();
  };

  const handleLogin = () => {
    if (password === "stakegsa") {
      setLoggedIn(true);
      setSuccessMessage('Logged In Successfully');
    } else {
      setErrorMessage('Wrong Password');
      setPassword("");
    }
  };

  // Definimos la tasa de conversión
  const conversionRate = 1 / 100; // 1 xGSA por cada 100 GSA

  // Calculamos la cantidad total de xGSA generados en un día
  const calculateTotalXGSAGeneratedPerDay = (amountToStake) => {
    return amountToStake * conversionRate;
  };

  const totalXGSAGeneratedPerDay = calculateTotalXGSAGeneratedPerDay(stakingTokenBalance ? parseFloat(stakingTokenBalance.displayValue) : 0);

  return (
    <div>
      <p>
        {!stakeInfo 
          ? "Loading..." 
          : parseFloat(ethers.utils.formatEther(stakeInfo[1].toString())).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
    </div>
  );
};

export default GSARewards;
