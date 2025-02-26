import React, { useEffect, useState } from "react";
import { useAddress } from "@thirdweb-dev/react";
import { ethers } from "ethers";

const TOKEN_CONTRACT_ADDRESS = "0xC3882D10e49Ac4E9888D0C594DB723fC9cE95468";
const ALCHEMY_URL = "https://polygon-mainnet.g.alchemy.com/v2/5PDJn3VDxRSiTXjdbz-dfVaZ6GuoVQ8c";

const UserBalance: React.FC = () => {
  const address = useAddress();
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setBalance(null);
      setIsLoading(false);
      return;
    }

    const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_URL);
    const tokenContract = new ethers.Contract(
      TOKEN_CONTRACT_ADDRESS,
      [
        "function balanceOf(address account) view returns (uint256)",
        "event Transfer(address indexed from, address indexed to, uint256 value)",
      ],
      provider
    );

    async function fetchBalance() {
      try {
        setIsLoading(true);
        const rawBalance = await tokenContract.balanceOf(address);
        const formattedBalance = ethers.utils.formatUnits(rawBalance, 18);
        const balanceWithTwoDecimals = parseFloat(formattedBalance).toFixed(2); // Limita a 2 decimales
        setBalance(balanceWithTwoDecimals);
        setErrorMessage(null);
      } catch (error: any) {
        console.error("Error on fetch balance:", error.message);
        setErrorMessage("Error on fetch balance");
        setBalance(null);
      } finally {
        setIsLoading(false);
      }
    }

    // Fetch balance initially
    fetchBalance();

    // Listen for Transfer events and update balance when triggered
    const filter = tokenContract.filters.Transfer(null, address);
    tokenContract.on(filter, () => {
      console.log("Transfer detected! Updating balance...");
      fetchBalance();
    });

    // Cleanup listener on unmount
    return () => {
      tokenContract.removeAllListeners(filter);
    };
  }, [address]);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : errorMessage ? (
        <p>Error: {errorMessage}</p>
      ) : (
        <p>{balance}</p>
      )}
    </div>
  );
};

export default UserBalance;