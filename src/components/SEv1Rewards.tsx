import React, { useState, useEffect } from 'react';
import {
    useAddress,
    useContract,
    useContractRead,
    useTokenBalance,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { stakingContractAddress } from "../../consts/Details3";

const SEv1Rewards: React.FC = () => {
    const address = useAddress();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [walletBalance, setWalletBalance] = useState<string | null>(null);

    // Manejadores de errores y éxito con tiempo de vida
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

    const { contract: staking, isLoading: isStakingLoading } = useContract(
        stakingContractAddress,
        "custom"
    );

    // Get contract data from staking contract
    const { data: rewardTokenAddress } = useContractRead(staking, "rewardToken");
    const { data: stakingTokenAddress } = useContractRead(
        staking,
        "stakingToken"
    );

    // Initialize token contracts
    const { contract: stakingToken, isLoading: isStakingTokenLoading } =
        useContract(stakingTokenAddress, "token");
    const { contract: rewardToken, isLoading: isRewardTokenLoading } =
        useContract(rewardTokenAddress, "token");

    // Token balances
    const { data: stakingTokenBalance, refetch: refetchStakingTokenBalance } =
        useTokenBalance(stakingToken, address);
    const { data: rewardTokenBalance, refetch: refetchRewardTokenBalance } =
        useTokenBalance(rewardToken, address);

    // Get staking data
    const {
        data: stakeInfo,
        refetch: refetchStakingInfo,
        isLoading: isStakeInfoLoading,
    } = useContractRead(staking, "getStakeInfo", [address || "0"]);

    // Update wallet balance when stakingTokenBalance changes
    useEffect(() => {
        if (stakingTokenBalance) {
            setWalletBalance(stakingTokenBalance.displayValue);
        }
    }, [stakingTokenBalance]);

    // Refetch data every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            refetchData();
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const refetchData = () => {
        refetchRewardTokenBalance();
        refetchStakingTokenBalance();
        refetchStakingInfo();
    };

    return (
        <section>
            <div>
                <p>{stakeInfo && parseFloat(ethers.utils.formatEther(stakeInfo[1].toString())).toFixed(2)} WGSA</p>
            </div>
        </section>
    );
};

export default SEv1Rewards;
