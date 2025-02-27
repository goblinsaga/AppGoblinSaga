import React, { useState, useEffect } from "react";
import { useAddress, useContract, useContractRead, useOwnedNFTs } from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import { stakingContractAddress, nftDropContractAddress } from "../../consts/contractAddressesNew";
import SuccessMessagePopup from "./popups/SuccessMessagePopup";
import ErrorMessagePopup from "./popups/ErrorMessagePopup";
import StakingContractGoblinsABI from "../../contracts/StakingContractGoblinsABI.json";

const StakeUnstakeNFTs: React.FC = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [quantity, setQuantity] = useState<number>(1); // Default starting value
    const [isStakeMode, setIsStakeMode] = useState(true); // true = Stake, false = Unstake

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
    const { contract: nftDropContract } = useContract(nftDropContractAddress, "nft-drop");
    const { contract } = useContract(stakingContractAddress);
    const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);
    const { data: stakedTokens } = useContractRead(contract, "getStakeInfo", [address]);

    // Calcular el número máximo de NFTs no staked (para Stake) o staked (para Unstake)
    const maxAvailableNfts = isStakeMode
        ? ownedNfts?.filter((nft) => !isNftStaked(nft.metadata.id)).length || 0 // NFTs no staked
        : stakedTokens?.[0]?.length || 0; // NFTs staked

    // Función para establecer la cantidad máxima de NFTs
    const setMaxQuantity = () => {
        setQuantity(maxAvailableNfts);
    };

    const updateQuantity = (type) => {
        setQuantity((prev) => {
            if (type === "+") {
                return prev + 1; // Aumentar de 1 en 1
            } else if (type === "-" && prev > 1) {
                return prev - 1; // Disminuir de 1 en 1, pero no bajar de 1
            }
            return prev;
        });
    };

    async function processNFTs() {
        if (!address || quantity <= 0) return;

        setIsProcessing(true);

        if (isStakeMode) {
            await stakeNfts();
        } else {
            await unstakeNfts();
        }

        setIsProcessing(false);
    }

    async function stakeNfts() {
        const unstackedNfts = ownedNfts?.filter((nft) => !isNftStaked(nft.metadata.id)) || [];

        if (unstackedNfts.length === 0) {
            setErrorMessage("No NFTs available to stake.");
            return;
        }

        const selectedNfts = unstackedNfts.slice(0, Math.min(quantity, unstackedNfts.length));
        const nftIds = selectedNfts.map((nft) => nft.metadata.id);

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const stakingContract = new ethers.Contract(stakingContractAddress, StakingContractGoblinsABI, signer);

            // Siempre solicitar la aprobación
            await nftDropContract?.setApprovalForAll(stakingContractAddress, true);

            await stakingContract.stake(nftIds);
            setSuccessMessage(`Staked ${nftIds.length} NFTs successfully!`);
        } catch (error) {
            setErrorMessage("Error: Transaction rejected or insufficient funds.");
        }
    }

    async function unstakeNfts() {
        const stakedNftIds = stakedTokens?.[0]?.map((stakedToken: BigNumber) => stakedToken.toString()) || [];

        if (stakedNftIds.length === 0) {
            setErrorMessage("No NFTs available to unstake.");
            return;
        }

        const selectedNfts = stakedNftIds.slice(0, Math.min(quantity, stakedNftIds.length));

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const stakingContract = new ethers.Contract(stakingContractAddress, StakingContractGoblinsABI, signer);

            await stakingContract.withdraw(selectedNfts);
            setSuccessMessage(`Unstaked ${selectedNfts.length} NFTs successfully!`);
        } catch (error) {
            setErrorMessage("Error: Transaction rejected or insufficient funds.");
        }
    }

    function isNftStaked(nftId: string) {
        return stakedTokens && stakedTokens[0]?.includes(BigNumber.from(nftId));
    }

    return (
        <div>
            {successMessage && <SuccessMessagePopup message={successMessage} onClose={() => setSuccessMessage('')} />}
            {errorMessage && <ErrorMessagePopup message={errorMessage} onClose={() => setErrorMessage('')} />}

            {/* Contenedor para el botón de flechas, la cantidad y el "Set Max" */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between', // Distribuye el espacio entre los elementos
                alignItems: 'center', // Centra verticalmente los elementos
                width: '100%', // Ocupa todo el ancho disponible
                padding: '0 10px', // Añade un poco de padding a los lados
            }}>
                {/* Botón de flechas (⮂) */}
                <button
                    onClick={() => setIsStakeMode(!isStakeMode)}
                    style={{
                        cursor: "pointer",
                        fontSize: "14px",
                        background: "none",
                        border: "none",
                        color: "inherit",
                        padding: 0 // Elimina el padding por defecto del botón
                    }}
                >
                    ⮂
                </button>

                {/* Sección de cantidad */}
                <div className="qnt" style={{ display: 'flex', alignItems: 'center', marginLeft: "50px" }}>
                    <span className="decrease" onClick={() => updateQuantity("-")} style={{ marginRight: '10px' }}>-</span>
                    <span className="summ">{quantity}</span>
                    <span className="increase" onClick={() => updateQuantity("+")} style={{ marginLeft: '10px' }}>+</span>
                </div>

                {/* "Set Max" */}
                <span
                    onClick={setMaxQuantity}
                    style={{
                        cursor: "pointer",
                        fontSize: "14px",
                        textDecoration: "none",
                        padding: 0 // Elimina el padding por defecto del span
                    }}
                >
                    Set Max
                </span>
            </div>

            {/* Botón principal para Mine/Unmine NFTs */}
            <button
                onClick={processNFTs}
                disabled={isProcessing}
                className="metaportal_fn_buttonLW full"
            >
                {isProcessing
                    ? (isStakeMode ? "Mining..." : "Unmining...")
                    : (isStakeMode ? "Mine NFTs" : "Unmine NFTs")}
            </button>
        </div>
    );
};

export default StakeUnstakeNFTs;
