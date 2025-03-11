import React, { useState, useEffect } from 'react';
import { useAddress } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import ErrorMessagePopup from "./popups/ErrorMessagePopup";
import SuccessMessagePopup from './popups/SuccessMessagePopup';
import UserBalance from './UserStats/UserBalance';
import SEv2Rewards from './SEv2Rewards';
import GsaTokenBalance from './GSABalance';

// ABI del contrato
const stakingContractABI = [
    {
        "inputs": [
            { "internalType": "address", "name": "_rewardToken", "type": "address" }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "claimRewards",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getRewardTokenBalance",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
        "name": "getStakeInfo",
        "outputs": [
            { "internalType": "uint256", "name": "amountStaked", "type": "uint256" },
            { "internalType": "uint256", "name": "amountLocked", "type": "uint256" },
            { "internalType": "uint256", "name": "lastClaimTime", "type": "uint256" },
            { "internalType": "uint256", "name": "gsaRewards", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "stake",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    // Agrega aquí el resto de funciones que necesites en el ABI
];

const contractAddress = "0x23673A4CF7943E5D06487420B08bB15dB1ac7C12";

const SEHeader2Two: React.FC = () => {
    const address = useAddress();
    const [amountToStake, setAmountToStake] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isVerified, setIsVerified] = useState<boolean | null>(null);
    const [stakingLoading, setStakingLoading] = useState(false);
    const [unstakingLoading, setUnstakingLoading] = useState(false);
    const [claimingLoading, setClaimingLoading] = useState(false);
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
    const [contract, setContract] = useState<ethers.Contract | null>(null);
    const [userStakeInfo, setUserStakeInfo] = useState<any>(null);
    const [totalAccruedRewards, setTotalAccruedRewards] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [walletBalance, setWalletBalance] = useState<string | null>(null);

    const handleVerificationStatus = (isVerified: boolean, loading: boolean) => {
        setIsVerified(isVerified);
        setLoading(loading);
    };

    useEffect(() => {
        if (window.ethereum) {
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(web3Provider);

            const stakingContract = new ethers.Contract(contractAddress, stakingContractABI, web3Provider.getSigner());
            setContract(stakingContract);
        }
    }, []);

    useEffect(() => {
        if (provider && address) {
            fetchWalletBalance();
        }
    }, [provider, address]);

    useEffect(() => {
        if (contract && address) {
            fetchStakeInfo();
            fetchRewards();

            const interval = setInterval(() => {
                fetchStakeInfo();
                fetchRewards();
            }, 10000);

            return () => clearInterval(interval);
        }
    }, [contract, address]);

    const fetchWalletBalance = async () => {
        try {
            const balance = await provider?.getBalance(address);
            if (balance) {
                const formattedBalance = ethers.utils.formatEther(balance);
                setWalletBalance(formattedBalance);
            }
        } catch (error) {
            console.error("Error fetching wallet balance:", error);
        }
    };

    const fetchStakeInfo = async () => {
        try {
            const stakeInfo = await contract?.getStakeInfo(address);
            if (stakeInfo) {
                const formattedStakeInfo = {
                    amountStaked: ethers.utils.formatEther(stakeInfo.amountStaked),
                    amountLocked: ethers.utils.formatEther(stakeInfo.amountLocked),
                    lastClaimTime: new Date(stakeInfo.lastClaimTime * 1000).toLocaleString(),
                    gsaRewards: ethers.utils.formatUnits(stakeInfo.gsaRewards, 18),
                };
                setUserStakeInfo(formattedStakeInfo);
            }
        } catch (error) {
            console.error("Error fetching stake info:", error);
        }
    };

    const fetchRewards = async () => {
        try {
            const rewards = await contract?.getStakeInfo(address);
            const formattedRewards = ethers.utils.formatUnits(rewards.gsaRewards, 18);
            setTotalAccruedRewards(parseFloat(formattedRewards).toFixed(2));
        } catch (error) {
            console.error("Error fetching rewards:", error);
        }
    };

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

    const updateQuantity = (operation: string) => {
        if (operation === "+" && amountToStake < 500) {
            setAmountToStake(amountToStake + 1);
        } else if (operation === "-" && amountToStake > 1) {
            setAmountToStake(amountToStake - 1);
        }
    };

    const handleSetMax = () => {
        if (walletBalance) {
            const maxBalance = Math.trunc(parseFloat(walletBalance)); // Descartar decimales
            setAmountToStake(maxBalance);
        }
    };

    const handleStake = async () => {
        if (!contract || !address) return;

        try {
            setStakingLoading(true);
            const stakeTx = await contract?.stake({
                value: ethers.utils.parseEther(amountToStake.toString()),
            });
            await stakeTx.wait();
            fetchStakeInfo();
            fetchRewards();
        } catch (error) {
            console.error("Error staking POL:", error);
            setErrorMessage("Error staking POL. Try Again.");
        } finally {
            setStakingLoading(false);
        }
    };

    const handleWithdraw = async (amount: string) => {
        if (!contract || !address) return;

        try {
            setUnstakingLoading(true);
            const withdrawTx = await contract?.withdraw(ethers.utils.parseEther(amount));
            await withdrawTx.wait();
            fetchStakeInfo();
            fetchRewards();
        } catch (error) {
            console.error("Error withdrawing POL:", error);
            setErrorMessage("Error withdrawing POL. Try Again.");
        } finally {
            setUnstakingLoading(false);
        }
    };

    const handleClaimRewards = async () => {
        if (!contract || !address) return;

        try {
            setClaimingLoading(true);
            const claimTx = await contract?.claimRewards();
            await claimTx.wait();
            fetchStakeInfo();
            fetchRewards();
        } catch (error) {
            console.error("Error claiming rewards:", error);
            setErrorMessage("Error claiming rewards. Try Again.");
        } finally {
            setClaimingLoading(false);
        }
    };

    return (
        <section>
            <div id="POL-Staking">
                <div className="fn_cs_news">
                    <div className="news_part">
                        <div className="left_items">
                            <div className="blog__item">
                                <div className="meta">
                                    <p>Stake POL Earn GSA</p>
                                </div>
                                <div className="title">
                                    <h3>POL/GSA Stake</h3>
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
                                        src="/img/POL-GSA2.png"
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
                                    <button
                                        className="metaportal_fn_buttonLW"
                                        onClick={handleStake}
                                        disabled={stakingLoading}
                                    >
                                        {stakingLoading ? "Staking..." : "Stake"}
                                    </button>
                                    <button
                                        className="metaportal_fn_buttonLW"
                                        onClick={() => handleWithdraw(userStakeInfo.amountStaked)}
                                        disabled={unstakingLoading}
                                    >
                                        {unstakingLoading ? "Unstaking..." : "Unstake POL"}
                                    </button>
                                </div>
                                <div>
                                    <p style={{ color: "yellow", textAlign: "center", marginTop: "10px", fontSize: "13px" }}>BEFORE STAKE/UNSTAKE CLAIM YOUR REWARDS FIRST</p>
                                </div>
                                <div style={{ marginTop: "30px", textAlign: "center" }}>
                                    <p>$POL blocked: <span style={{ color: "yellow" }}>20%</span> (To $GSA liquidity pool)</p>

                                    <div className="blog__item" style={{ marginTop: "50px" }}>
                                        <p style={{ color: "yellow" }}>$GSA supply (To claim)</p>
                                        <GsaTokenBalance />
                                    </div>

                                    <div className="blog__item" style={{ marginTop: "30px", marginBottom: "30px" }}>
                                        <p style={{ color: "yellow" }}>APR: 27.37%</p>
                                        <p>1 $POL = 1500 $GSA/48H</p>
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
                                <div className="meta">
                                    <p>$GSA Claimed so far</p>
                                </div>
                                <div className="title">
                                    <h3>{totalAccruedRewards !== null ? totalAccruedRewards : "Loading..."}</h3>
                                </div>
                            </div>
                            <div className="blog__item">
                                <div className="counter">
                                    <span className="cc">
                                        <img style={{ marginTop: "-3px" }} src="/img/polygon.webp" alt="" />
                                    </span>
                                </div>
                                <div className="meta">
                                    <p>$POL Staked</p>
                                </div>
                                <div className="title">
                                    <h3>{userStakeInfo ? userStakeInfo.amountStaked : "Loading..."}</h3>
                                </div>
                                <div className="meta">
                                    <p>$POL Locked</p>
                                </div>
                                <div className="title">
                                    <h3>{userStakeInfo ? userStakeInfo.amountLocked : "Loading..."}</h3>
                                </div>
                            </div>
                            <div className="blog__item">
                                <div className="counter">
                                    <span className="cc">
                                        <img style={{ marginTop: "-3px" }} src="/img/GSAV2.png" alt="" />
                                    </span>
                                </div>
                                <div className="meta">
                                    <p>$GSA Rewards</p>
                                </div>
                                <div className="title">
                                    <h3><SEv2Rewards /></h3>
                                </div>
                                <div className="containerGrid">
                                    <button
                                        className="metaportal_fn_buttonLW"
                                        onClick={handleClaimRewards}
                                        disabled={claimingLoading || totalAccruedRewards === "0"}
                                    >
                                        {claimingLoading ? "Claiming..." : "Claim GSA"}
                                    </button>

                                    <a style={{ textDecoration: "none" }} href='https://docs.goblinsaga.xyz/features/pol-gsa-staking' target='blank'>
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

export default SEHeader2Two;
