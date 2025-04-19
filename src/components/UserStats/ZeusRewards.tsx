import React, { useEffect, useState } from "react";
import { useAddress, useContract } from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import { STAKING_CONTRACT_ADDRESS } from "../../../consts/ZeusContracts";

// Alchemy URL
const ALCHEMY_URL = "https://polygon-mainnet.g.alchemy.com/v2/LRQw0cS60vd8TahpVDFBoOBx8zEpcMTy";

const ZeusRewards: React.FC = () => {
  const address = useAddress();

  // Contract setup
  const { contract: stakingContract3 } = useContract(STAKING_CONTRACT_ADDRESS);

  // State variables for rewards
  const [claimableRewards3, setClaimableRewards3] = useState<BigNumber>(BigNumber.from(0));
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message state

  useEffect(() => {
    if (!address) return;

    // Crear proveedor usando Alchemy
    const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_URL);

    // Crear instancia de contrato con Alchemy provider
    const contract3 = new ethers.Contract(STAKING_CONTRACT_ADDRESS, ["function getStakeInfo(address) view returns (uint256, uint256, uint256)"], provider);

    async function loadRewards() {
      try {
        // Claimable rewards for the third staking contract
        const stakeInfo3 = await contract3.getStakeInfo(address);
        setClaimableRewards3(stakeInfo3[2]);

        // Set loading to false after rewards are loaded
        setIsLoading(false);
        setErrorMessage(null); // Clear any previous error message
      } catch (error: any) {
        console.error("Failed to load rewards:", error.message);

        // Set a specific error message
        setErrorMessage(error.message);

        // Reset loading state
        setIsLoading(false);
      }
    }

    loadRewards();

    // Retry after 5 seconds in case of failure
    const intervalId = setInterval(loadRewards, 5000);
    return () => clearInterval(intervalId);
  }, [address]);

  // Format rewards function
  const formatRewards = (revenue: BigNumber) => {
    const convertToEther = ethers.utils.formatUnits(revenue, 18);
    const number = parseFloat(convertToEther);
    return number.toFixed(2); // Esto asegura que siempre tenga 2 decimales
  };

  return (
    <div>
      <div>
        {isLoading ? (
          <p>Loading...</p>
        ) : errorMessage ? (
          <p>Error: {errorMessage}</p>
        ) : (
          <div>
            <p>{formatRewards(claimableRewards3)}<img src="/img/GSAV2.png" alt="$GSA" style={{ width: "20px", height: "20px", marginLeft: "5px", marginTop: "-3px" }} /></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZeusRewards;
