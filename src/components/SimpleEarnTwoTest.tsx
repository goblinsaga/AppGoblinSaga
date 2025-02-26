import React, { useState, useEffect } from 'react';
import {
    useAddress,
    useContract,
    useContractRead,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import ErrorMessagePopup from "./popups/ErrorMessagePopup";
import SuccessMessagePopup from './popups/SuccessMessagePopup';
import StakingCheck from './StakingCheck';
import UserBalance from './UserStats/UserBalance';
import SEv2Rewards from './SEv2Rewards';
import GsaTokenBalance from './GSABalance';
import APRCalculator from './APRCalc';

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

const contractAddress = "0xfa4aC4ADFB3D98646B16ec7a2d4d7c3082ab31D9";

const SEHeader2: React.FC = () => {
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
        if (contract && address) {
            fetchStakeInfo();
            fetchRewards(); // Llamada para obtener las recompensas

            // Actualiza recompensas cada segundo
            const interval = setInterval(() => {
                fetchStakeInfo();
                fetchRewards(); // Actualiza las recompensas
            }, 10000); // 1000 ms = 1 segundo

            // Limpiar intervalo al desmontar el componente
            return () => clearInterval(interval);
        }
    }, [contract, address]);

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

    // Handling error and success message timeouts
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

    const handleStake = async () => {
        if (!contract || !address) return;

        try {
            setStakingLoading(true); // Inicia el estado de carga para staking
            const stakeTx = await contract?.stake({
                value: ethers.utils.parseEther(amountToStake.toString()),
            });
            await stakeTx.wait();
            fetchStakeInfo();
            fetchRewards(); // Actualiza las recompensas después de hacer stake
        } catch (error) {
            console.error("Error staking POL:", error);
            setErrorMessage("Error staking POL. Try Again.");
        } finally {
            setStakingLoading(false); // Finaliza el estado de carga para staking
        }
    };


    const handleWithdraw = async (amount: string) => {
        if (!contract || !address) return;

        try {
            setUnstakingLoading(true); // Inicia el estado de carga para unstaking
            const withdrawTx = await contract?.withdraw(ethers.utils.parseEther(amount));
            await withdrawTx.wait();
            fetchStakeInfo();
            fetchRewards(); // Actualiza las recompensas después de retirar
        } catch (error) {
            console.error("Error withdrawing POL:", error);
            setErrorMessage("Error withdrawing POL. Try Again.");
        } finally {
            setUnstakingLoading(false); // Finaliza el estado de carga para unstaking
        }
    };


    const handleClaimRewards = async () => {
        if (!contract || !address) return;

        try {
            setClaimingLoading(true); // Inicia el estado de carga para reclamar recompensas
            const claimTx = await contract?.claimRewards();
            await claimTx.wait();
            fetchStakeInfo();
            fetchRewards(); // Actualiza las recompensas después de reclamar
        } catch (error) {
            console.error("Error claiming rewards:", error);
            setErrorMessage("Error claiming rewards. Try Again.");
        } finally {
            setClaimingLoading(false); // Finaliza el estado de carga para reclamar recompensas
        }
    };


    return (
        <section id="news">
            <div id="simple-earn-v3" className="container">
                <h3 className="fn__maintitle big" data-text="Simple Earn V3" data-align="center">
                    Simple Earn V3
                </h3>
                <div className="fn_cs_news">
                    <div className="news_part">
                        <div className="left_items">
                            <div className="blog__item">
                                <div className="meta">
                                    <p>Simple Earn V3</p>
                                </div>
                                <div className="title">
                                    <h3 style={{ color: "yellow" }}>Token Migration is progress unstake your tokens.</h3>
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
                                        onClick={() => handleWithdraw(userStakeInfo.amountStaked)}
                                        disabled={unstakingLoading}
                                    >
                                        {unstakingLoading ? "Unstaking..." : "Unstake All"}
                                    </button>
                                </div>

                                <div style={{ marginTop: "30px", textAlign: "center" }}>
                                    <p>$POL blocked: <span style={{ color: "yellow" }}>20%</span> (To $GSA liquidity pool)</p>
                                </div>
                            </div>
                        </div>
                        <div className="right_items">
                            <div className="blog__item" style={{ height: "100%" }}>
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
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SEHeader2;