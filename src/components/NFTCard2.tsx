'use client';

import {
    useContract,
    useNFT,
    useAddress,
    toEther,
    useClaimConditions,
} from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import { BUSINESSES_CONTRACT_ADDRESS, STAKING_CONTRACT_ADDRESS, TOKEN_CONTRACT_ADDRESS } from "../../consts/contractsNew";
import { useState, useEffect, useRef } from "react";
import ErrorMessagePopup from '../components/popups/ErrorMessagePopup';
import SuccessMessagePopup from '../components/popups/SuccessMessagePopup';
import { BigNumber } from "ethers";
import React from "react";
import { MediaRenderer } from "thirdweb/react";
import { client } from "../app/client";

type Props = {
    nft: NFT;
};

export default function NFTCard({ nft }: Props) {
    // Verificar si el ID del NFT es 12, 13 o 14
    const excludedIds = [12, 13, 14];
    if (excludedIds.includes(Number(nft.metadata.id))) {
        return null; // No renderizar el componente si el ID está en la lista de excluidos
    }

    const address = useAddress();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
    const { contract: stakingContract } = useContract(STAKING_CONTRACT_ADDRESS);

    const [quantity, setQuantity] = useState(1);
    const [isBuying, setIsBuying] = useState(true);
    const [claimState, setClaimState] = useState<"init" | "nftClaim" | "staking">("init");

    const nftIdRef = useRef(nft.metadata.id);

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

    useEffect(() => {
        if (!stakingContract || !address) return;

        async function loadClaimableRewards() {
            try {
                const stakeInfo = await stakingContract?.call("getRewardsPerUnitTime", [nftIdRef.current]);
                setClaimableRewards(stakeInfo);
            } catch (error) {
                console.error("Failed to load claimable rewards:", error);
            }
        }

        loadClaimableRewards();

        const intervalId = setInterval(loadClaimableRewards, 1000);

        return () => clearInterval(intervalId);
    }, [stakingContract, address]);

    const truncateRevenue = (revenue: BigNumber) => {
        const convertToEther = toEther(revenue);
        return convertToEther.toString().slice(0, 6);
    };

    const { contract: businessesContract } = useContract(BUSINESSES_CONTRACT_ADDRESS, "edition-drop");
    const { data: claimCondition } = useClaimConditions(businessesContract, nft.metadata.id);

    const handleClaim = async () => {
        if (!address) {
            setErrorMessage('Error: No wallet connected.');
            return;
        }

        setClaimState("nftClaim");
        try {
            // Check if the contract is loaded
            if (!businessesContract) {
                throw new Error("Contract not loaded.");
            }

            // Attempt to claim the NFT
            await businessesContract.erc1155.claim(nft.metadata.id, quantity);
            console.log("NFT claimed");

            setClaimState("staking");
            const isApproved = await businessesContract?.isApproved(address, STAKING_CONTRACT_ADDRESS);
            if (!isApproved) {
                await businessesContract?.setApprovalForAll(STAKING_CONTRACT_ADDRESS, true);
            }
            await stakingContract?.call("stake", [nft.metadata.id, quantity]);

            setSuccessMessage('Mine Claimed');
        } catch (error) {
            console.error(error);
            setErrorMessage('Error: Transaction rejected or insufficient funds.');
        } finally {
            setClaimState("init");
        }
    };

    const handleStake = async () => {
        try {
            if (!address || !businessesContract || !stakingContract) {
                throw new Error("Faltan datos necesarios para realizar el staking.");
            }

            // Verificar aprobación utilizando el método `call`
            const isApproved = await businessesContract?.call("isApprovedForAll", [address, STAKING_CONTRACT_ADDRESS]);
            if (!isApproved) {
                console.log("Solicitando aprobación para el contrato de staking...");
                await businessesContract?.call("setApprovalForAll", [STAKING_CONTRACT_ADDRESS, true]);
                console.log("Aprobación completada.");
            }

            // Realizar staking
            await stakingContract?.call("stake", [nft.metadata.id, quantity]);
            setSuccessMessage('Mine Claimed Successfully');
        } catch (error) {
            console.error("Error en handleStake:", error);
            setErrorMessage('Error: Not enough NFTs to Mine or Transaction rejected');
        }
    };

    const updateQuantity = (type: string) => {
        if (type === "+" && quantity < 5) {
            setQuantity(quantity + 1);
        } else if (type === "-" && quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const toggleMode = () => {
        setIsBuying(!isBuying);
        setQuantity(1); // Reiniciar cantidad al cambiar de modo
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
            <div className="nftBox">
                <p style={{ textAlign: "justify" }}>Type: {nft.metadata.name}</p>
                {claimCondition && claimCondition.length > 0 && (
                    claimCondition.map((condition, index) => (
                        <div key={index}>
                            <p style={{ textAlign: "justify" }}>Cost: {toEther(condition.price)}<img src="/img/GSAV2.png" alt="$GSA" style={{ width: "20px", height: "20px", margin: "0px 5px" }} /></p>
                            {claimableRewards && (
                                <p style={{ textAlign: "justify" }}>Earns: <b>{truncateRevenue(claimableRewards)}</b><img src="/img/GSAV2.png" alt="$GSA" style={{ width: "20px", height: "20px", margin: "0px 5px" }} /><b style={{ fontSize: "12px" }}>42h</b></p>
                            )}
                            <p style={{ textAlign: "justify" }}>Claimable: 15</p>
                        </div>
                    ))
                )}
            </div>
            {successMessage && <SuccessMessagePopup message={successMessage} onClose={() => setSuccessMessage('')} />}
            {errorMessage && <ErrorMessagePopup message={errorMessage} onClose={() => setErrorMessage('')} />}

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: "11px", marginTop: "10px" }}>{isBuying ? "Amount to buy ↓" : "Amount to mine ↓"}</p>
            </div>

            <div className="qnt" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px" }}>
                <span className="decrease" onClick={() => updateQuantity("-")} style={{ cursor: "pointer", margin: "0 10px" }}>-</span>
                <span className="summ">{quantity}</span>
                <span className="increase" onClick={() => updateQuantity("+")} style={{ cursor: "pointer", margin: "0 10px" }}>+</span>
            </div>

            <div style={{ marginTop: "15px" }} className="containerGrid">
                <button
                    onClick={isBuying ? handleClaim : handleStake}
                    disabled={claimState !== "init" || quantity <= 0}
                    className="metaportal_fn_buttonLW"
                >
                    {claimState === "nftClaim" ? "Purchasing..." : claimState === "staking" ? "Opening..." : isBuying ? "Buy Now" : "Mine NFT"}
                </button>

                <button onClick={toggleMode} className="metaportal_fn_buttonLW">
                    Set to {isBuying ? "Mine" : "Buy"}
                </button>
            </div>
        </div>
    );
}
