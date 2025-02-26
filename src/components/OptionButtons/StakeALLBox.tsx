import React, { useState, useEffect } from "react";
import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { STAKING_CONTRACT_ADDRESS, BUSINESSES_CONTRACT_ADDRESS2 } from "../../../consts/contracts2New";
import SuccessMessagePopup from "../popups/SuccessMessagePopup";
import ErrorMessagePopup from "../popups/ErrorMessagePopup";
import StakingContractABI from "../../../contracts/StakingContractBoxABI.json"; // ABI del contrato de staking

const StakeAllBox: React.FC = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isStaking, setIsStaking] = useState(false);

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

    async function stakeAllNfts() {
        if (!address || !stakedTokens) return;

        const stakedTokenIds = stakedTokens[0]; // Array de IDs de NFTs en stake
        const stakedTokenAmounts = stakedTokens[1]; // Array de cantidades correspondientes

        if (!stakedTokenIds || stakedTokenIds.length === 0) {
            console.log("No NFTs to stake.");
            return;
        }

        try {
            setIsStaking(true);
            if (!window.ethereum) {
                setErrorMessage("No Ethereum wallet found.");
                return;
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []); // Solicita conexión de la billetera
            const signer = provider.getSigner();

            // Crear una instancia del contrato ERC1155 usando ethers.js
            const erc1155 = new ethers.Contract(
                BUSINESSES_CONTRACT_ADDRESS2,
                [
                    "function setApprovalForAll(address operator, bool approved)",
                ],
                signer
            );

            // Aprobar todos los tokens ERC1155 para el contrato de staking
            const approveTx = await erc1155.setApprovalForAll(STAKING_CONTRACT_ADDRESS, true);
            await approveTx.wait(); // Esperar a que la transacción se confirme

            // Hacer stake de todos los NFTs
            const txPromises = stakedTokenIds.map((tokenId, i) => {
                const amount = stakedTokenAmounts[i];
                return stakingContract.stake(tokenId, amount);
            });

            // Esperar todas las transacciones en paralelo
            const txResults = await Promise.all(txPromises);

            // Esperar a que todas las transacciones se confirmen
            await Promise.all(txResults.map(tx => tx.wait()));

            setSuccessMessage("All NFTs Staked Successfully");
        } catch (error) {
            console.error(error);
            setErrorMessage("Error: Transaction rejected or insufficient funds.");
        } finally {
            setIsStaking(false);
        }
    }

    return (
        <div>
            {successMessage && <SuccessMessagePopup message={successMessage} onClose={() => setSuccessMessage('')} />}
            {errorMessage && <ErrorMessagePopup message={errorMessage} onClose={() => setErrorMessage('')} />}
            <button
                onClick={stakeAllNfts}
                disabled={isStaking}
                className="metaportal_fn_buttonLW"
            >
                {isStaking ? "Mining..." : "Mine All S.Items"}
            </button>
        </div>
    );
};

export default StakeAllBox;
