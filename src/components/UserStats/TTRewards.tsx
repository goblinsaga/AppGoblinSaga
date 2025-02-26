import React, { useEffect, useState } from "react";
import { useAddress, useContract } from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import { GGSA_CONTRACT_ADDRESS, BGSA_CONTRACT_ADDRESS, MGSA_CONTRACT_ADDRESS } from "../../../consts/stakingContracts";

// Alchemy URL
const ALCHEMY_URL = "https://polygon-mainnet.g.alchemy.com/v2/5PDJn3VDxRSiTXjdbz-dfVaZ6GuoVQ8c";

const CombinedRewards: React.FC = () => {
  const address = useAddress();

  // Contract setups
  const { contract: stakingContract1 } = useContract(GGSA_CONTRACT_ADDRESS);
  const { contract: stakingContract2 } = useContract(BGSA_CONTRACT_ADDRESS);
  const { contract: stakingContract3 } = useContract(MGSA_CONTRACT_ADDRESS);

  // State variables for rewards
  const [claimableRewards1, setClaimableRewards1] = useState<BigNumber>(BigNumber.from(0));
  const [claimableRewards2, setClaimableRewards2] = useState<BigNumber>(BigNumber.from(0));
  const [claimableRewards3, setClaimableRewards3] = useState<BigNumber>(BigNumber.from(0));
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message state

  useEffect(() => {
    if (!address) return;

    setIsLoading(true);

    // Crear proveedor usando Alchemy
    const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_URL);

    // Crear instancias de contrato con Alchemy provider
    const contract1 = new ethers.Contract(GGSA_CONTRACT_ADDRESS, ["function getStakeInfo(address) view returns (uint256, uint256, uint256)"], provider);
    const contract2 = new ethers.Contract(BGSA_CONTRACT_ADDRESS, ["function getStakeInfo(address) view returns (uint256, uint256, uint256)"], provider);
    const contract3 = new ethers.Contract(MGSA_CONTRACT_ADDRESS, ["function getStakeInfo(address) view returns (uint256, uint256, uint256)"], provider);

    async function loadRewards() {
      try {
        // Claimable rewards for the first staking contract
        const stakeInfo1 = await contract1.getStakeInfo(address);
        setClaimableRewards1(stakeInfo1[1]);

        // Claimable rewards for the second staking contract
        const stakeInfo2 = await contract2.getStakeInfo(address);
        setClaimableRewards2(stakeInfo2[2]);

        // Claimable rewards for the third staking contract
        const stakeInfo3 = await contract3.getStakeInfo(address);
        setClaimableRewards3(stakeInfo3[2]);

        // Set loading to false after rewards are loaded
        setIsLoading(false);
        setErrorMessage(null); // Clear any previous error message
      } catch (error: any) {
        console.error("Failed to load rewards:", error.message);
        setErrorMessage("Failed on Fetch. Reload App.");
      } finally {
        setIsLoading(false);
      }
    }

    loadRewards();

    // Retry after 5 seconds in case of failure
    const intervalId = setInterval(loadRewards, 5000);
    return () => clearInterval(intervalId);
  }, [address]);

  if (!address) return null;

  // Sum the rewards
  const totalRewards = claimableRewards1.add(claimableRewards2).add(claimableRewards3);

  const formatRewards = (revenue: BigNumber) => {
    const convertToEther = ethers.utils.formatUnits(revenue, 18);
    const number = parseFloat(convertToEther);
    return number.toFixed(2); // Esto asegura que siempre tenga 2 decimales
  };  

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : errorMessage ? (
        <p>Error: {errorMessage}</p>
      ) : (
        <p>{formatRewards(totalRewards)}</p>
      )}
    </div>
  );
};

export default CombinedRewards;