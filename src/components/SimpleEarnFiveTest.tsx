import React, { useState, useEffect } from 'react';
import { useAddress } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import ErrorMessagePopup from "./popups/ErrorMessagePopup";
import SuccessMessagePopup from './popups/SuccessMessagePopup';
import UserBalanceWGSA from './UserStats/UserBalanceWGSA';
import SEv5Rewards from './SEv5Rewards';
import WGsaTokenBalanceThree from './WGSABalance4';

// ABI del contrato aPOLGSAst actualizado
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
            { "internalType": "uint256", "name": "gsaRewards", "type": "uint256" },
            { "internalType": "uint256", "name": "interestRewards", "type": "uint256" } // Corregido
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
];

const contractAddress = "0xDA99b83Effd726f25f6bbB49fBf70844D1B85DbD"; // Nueva dirección del contrato
const aPolWMATICAddress = "0x6d80113e533a2C0fe82EaBD35f1875DcEA89Ea97"; // Dirección de aPolWMATIC

const SEHeaderFive: React.FC = () => {
    const address = useAddress();
    const [amountToStake, setAmountToStake] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [stakingLoading, setStakingLoading] = useState(false);
    const [unstakingLoading, setUnstakingLoading] = useState(false);
    const [claimingLoading, setClaimingLoading] = useState(false);
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
    const [contract, setContract] = useState<ethers.Contract | null>(null);
    const [userStakeInfo, setUserStakeInfo] = useState<any>(null);
    const [totalAccruedRewards, setTotalAccruedRewards] = useState<string | null>(null);
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
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [contract, address]);

    const fetchWalletBalance = async () => {
        try {
            const aPolWMATICContract = new ethers.Contract(aPolWMATICAddress, ["function balanceOf(address) view returns (uint256)"], provider?.getSigner());
            const balance = await aPolWMATICContract.balanceOf(address);
            if (balance) {
                const formattedBalance = ethers.utils.formatUnits(balance, 18); // aPolWMATIC tiene 18 decimales
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
                    amountStaked: ethers.utils.formatUnits(stakeInfo.amountStaked, 18), // aPolWMATIC tiene 18 decimales
                    amountLocked: ethers.utils.formatUnits(stakeInfo.amountLocked, 18),
                    lastClaimTime: new Date(stakeInfo.lastClaimTime * 1000).toLocaleString(),
                    gsaRewards: ethers.utils.formatUnits(stakeInfo.gsaRewards, 18), // GSA tiene 18 decimales
                    interestRewards: ethers.utils.formatUnits(stakeInfo.interestRewards, 18), // Intereses acumulados
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
            const aPolWMATICContract = new ethers.Contract(aPolWMATICAddress, [
                "function approve(address spender, uint256 amount) returns (bool)"
            ], provider.getSigner());

            const amount = ethers.utils.parseUnits(amountToStake.toString(), 18); // aPolWMATIC tiene 18 decimales
            const tx = await aPolWMATICContract.approve(contractAddress, amount);
            await tx.wait();
            setSuccessMessage("Approval successful!");
        } catch (error) {
            console.error("Error approving aPolWMATIC:", error);
            setErrorMessage("Error approving aPolWMATIC. Try Again.");
        }
    };

    const handleStake = async () => {
        if (!contract || !address || !provider) return;

        try {
            setStakingLoading(true);

            const aPolWMATICContract = new ethers.Contract(
                aPolWMATICAddress,
                ["function approve(address spender, uint256 amount) returns (bool)", "function allowance(address owner, address spender) view returns (uint256)"],
                provider.getSigner()
            );

            const allowance = await aPolWMATICContract.allowance(address, contractAddress);
            const amountToStakeInWei = ethers.utils.parseUnits(amountToStake.toString(), 18); // aPolWMATIC tiene 18 decimales

            if (allowance.lt(amountToStakeInWei)) {
                const approveTx = await aPolWMATICContract.approve(contractAddress, amountToStakeInWei);
                await approveTx.wait();
                setSuccessMessage("Approval successful! Proceeding to stake...");
            }

            const stakeTx = await contract.stake(amountToStakeInWei);
            await stakeTx.wait();
            setSuccessMessage("Staking successful!");

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
            const withdrawTx = await contract.withdraw(ethers.utils.parseUnits(amount, 18)); // aPolWMATIC tiene 18 decimales
            await withdrawTx.wait();
            fetchStakeInfo();
            fetchRewards();
            setSuccessMessage("Withdrawal successful!");
        } catch (error) {
            console.error("Error withdrawing aPolWMATIC:", error);
            setErrorMessage("Error withdrawing aPolWMATIC. Try Again.");
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
        <section>
            <div style={{ height: "auto", marginBottom: "20px" }} className="blog__item">
                <p style={{ fontSize: "13px", textAlign: "justify" }}>aPolWMATIC is a token that represents POL in the liquid staking at Polygon. When you deposit POL into Aave, you receive aPolWMATIC, which continues to generate rewards without blocking your funds. This allows you to use it in DeFi while earning returns, offering a flexible and liquid form of staking. <a style={{ color: "green" }} href="https://docs.goblinsaga.xyz/defi-staking/apolwmatic-wgsa-staking#how-to-restake-apolwmatic-on-goblin-saga" target="_blank">Tutorial</a></p>
                
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                    <a className="metaportal_fn_buttonLW" href='https://app.aave.com/?marketName=proto_polygon_v3' target='blank' style={{ textDecoration: "none" }}>
                        <p style={{ fontSize: "15px", color: "white" }}>Get aPolWMATIC</p>
                    </a>
                </div>
            </div>
            <div id="aPolWMATIC-Staking">
                <div className="fn_cs_news">
                    <div className="news_part">
                        <div className="left_items">
                            <div className="blog__item">
                                <div className="meta">
                                    <p>Stake aPolWMATIC Earn WGSA</p>
                                </div>
                                <div className="title">
                                    <h3>aPolWMATIC/WGSA Stake</h3>
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
                                        src="/img/aPOL-WGSA.png"
                                        alt="Imagen centrada"
                                        style={{ display: "block", width: "100%" }}
                                    />
                                </div>

                                <div className="qnt" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px" }}>
                                    <span className="decrease" onClick={() => updateQuantity("-")}>-</span>
                                    <span className="summ">{amountToStake}</span>
                                    <span className="increase" onClick={() => updateQuantity("+")}>+</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <span style={{ cursor: "pointer" }} className="setMax" onClick={handleSetMax}>Set Max.</span>
                                </div>
                                <div style={{ marginTop: "50px" }} className="containerGrid">
                                    {errorMessage && <ErrorMessagePopup message={errorMessage} onClose={() => setErrorMessage("")} />}
                                    {successMessage && <SuccessMessagePopup message={successMessage} onClose={() => setSuccessMessage("")} />}
                                    <button className="metaportal_fn_buttonLW" onClick={handleStake} disabled={stakingLoading}>
                                        {stakingLoading ? "Staking..." : "Stake"}
                                    </button>
                                    <button className="metaportal_fn_buttonLW" onClick={() => handleWithdraw(userStakeInfo?.amountStaked)} disabled={unstakingLoading}>
                                        {unstakingLoading ? "Unstaking..." : "Unstake"}
                                    </button>
                                </div>
                                <div>
                                    <p style={{ color: "yellow", textAlign: "center", marginTop: "10px", fontSize: "13px" }}>BEFORE STAKE/UNSTAKE CLAIM YOUR REWARDS FIRST</p>
                                </div>
                                <div style={{ marginTop: "30px", textAlign: "center" }}>
                                    <p>aPolWMATIC blocked: <span style={{ color: "yellow" }}>20%</span> (To $GSA liquidity pool)</p>
                                    <div className="blog__item" style={{ marginTop: "50px" }}>
                                        <p style={{ color: "yellow" }}>$WGSA supply (To claim)</p>
                                        <WGsaTokenBalanceThree />
                                    </div>
                                    <div className="blog__item" style={{ marginTop: "30px", marginBottom: "30px" }}>
                                        <p style={{ color: "yellow" }}>APR: 74.08%</p>
                                        <p>1 aPolWMATIC = 4000 $WGSA/48H</p>
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
                                        <img style={{ width: "90%", marginTop: "-3px" }} src="/img/aPOL.png" alt="aPolWMATIC" />
                                    </span>
                                </div>
                                <div className="meta">
                                    <p>aPolWMATIC Staked</p>
                                </div>
                                <div className="title">
                                    <h3>{userStakeInfo ? parseFloat(userStakeInfo.amountStaked).toFixed(1) : "Loading..."}</h3>
                                    <p style={{ fontSize: "11px" }}><span style={{ color: "yellow" }}>20%</span> of the interest generated will go to GSA LP.</p>
                                </div>
                                <div className="meta">
                                    <p>aPolWMATIC Locked</p>
                                </div>
                                <div className="title">
                                    <h3>{userStakeInfo ? userStakeInfo.amountLocked : "Loading..."}</h3>
                                </div>
                            </div>
                            <div className="blog__item">
                                <div className="counter">
                                    <span className="cc">
                                        <img style={{ marginTop: "-3px" }} src="/img/WGSAV2.png" alt="GSA" />
                                    </span>
                                </div>
                                <div className="meta">
                                    <p>$WGSA Rewards</p>
                                </div>
                                <div className="title">
                                    <h3><SEv5Rewards /></h3>
                                </div>
                                <div className="containerGrid">
                                    <button className="metaportal_fn_buttonLW" onClick={handleClaimRewards} disabled={claimingLoading || totalAccruedRewards === "0"}>
                                        {claimingLoading ? "Claiming..." : "Claim WGSA"}
                                    </button>
                                    <a style={{ textDecoration: "none" }} href='https://docs.goblinsaga.xyz/defi-staking/apolwmatic-wgsa-staking' target='blank'>
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

export default SEHeaderFive;
