import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import RewardsContractABI from '../../../contracts/RewardsContractABI.json';
import React from 'react';
import { useAddress } from "@thirdweb-dev/react";

const contractAddress = '0x4c501f493aE00a866A8cB2De4fc31f19e5d676f0';
const ALCHEMY_URL = 'https://polygon-mainnet.g.alchemy.com/v2/Rwyo0npJ8fyyLQQQ5vFlH9K3yva_adGb';

const MonarchCheck = ({ onVerificationStatus }) => {
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

            const verified = nftCount >= 9;
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
        }}
        >
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
                    <img
                        src="/img/MONARCH-RANK.png"
                        alt="King Rank"
                        style={{ width: "65px", height: "auto", cursor: "pointer" }}
                    />
                    <p style={{ fontSize: "12px", margin: "5px 0 0 0" }}>Monarch</p>
                </div>
            ) : (
                <div>
                    <p style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        fontSize: "12px"
                    }}>
                        You need 9 Goblins to own this badge.
                    </p>
                </div>
            )}
        </div>
    );
};

export default MonarchCheck;
