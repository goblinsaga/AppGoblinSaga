import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useAddress } from '@thirdweb-dev/react'; // Importar useAddress de thirdweb

// Dirección del contrato inteligente
const CONTRACT_ADDRESS = '0x0134068820cee34aa11806158c7f7386da29b4f1';

// ABI del contrato (simplificado para este ejemplo)
const CONTRACT_ABI = [
    "function getStakeInfo(address _user) external view returns (uint256 amountStaked, uint256 amountLocked, uint256 lastClaimTime, uint256 gsaRewards)",
    "function _calculateRewards(address _user) internal view returns (uint256)"
];

const SEv3Rewards: React.FC = () => {
    const [pendingRewards, setPendingRewards] = useState<string>('0');
    const userAddress = useAddress(); // Obtener la dirección del usuario conectado

    // Obtener las recompensas pendientes
    const fetchPendingRewards = async (address: string) => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
            try {
                // Llamar a la función interna _calculateRewards usando un método especial
                const pendingRewardsWei = await contract.callStatic._calculateRewards(address);
                const pendingRewards = ethers.utils.formatUnits(pendingRewardsWei, 18); // 18 decimales para GSA
                setPendingRewards(pendingRewards);
            } catch (error) {
                console.error("Error fetching pending rewards:", error);
            }
        }
    };

    useEffect(() => {
        if (userAddress) {
            fetchPendingRewards(userAddress);
        }
    }, [userAddress]);

    return (
        <div>
            {userAddress ? (
                <div>
                    <p>{pendingRewards} WGSA</p>
                </div>
            ) : (
                <p>Please connect your wallet to view your rewards.</p>
            )}
        </div>
    );
};

export default SEv3Rewards;
