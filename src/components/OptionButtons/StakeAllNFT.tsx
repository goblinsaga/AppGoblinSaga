import React, { useState, useEffect } from "react";
import { useAddress, useContract, useContractRead, useOwnedNFTs } from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import { stakingContractAddress, nftDropContractAddress } from "../../../consts/contractAddressesNew";
import SuccessMessagePopup from "../popups/SuccessMessagePopup";
import ErrorMessagePopup from "../popups/ErrorMessagePopup";
import StakingContractGoblinsABI from "../../../contracts/StakingContractGoblinsABI.json"; // Asegúrate de tener el ABI del contrato

const StakeAllNFT: React.FC = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isStaking, setIsStaking] = useState(false);

    // Limpiar mensajes de error y éxito después de 4 segundos
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

    // Obtener la dirección del usuario conectado
    const address = useAddress();

    // Obtener instancias de los contratos
    const { contract: nftDropContract } = useContract(nftDropContractAddress, "nft-drop");
    const { contract: stakingContract, isLoading: isStakingContractLoading } = useContract(stakingContractAddress);

    // Obtener los NFTs poseídos por el usuario
    const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);

    // Obtener información de los NFTs apostados
    const { data: stakedTokens } = useContractRead(stakingContract, "getStakeInfo", [address]);

    // Verificar si un NFT ya está apostado
    function isNftStaked(nftId: string) {
        return stakedTokens && stakedTokens[0]?.includes(BigNumber.from(nftId));
    }

    // Función para aprobar el contrato de staking
    async function approveStakingContract() {
        if (!nftDropContract || !address) {
            setErrorMessage("NFT Drop contract or address not found.");
            return false;
        }

        try {
            console.log("Approving staking contract...");
            const tx = await nftDropContract.setApprovalForAll(stakingContractAddress, true);
            console.log("Approval transaction sent:", tx);

            // Esperar a que la transacción sea minada
            const receipt = await tx.wait(); // Usar `wait` en la transacción de Ethers.js
            console.log("Approval transaction confirmed:", receipt);

            return true;
        } catch (error) {
            console.error("Approval error:", error);
            setErrorMessage("Error: Approval transaction failed.");
            return false;
        }
    }

    // Función para apostar todos los NFTs no apostados
    async function stakeAllNfts() {
        if (!address || !ownedNfts) {
            console.error("No address or owned NFTs found.");
            setErrorMessage("No address or owned NFTs found.");
            return;
        }

        // Filtrar los NFTs que no están apostados
        const unstackedNfts = ownedNfts.filter((nft) => !isNftStaked(nft.metadata.id));
        if (unstackedNfts.length === 0) {
            console.log("No NFTs to stake.");
            setErrorMessage("No NFTs to stake.");
            return;
        }

        // Obtener los IDs de los NFTs no apostados
        const nftIds = unstackedNfts.map((nft) => nft.metadata.id);
        console.log("NFT IDs to stake:", nftIds);

        try {
            setIsStaking(true);

            // Verificar si MetaMask está instalado
            if (!window.ethereum) {
                setErrorMessage("No Ethereum wallet found.");
                return;
            }

            // Conectar a MetaMask y obtener el signer
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();

            // Crear una instancia del contrato de staking
            const stakingContract = new ethers.Contract(stakingContractAddress, StakingContractGoblinsABI, signer);

            // Verificar si el contrato de staking tiene aprobación para manejar los NFTs
            const isApproved = await nftDropContract?.isApproved(address, stakingContractAddress);
            console.log("Is staking contract approved?", isApproved);

            if (!isApproved) {
                const approvalSuccess = await approveStakingContract();
                if (!approvalSuccess) {
                    return; // Detener si la aprobación falla
                }
            }

            // Apostar los NFTs con gasLimit automático
            console.log("Staking NFTs...");
            const tx = await stakingContract.stake(nftIds);
            await tx.wait(); // Esperar a que la transacción sea minada
            console.log("Staking transaction confirmed:", tx.hash);

            setSuccessMessage("Goblins Working");
        } catch (error) {
            console.error("Staking error:", error);
            setErrorMessage("Error: Transaction rejected or insufficient funds.");
        } finally {
            setIsStaking(false);
        }
    }

    return (
        <div>
            {/* Mostrar mensajes de éxito y error */}
            {successMessage && <SuccessMessagePopup message={successMessage} onClose={() => setSuccessMessage('')} />}
            {errorMessage && <ErrorMessagePopup message={errorMessage} onClose={() => setErrorMessage('')} />}

            {/* Botón para apostar todos los NFTs */}
            <button
                onClick={stakeAllNfts}
                disabled={isStaking || isStakingContractLoading}
                className="metaportal_fn_buttonLW full"
            >
                {isStaking ? "Staking..." : "Mine All NFTs"}
            </button>
        </div>
    );
};

export default StakeAllNFT;
