import React, { useState, useEffect } from "react";
import { useAddress, useContract, useContractRead, useOwnedNFTs } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { STAKING_CONTRACT_ADDRESS, BUSINESSES_CONTRACT_ADDRESS } from "../../../consts/contractsNew";
import SuccessMessagePopup from "../popups/SuccessMessagePopup";
import ErrorMessagePopup from "../popups/ErrorMessagePopup";
import StakingContractABI from "../../../contracts/StakingContractBoxABI.json"; // ABI del contrato de staking

const StakeAllMines: React.FC = () => {
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
    const { contract: erc1155Contract } = useContract(BUSINESSES_CONTRACT_ADDRESS); // Sin ABI
    const { data: ownedNfts } = useOwnedNFTs(erc1155Contract, address);

    async function stakeAllNfts() {
        if (!address || !ownedNfts) return;

        // Verificar si hay NFTs para staking
        if (ownedNfts.length === 0) {
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

            const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, StakingContractABI, signer);
            const erc1155Contract = new ethers.Contract(BUSINESSES_CONTRACT_ADDRESS, erc1155Contract?.abi, signer);

            // Verificar si el contrato de staking está aprobado para transferir los NFTs
            const isApproved = await erc1155Contract.isApprovedForAll(address, STAKING_CONTRACT_ADDRESS);
            if (!isApproved) {
                // Si no está aprobado, solicitar aprobación
                const approveTx = await erc1155Contract.setApprovalForAll(STAKING_CONTRACT_ADDRESS, true);
                await approveTx.wait(); // Esperar a que la transacción se confirme
            }

            // Hacer stake de todos los NFTs
            const txPromises = ownedNfts.map((nft) => {
                const tokenId = nft.metadata.id;
                const amount = nft.quantityOwned || 1; // Cantidad de tokens ERC1155
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
                {isStaking ? "Mining..." : "Mine All Items"}
            </button>
        </div>
    );
};

export default StakeAllMines;
