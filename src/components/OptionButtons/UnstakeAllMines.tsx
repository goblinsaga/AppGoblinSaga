import React, { useState, useEffect } from "react";
import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { STAKING_CONTRACT_ADDRESS } from "../../../consts/contracts";
import SuccessMessagePopup from "../popups/SuccessMessagePopup";
import ErrorMessagePopup from "../popups/ErrorMessagePopup";
import StakingContractABI from "../../../contracts/StakingContractBoxABI.json"; // Asegúrate de tener el ABI correcto

const UnstakeAllMines: React.FC = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isUnstaking, setIsUnstaking] = useState(false);

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(''), 4000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 4000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const address = useAddress();
    const { contract: stakingContract } = useContract(STAKING_CONTRACT_ADDRESS, StakingContractABI);
    const { data: stakedTokens } = useContractRead(stakingContract, "getStakeInfo", [address]);

    async function unstakeAllNfts() {
        if (!address || !stakedTokens) return;

        const stakedTokenIds = stakedTokens[0]; // Array de IDs de NFTs en stake
        const stakedTokenAmounts = stakedTokens[1]; // Array de cantidades correspondientes

        if (!stakedTokenIds || stakedTokenIds.length === 0) {
            console.log("No NFTs to unstake.");
            return;
        }

        try {
            setIsUnstaking(true);
            if (!window.ethereum) {
                setErrorMessage("No Ethereum wallet found.");
                return;
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []); // Solicita conexión de la billetera
            const signer = provider.getSigner();
            const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, StakingContractABI, signer);

            // Agrupando las transacciones para que se procesen juntas
            const txPromises = stakedTokenIds.map((tokenId, i) => {
                const amount = stakedTokenAmounts[i];
                // Retiramos todos los tokens en una transacción combinada
                return stakingContract.withdraw(tokenId, amount);
            });

            // Espera todas las transacciones en paralelo
            const txResults = await Promise.all(txPromises);
            
            // Espera a que todas las transacciones se confirmen
            await Promise.all(txResults.map(tx => tx.wait()));

            setSuccessMessage("All NFTs Unstaked Successfully");
        } catch (error) {
            console.error(error);
            setErrorMessage("Error: Transaction rejected or insufficient funds.");
        } finally {
            setIsUnstaking(false);
        }
    }

    return (
        <div>
            {successMessage && <SuccessMessagePopup message={successMessage} onClose={() => setSuccessMessage('')} />}
            {errorMessage && <ErrorMessagePopup message={errorMessage} onClose={() => setErrorMessage('')} />}
            <button
                onClick={unstakeAllNfts}
                disabled={isUnstaking}
                className="metaportal_fn_buttonLW"
            >
                {isUnstaking ? "Unmining..." : "Unmine Items"}
            </button>
        </div>
    );
};

export default UnstakeAllMines;