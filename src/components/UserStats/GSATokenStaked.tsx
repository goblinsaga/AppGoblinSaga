import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const STAKING_CONTRACT_ADDRESS = "0xD6D8C62E7b599Bf49CFB2B78ea898C84675F4906";

const contractABI = [
  "function getStakeInfo(address) view returns (uint256, uint256, uint256)"
];

const GSATokenStaked = () => {
  const [address, setAddress] = useState("");
  const [stakeAmount, setStakeAmount] = useState(ethers.BigNumber.from(0));
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStakeInfo = async () => {
      try {
        if (!window.ethereum) {
          throw new Error("MetaMask is not installed.");
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();
        setAddress(userAddress);

        const stakingContract = new ethers.Contract(
          STAKING_CONTRACT_ADDRESS,
          contractABI,
          provider
        );

        const stakeInfo = await stakingContract.getStakeInfo(userAddress);
        setStakeAmount(stakeInfo[0]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching stake info:", error);
        setErrorMessage(error.message || "An error occurred");
        setIsLoading(false);
      }
    };

    fetchStakeInfo();
  }, []);

  const formattedStake = ethers.utils.formatUnits(stakeAmount, 18);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <p>
          Staked Amount: {parseFloat(formattedStake).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} GSA
        </p>
      )}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default GSATokenStaked;
