import React, { useState, useEffect } from 'react';
import {
    useAddress,
    useContract,
    useContractRead,
    useTokenBalance,
} from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import ErrorMessagePopup from "./popups/ErrorMessagePopup";
import SuccessMessagePopup from './popups/SuccessMessagePopup';
import { stakingContractAddress } from "../../consts/Details2";
import UserBalance from './UserStats/UserBalance';
import XGsaTokenBalance from "./xGSABalance";
import APRCalculatorTwo from './APRCalc2';

const SEHeaderT: React.FC = () => {
    const address = useAddress();
    const [amountToStake, setAmountToStake] = useState(1000000);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isStaking, setIsStaking] = useState(false);
    const [isUnstaking, setIsUnstaking] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);

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

    const updateQuantity = (operation: string) => {
        if (operation === "+" && amountToStake < 100000000) {
            setAmountToStake(amountToStake + 1000000);
        } else if (operation === "-" && amountToStake > 1000000) {
            setAmountToStake(amountToStake - 1000000);
        }
    };

    const handleStake = async () => {
        if (stakingToken && staking) {
            setIsStaking(true);  // Muestra "Staking..."
            setLoading(true);    // Cambia luego a "Processing..."
            
            try {
                await stakingToken.setAllowance(stakingContractAddress, amountToStake);
                await staking?.call("stake", [ethers.utils.parseEther(amountToStake.toString())]);
                setSuccessMessage("GSA Staked");
            } catch (error) {
                setErrorMessage("Error: Transaction rejected or insufficient funds.");
            } finally {
                setIsStaking(false);
                setLoading(false);
            }
        }
    };    

    const handleUnstake = async () => {
        if (staking && address) {
            setIsUnstaking(true);  // Muestra "Unstaking..."
            setLoading(true);      // Luego cambia a "Processing..."
            
            try {
                const stakedInfo = await staking?.call("getStakeInfo", [address]);
    
                if (!stakedInfo || stakedInfo.length === 0) {
                    setErrorMessage("No staked information found.");
                    return;
                }
    
                const stakedAmount = ethers.BigNumber.from(stakedInfo[0]?.toString() || "0");
    
                if (!stakedAmount.isZero()) {
                    await staking?.call("withdraw", [stakedAmount]);
                    setSuccessMessage("All GSA Unstaked successfully!");
                } else {
                    setErrorMessage("You have no staked tokens to withdraw.");
                }
            } catch (error: any) {
                setErrorMessage("Error: Transaction rejected or invalid input.");
            } finally {
                setIsUnstaking(false);
                setLoading(false);
            }
        } else {
            setErrorMessage("Staking contract not initialized.");
        }
    };    

    const handleClaimRewards = async () => {
        if (staking) {
            setIsClaiming(true);  // Muestra "Claiming..."
            setLoading(true);      // Luego cambia a "Processing..."
            
            try {
                await staking?.call("claimRewards", []);
                setSuccessMessage("Rewards claimed");
            } catch (error) {
                setErrorMessage("Error: Transaction rejected or insufficient funds.");
            } finally {
                setIsClaiming(false);
                setLoading(false);
            }
        }
    };    

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

    useEffect(() => {
        setInterval(() => {
            refetchData();
        }, 10000);
    }, []);

    const refetchData = () => {
        refetchRewardTokenBalance();
        refetchStakingTokenBalance();
        refetchStakingInfo();
    };

    return (
        <section id="news">
            <div id="simple-earn-v4" className="container">
                <h3 className="fn__maintitle big" data-text="GSA Staking" data-align="center">
                    GSA Staking
                </h3>
                <div className="fn_cs_news">
                    <div className="news_part">
                        <div className="left_items">
                            <div className="blog__item">
                                <div className="meta">
                                    <p>Simple Earn V4</p>
                                </div>
                                <div className="title">
                                    <p style={{ color: "yellow" }}>Token Migration is progress unstake your tokens. Wait for new version.</p>
                                </div>

                                <div style={{ marginTop: "50px" }} className="containerGrid">
                                    {errorMessage && (
                                        <ErrorMessagePopup
                                            message={errorMessage}
                                            onClose={() => setErrorMessage("")}
                                        />
                                    )}
                                    {successMessage && (
                                        <SuccessMessagePopup
                                            message={successMessage}
                                            onClose={() => setSuccessMessage("")}
                                        />
                                    )}
                                    <button className="metaportal_fn_buttonLW" onClick={handleUnstake} disabled={loading}>
                                        {isUnstaking ? "Unstaking..." : loading ? "Processing..." : "Unstake"}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="right_items">
                            <div className="blog__item" style={{ height: "100%" }}>
                                <div className="counter">
                                    <span className="cc">
                                        <img style={{ marginTop: "-3px" }} src="/img/LOGOS-GS-32x32.png" alt="" />
                                    </span>
                                </div>
                                <div className="meta">
                                    <p>$GSA Staked</p>
                                </div>
                                <div className="title">
                                    <h3>{stakeInfo && parseFloat(ethers.utils.formatEther(stakeInfo[0].toString())).toFixed(2)}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SEHeaderT;
