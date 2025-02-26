'use client';

import {
    useContract,
    useNFT,
    useAddress,
    useContractRead,
} from "@thirdweb-dev/react";
import { BUSINESSES_CONTRACT_ADDRESS, STAKING_CONTRACT_ADDRESS } from "../../consts/contractsNew";
import { useEffect, useState } from "react";
import ErrorMessagePopup from '../components/popups/ErrorMessagePopup';
import SuccessMessagePopup from '../components/popups/SuccessMessagePopup';
import React from "react";
import { MediaRenderer } from "thirdweb/react";
import { client } from "../app/client";
import { useReadContract } from "thirdweb/react";
import { formatEther } from "ethers/lib/utils";
import { STAKING_CONTRACT } from "../../utils/MiningContracts";

// Props for the BusinessCard component
type Props = {
    tokenId: number;
};

export default function BusinessCard({ tokenId }: Props) {
    const [withdrawQuantity, setWithdrawQuantity] = useState(1); // Valor inicial de 1
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);

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

    // Obtener la dirección del usuario
    const address = useAddress();

    const [claimableRewards, setClaimableRewards] = useState<string>('')
    // Obtener instancia del contrato de negocios
    const { contract: businessesContract } = useContract(BUSINESSES_CONTRACT_ADDRESS);
    const { data: nft } = useNFT(businessesContract, tokenId);

    // Obtener instancia del contrato de staking
    const { contract: stakingContract } = useContract(STAKING_CONTRACT_ADDRESS);
    const { data: businessRewards } = useContractRead(
        stakingContract,
        "getStakeInfoForToken",
        [
            tokenId,
            address
        ]
    );

    const { data, isPending, error } = useReadContract({
        contract: STAKING_CONTRACT,
        method:
            "getStakeInfoForToken",
        params: [BigInt(tokenId), address],
    });

    useEffect(() => {

        // Función que actualiza las recompensas
        const updateRewards = () => {
            if (data && !isPending && !error) {
                const rewardsInEther = formatEther(data[1]); // De Gwei a Ether
                const formattedRewards = parseFloat(rewardsInEther).toFixed(2); // Redondeo a 2 decimales
                setClaimableRewards(formattedRewards);
            }
        };

        // Actualizar recompensas al montar el componente
        updateRewards();

        // Configurar el intervalo de 3 segundos para actualizar las recompensas
        const intervalId = setInterval(updateRewards, 5000);

        // Limpiar el intervalo cuando el componente se desmonte
        return () => {
            clearInterval(intervalId);
        };
    }, [data, isPending, error]);

    // Función para actualizar la cantidad de retiro
    const updateQuantity = (operation: string) => {
        const maxQuantity = businessRewards ? businessRewards[0].toNumber() : 1; // Establecemos el máximo en base a los tokens que tiene el usuario en staking
        if (operation === "+" && withdrawQuantity < maxQuantity) {
            setWithdrawQuantity(withdrawQuantity + 1);
        } else if (operation === "-" && withdrawQuantity > 1) {
            setWithdrawQuantity(withdrawQuantity - 1);
        }
    };

    const handleWithdraw = async () => {
        setIsWithdrawing(true);
        try {
            await stakingContract?.call("withdraw", [nft?.metadata.id, withdrawQuantity]);
            setSuccessMessage('Withdraw Complete');
        } catch (error) {
            setErrorMessage('Error: Transaction rejected or insufficient funds.');
        } finally {
            setIsWithdrawing(false);
        }
    };

    const handleClaimRewards = async () => {
        setIsClaiming(true);
        try {
            await stakingContract?.call("claimRewards", [tokenId]);
            setSuccessMessage('Revenue Claimed');
        } catch (error) {
            setErrorMessage('Error: Transaction rejected or insufficient funds.');
        } finally {
            setIsClaiming(false);
        }
    };

    return (
        <div>
            <MediaRenderer
                client={client}
                src={nft?.metadata.image}
                className="nftMedia"
                style={{
                    marginTop: "25px",
                    borderRadius: "10px",
                    marginBottom: "10px",
                    height: "300px",
                    width: "300px"
                }}
            />
            <div style={{ margin: "10px" }}>
                <p style={{ textAlign: "justify" }}>Type: {nft?.metadata.name}</p>
                <div>
                    {isPending ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>Error: {error.message}</p>
                    ) : (
                        <p>Rewards: {claimableRewards.toString()}</p> // Convertimos a string para mostrar
                    )}
                </div>
                {businessRewards && (
                    businessRewards[1].gt(0) && (
                        <p style={{ textAlign: "justify" }}>Owned: {businessRewards[0].toNumber()}</p>
                    )
                )}
            </div>

            {successMessage && <SuccessMessagePopup message={successMessage} onClose={() => setSuccessMessage('')} />}
            {errorMessage && <ErrorMessagePopup message={errorMessage} onClose={() => setErrorMessage('')} />}

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: "11px", marginTop: "10px" }}>Amount to withdraw ↓</p>
            </div>

            <div className="qnt" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px" }}>
                <span className="decrease" onClick={() => updateQuantity("-")} style={{ cursor: "pointer", margin: "0 10px" }}>-</span>
                <span className="summ">
                    {withdrawQuantity}
                </span>
                <span className="increase" onClick={() => updateQuantity("+")} style={{ cursor: "pointer", margin: "0 10px" }}>+</span>
            </div>

            <div className="containerGrid">
                <button className="metaportal_fn_buttonLW" onClick={handleWithdraw} style={{ marginTop: "20px" }}>
                    {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
                </button>

                <button className="metaportal_fn_buttonLW" onClick={handleClaimRewards} style={{ marginTop: "20px" }}>
                    {isClaiming ? 'Claiming...' : 'Claim Revenue'}
                </button>
            </div>

        </div>
    );
}
