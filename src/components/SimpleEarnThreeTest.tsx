import React, { useState, useEffect } from 'react';
import { useAddress } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import ErrorMessagePopup from "./popups/ErrorMessagePopup";
import SuccessMessagePopup from './popups/SuccessMessagePopup';
import UserBalanceWGSA from './UserStats/UserBalanceWGSA';
import SEv3Rewards from './SEv3Rewards';
import WGsaTokenBalance from './WGSABalance2';

// ABI del nuevo contrato USDCGSAst
const stakingContractABI = [
    {
        "inputs": [
            { "internalType": "address", "name": "_rewardToken", "type": "address" },
            { "internalType": "address", "name": "_stakingToken", "type": "address" }
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
        "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }],
        "name": "stake",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    // Agrega aquí el resto de funciones que necesites en el ABI
];

const contractAddress = "0x06d3A4A70eeEc01aA963767F431AEb409066b3fe"; // Dirección del nuevo contrato
const usdcAddress = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"; // Reemplaza con la dirección del contrato USDC

const SEHeaderThree: React.FC = () => {
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
            const usdcContract = new ethers.Contract(usdcAddress, ["function balanceOf(address) view returns (uint256)"], provider?.getSigner());
            const balance = await usdcContract.balanceOf(address);
            if (balance) {
                const formattedBalance = ethers.utils.formatUnits(balance, 6); // USDC tiene 6 decimales
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
                    amountStaked: ethers.utils.formatUnits(stakeInfo.amountStaked, 6), // USDC tiene 6 decimales
                    amountLocked: ethers.utils.formatUnits(stakeInfo.amountLocked, 6),
                    lastClaimTime: new Date(stakeInfo.lastClaimTime * 1000).toLocaleString(),
                    gsaRewards: ethers.utils.formatUnits(stakeInfo.gsaRewards, 18), // GSA tiene 18 decimales
                };
                setUserStakeInfo(formattedStakeInfo);
            }
        } catch (error) {
            console.error("Error fetching stake info:", error);
        }
    };

    const handleSetMax = () => {
        if (walletBalance) {
            const maxBalance = Math.trunc(parseFloat(walletBalance)); // Descartar decimales
            setAmountToStake(maxBalance);
        }
    };

    const updateQuantity = (operation: string) => {
        if (operation === "+" && amountToStake < 500) {
            setAmountToStake(amountToStake + 1);
        } else if (operation === "-" && amountToStake > 1) {
            setAmountToStake(amountToStake - 1);
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

    const handleApprove = async () => {
        if (!provider || !address) return;

        try {
            const usdcContract = new ethers.Contract(usdcAddress, [
                "function approve(address spender, uint256 amount) returns (bool)"
            ], provider.getSigner());

            const amount = ethers.utils.parseUnits(amountToStake.toString(), 6); // USDC tiene 6 decimales
            const tx = await usdcContract.approve(contractAddress, amount);
            await tx.wait();
            setSuccessMessage("Approval successful!");
        } catch (error) {
            console.error("Error approving USDC:", error);
            setErrorMessage("Error approving USDC. Try Again.");
        }
    };

    const handleStake = async () => {
        if (!contract || !address || !provider) return;
    
        try {
            setStakingLoading(true);
    
            // Dirección del contrato USDC en Polygon
            const usdcAddress = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
            const usdcContract = new ethers.Contract(
                usdcAddress,
                ["function approve(address spender, uint256 amount) returns (bool)", "function allowance(address owner, address spender) view returns (uint256)"],
                provider.getSigner()
            );
    
            // Verificar la cantidad aprobada actualmente
            const allowance = await usdcContract.allowance(address, contractAddress);
            const amountToStakeInWei = ethers.utils.parseUnits(amountToStake.toString(), 6); // USDC tiene 6 decimales
    
            // Si la cantidad aprobada es menor que la cantidad a stakear, hacer approve primero
            if (allowance.lt(amountToStakeInWei)) {
                const approveTx = await usdcContract.approve(contractAddress, amountToStakeInWei);
                await approveTx.wait();
                setSuccessMessage("Approval successful! Proceeding to stake...");
            }
    
            // Hacer el staking
            const stakeTx = await contract.stake(amountToStakeInWei);
            await stakeTx.wait();
            setSuccessMessage("Staking successful!");
    
            // Actualizar la información del staking y recompensas
            fetchStakeInfo();
            fetchRewards();
        } catch (error) {
            console.error("Error during staking process:", error);
            setErrorMessage("Error during staking process. Try Again.");
        } finally {
            setStakingLoading(false);
        }
    };

    const handleWithdraw = async (amount: string) => {
        if (!contract || !address) return;

        try {
            setUnstakingLoading(true);
            const withdrawTx = await contract.withdraw(ethers.utils.parseUnits(amount, 6)); // USDC tiene 6 decimales
            await withdrawTx.wait();
            fetchStakeInfo();
            fetchRewards();
            setSuccessMessage("Withdrawal successful!");
        } catch (error) {
            console.error("Error withdrawing USDC:", error);
            setErrorMessage("Error withdrawing USDC. Try Again.");
        } finally {
            setUnstakingLoading(false);
        }
    };

    const handleClaimRewards = async () => {
        if (!contract || !address) return;

        try {
            setClaimingLoading(true);
            const claimTx = await contract.claimRewards();
            await claimTx.wait();
            fetchStakeInfo();
            fetchRewards();
            setSuccessMessage("Rewards claimed successfully!");
        } catch (error) {
            console.error("Error claiming rewards:", error);
            setErrorMessage("Error claiming rewards. Try Again.");
        } finally {
            setClaimingLoading(false);
        }
    };

    return (
        <section id="news">
            <div id="USDC-Staking" className="container">
                <h3 className="fn__maintitle big" data-text="USDC/WGSA Staking" data-align="center">
                    USDC/WGSA Staking
                </h3>
                <div className="fn_cs_news">
                    <div className="news_part">
                        <div className="left_items">
                            <div className="blog__item">
                                <div className="meta">
                                    <p>Stake USDC Earn WGSA</p>
                                </div>
                                <div className="title">
                                    <h3>USDC/WGSA Stake</h3>
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
                                        src="/img/USDC-WGSA.png"
                                        alt="Imagen centrada"
                                        style={{ display: "block", width: "100%" }} /* opcional para ajustar el ancho de la imagen */
                                    />
                                </div>

                                <div className="qnt" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px" }}>
                                    <span className="decrease" onClick={() => updateQuantity("-")}>-</span>
                                    <span className="summ">{amountToStake}</span>
                                    <span className="increase" onClick={() => updateQuantity("+")}>+</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <span className="setMax" onClick={handleSetMax}>Set Max.</span>
                                </div>
                                <div style={{ marginTop: "50px" }} className="containerGrid">
                                    {errorMessage && <ErrorMessagePopup message={errorMessage} onClose={() => setErrorMessage("")} />}
                                    {successMessage && <SuccessMessagePopup message={successMessage} onClose={() => setSuccessMessage("")} />}
                                    <button className="metaportal_fn_buttonLW" onClick={handleStake} disabled={stakingLoading}>
                                        {stakingLoading ? "Staking..." : "Stake"}
                                    </button>
                                    <button className="metaportal_fn_buttonLW" onClick={() => handleWithdraw(userStakeInfo?.amountStaked)} disabled={unstakingLoading}>
                                        {unstakingLoading ? "Unstaking..." : "Unstake USDC"}
                                    </button>
                                </div>
                                <div>
                                    <p style={{ color: "yellow", textAlign: "center", marginTop: "10px", fontSize: "13px" }}>BEFORE STAKE/UNSTAKE CLAIM YOUR REWARDS FIRST</p>
                                </div>
                                <div style={{ marginTop: "30px", textAlign: "center" }}>
                                    <p>USDC blocked: <span style={{ color: "yellow" }}>20%</span> (To $GSA liquidity pool)</p>
                                    <div className="blog__item" style={{ marginTop: "50px" }}>
                                        <p style={{ color: "yellow" }}>$WGSA supply (To claim)</p>
                                        <WGsaTokenBalance />
                                    </div>
                                    <div className="blog__item" style={{ marginTop: "30px", marginBottom: "30px" }}>
                                        <p style={{ color: "yellow" }}>APR: 9.125%</p>
                                        <p>1 USDC = 100 $WGSA/48H</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="right_items">
                            <div className="blog__item">
                                <div className="counter">
                                    <span className="cc">
                                        <img src="/img/WGSAV2.png" alt="GSA" />
                                    </span>
                                </div>
                                <div className="meta">
                                    <p>$WGSA Balance</p>
                                </div>
                                <div className="title">
                                    <h3><UserBalanceWGSA /></h3>
                                </div>
                                <div className="meta">
                                    <p>$WGSA Claimed so far</p>
                                </div>
                                <div className="title">
                                    <h3>{totalAccruedRewards !== null ? totalAccruedRewards : "Loading..."}</h3>
                                </div>
                            </div>
                            <div className="blog__item">
                                <div className="counter">
                                    <span className="cc">
                                        <img src="/img/USDC.png" alt="USDC" />
                                    </span>
                                </div>
                                <div className="meta">
                                    <p>USDC Staked</p>
                                </div>
                                <div className="title">
                                    <h3>{userStakeInfo ? userStakeInfo.amountStaked : "Loading..."}</h3>
                                </div>
                                <div className="meta">
                                    <p>USDC Locked</p>
                                </div>
                                <div className="title">
                                    <h3>{userStakeInfo ? userStakeInfo.amountLocked : "Loading..."}</h3>
                                </div>
                            </div>
                            <div className="blog__item">
                                <div className="counter">
                                    <span className="cc">
                                        <img src="/img/WGSAV2.png" alt="GSA" />
                                    </span>
                                </div>
                                <div className="meta">
                                    <p>$WGSA Rewards</p>
                                </div>
                                <div className="title">
                                    <h3><SEv3Rewards /></h3>
                                </div>
                                <div className="containerGrid">
                                    <button className="metaportal_fn_buttonLW" onClick={handleClaimRewards} disabled={claimingLoading || totalAccruedRewards === "0"}>
                                        {claimingLoading ? "Claiming..." : "Claim WGSA"}
                                    </button>
                                    <a style={{ textDecoration: "none" }} href='https://docs.goblinsaga.xyz/features/usdc-gsa-staking' target='blank'>
                                        <button className="metaportal_fn_buttonLW">About</button>
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

export default SEHeaderThree;
