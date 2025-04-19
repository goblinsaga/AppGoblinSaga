import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import RewardsContractABI from '../../../contracts/RewardsContractABI.json';
import React from 'react';
import { useAddress } from "@thirdweb-dev/react";

const contractAddress = '0xf9ad937588e299bd76dc128139830c27e7f52668';
const ALCHEMY_URL = 'https://polygon-mainnet.g.alchemy.com/v2/Rwyo0npJ8fyyLQQQ5vFlH9K3yva_adGb';

const ZeusCheck = ({ onVerificationStatus }) => {
    const address = useAddress();
    const [isVerified, setIsVerified] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkStakingStatus = async () => {
        try {
            if (!address) {
                console.error('No wallet connected');
                setLoading(false);
                return;
            }

            const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_URL);
            const contract = new ethers.Contract(contractAddress, RewardsContractABI, provider);

            const stakeInfo = await contract.getStakeInfo(address);
            const nftCount = stakeInfo[0].length;

            const verified = nftCount >= 1;
            setIsVerified(verified);
            onVerificationStatus(verified, false);
        } catch (error) {
            console.error('Error fetching staking info:', error);
            onVerificationStatus(false, false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkStakingStatus();

        const handleAccountsChanged = () => {
            // Llamar a la función de verificación cuando la cuenta cambie
            checkStakingStatus();
        };

        // Agregar el listener para cambios en cuentas
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
        }

        // Limpiar el listener al desmontar el componente
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
        };
    }, [address, onVerificationStatus]);

    if (!address) {
        return null;
    }

    return (
        <div style={{
            border: "1px solid grey",
            width: "100px",
            height: "100px",
            borderRadius: "5px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 0 12px 4px rgba(128, 0, 128, 0.7)",
        }}>
            {loading ? (
                <p style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    fontSize: "12px",
                }}>
                    Verifying...
                </p>
            ) : isVerified ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <a href="/help-zeus" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                        <img
                            src="/img/PET-FREN.png"
                            alt="Emperor Rank"
                            style={{ width: "65px", height: "auto", cursor: "pointer" }}
                        />
                    </a>
                    <p style={{ fontSize: "12px", margin: "5px 0 0 0" }}>PetFren</p>
                </div>
            ) : (
                <div>
                    <a href="/help-zeus" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                        <p style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            fontSize: "12px",
                        }}>
                            You need 1 Help Zeus to own this badge.
                        </p>
                    </a>
                </div>
            )}
        </div>
    );
};

export default ZeusCheck;
