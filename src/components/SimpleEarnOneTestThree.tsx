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
import { stakingContractAddress } from "../../consts/Details3";
import UserBalance from './UserStats/UserBalance';
import WGsaTokenBalance from "./WGSABalance";

const SEHeaderH: React.FC = () => {
    const address = useAddress();
    const [amountToStake, setAmountToStake] = useState(1000000);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isStaking, setIsStaking] = useState(false);
    const [isUnstaking, setIsUnstaking] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);
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

    const updateQuantity = (operation: string) => {
        if (operation === "+" && amountToStake < 500000000) {
            setAmountToStake(amountToStake + 1000000);
        } else if (operation === "-" && amountToStake > 1000000) {
            setAmountToStake(amountToStake - 1000000);
        }
    };

    const handleSetMax = () => {
        if (stakingTokenBalance) {
            const maxBalance = Math.trunc(parseFloat(stakingTokenBalance.displayValue));
            setAmountToStake(maxBalance);
        } else {
            setErrorMessage("Wallet balance not available.");
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
            <div id="GSA-WGSA-Stake">
                <div className="fn_cs_news">
                    <div className="news_part">
                        <div className="left_items">
                            <div className="blog__item">
                                <div className="meta">
                                    <p>GSA Staking</p>
                                </div>
                                <div className="title">
                                    <h3>GSA/WGSA Stake</h3>
                                </div>
                                <div
                                    className="image"
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: "50%",
                                        margin: "0 auto",
                                    }}
                                >
                                    <img
                                        src="/img/GSA-WGSA.png"
                                        alt="Imagen centrada"
                                        style={{ display: "block", width: "100%" }} /* opcional para ajustar el ancho de la imagen */
                                    />
                                </div>

                                <div className="qnt" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px" }}>
                                    <span className="decrease" onClick={() => updateQuantity("-")} style={{ cursor: "pointer", margin: "0 10px" }}>-</span>
                                    <span className="summ">{amountToStake}</span>
                                    <span className="increase" onClick={() => updateQuantity("+")} style={{ cursor: "pointer", margin: "0 10px" }}>+</span>
                                </div>

                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <span className="setMax" onClick={handleSetMax} style={{ cursor: "pointer", margin: "0 10px" }}>Set Max.</span>
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
                                    <button className="metaportal_fn_buttonLW" onClick={handleStake} disabled={loading}>
                                        {isStaking ? "Staking..." : loading ? "Processing..." : "Stake"}
                                    </button>
                                    <button className="metaportal_fn_buttonLW" onClick={handleUnstake} disabled={loading}>
                                        {isUnstaking ? "Unstaking..." : loading ? "Processing..." : "Unstake"}
                                    </button>
                                </div>
                                <div style={{ marginTop: "30px", textAlign: "center" }}>
                                    <div className="blog__item" style={{ marginTop: "50px" }}>
                                        <p style={{ color: "yellow" }}>$WGSA supply (To claim)</p>
                                        <WGsaTokenBalance />
                                    </div>

                                    <div className="blog__item" style={{ marginTop: "30px", marginBottom: "30px" }}>
                                        <p style={{ color: "yellow" }}>APR: 9.13%</p>
                                        <p>1 $GSA = 0.0005 $WGSA/48H</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="right_items">
                            <div className="blog__item">
                                <div className="counter">
                                    <span className="cc">
                                        <img style={{ marginTop: "-3px" }} src="/img/GSAV2.png" alt="GSA" />
                                    </span>
                                </div>
                                <div className="meta">
                                    <p>$GSA Balance</p>
                                </div>
                                <div className="title">
                                    <h3><UserBalance /></h3>
                                </div>
                            </div>
                            <div className="blog__item">
                                <div className="counter">
                                    <span className="cc">
                                        <img style={{ marginTop: "-3px" }} src="/img/GSAV2.png" alt="GSA" />
                                    </span>
                                </div>
                                <div className="meta">
                                    <p>$GSA Staked</p>
                                </div>
                                <div className="title">
                                    <h3>{stakeInfo && parseFloat(ethers.utils.formatEther(stakeInfo[0].toString())).toFixed(2)}</h3>
                                </div>
                            </div>
                            <div className="blog__item">
                                <div className="counter">
                                    <span className="cc">
                                        <img style={{ marginTop: "-3px" }} src="/img/WGSAV2.png" alt="" />
                                    </span>
                                </div>
                                <div className="meta">
                                    <p>$WGSA Revenue</p>
                                </div>
                                <div className="title">
                                    <h3>{stakeInfo && parseFloat(ethers.utils.formatEther(stakeInfo[1].toString())).toFixed(2)}</h3>
                                </div>
                                <div className="containerGrid">
                                    <button className="metaportal_fn_buttonLW" onClick={handleClaimRewards} disabled={loading}>
                                        {isClaiming ? "Claiming..." : loading ? "Processing..." : "Claim WGSA"}
                                    </button>

                                    <a style={{ textDecoration: "none" }} href='https://docs.goblinsaga.xyz/features/gsa-xgsa-staking' target='blank'>
                                        <button
                                            className="metaportal_fn_buttonLW"
                                        >
                                            About
                                        </button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SEHeaderH;
