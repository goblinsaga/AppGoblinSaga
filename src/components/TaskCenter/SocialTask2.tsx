import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAddress } from '@thirdweb-dev/react';
import ErrorMessagePopup from '../popups/ErrorMessagePopup';
import SuccessMessagePopup from '../popups/SuccessMessagePopup';

// ABI mínimo para el token ERC20
const IERC20ABI = [
    {
        "constant": true,
        "inputs": [{ "name": "account", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "", "type": "uint256" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

// ABI del contrato DailyRewards
const DailyRewardsABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_gsaTokenAddress",
                "type": "address"
            }
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
        "inputs": [
            {
                "internalType": "address",
                "name": "userAddress",
                "type": "address"
            }
        ],
        "name": "canClaim",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "depositRewards",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "userAddress",
                "type": "address"
            }
        ],
        "name": "timeUntilNextClaim",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "withdrawRewards",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "DAILY_REWARD",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "WEEKLY_BONUS",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "CLAIM_INTERVAL",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "STREAK_DAYS",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalDepositedRewards",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "gsaToken",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "userInfo",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "lastClaimed",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "streakCount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "lastStreakUpdate",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// Configuración
const contractAddress = '0xCC90fAe29cEe4742efEcEEcf611718BBAf70Da43';
const DAILY_REWARD = ethers.utils.parseEther('2500');
const WEEKLY_BONUS = ethers.utils.parseEther('3500');
const CLAIM_INTERVAL = 6 * 60 * 60; // 6 horas en segundos

interface UserInfo {
    lastClaimed: ethers.BigNumber;
    streakCount: ethers.BigNumber;
    lastStreakUpdate: ethers.BigNumber;
}

const GSAdr2 = () => {
    const address = useAddress();
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
    const [contract, setContract] = useState<ethers.Contract | null>(null);
    const [isClaiming, setIsClaiming] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [hasTweeted, setHasTweeted] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [countdownInterval, setCountdownInterval] = useState<NodeJS.Timeout | null>(null);

    // User data
    const [lastClaimed, setLastClaimed] = useState<number>(0);
    const [nextClaimTime, setNextClaimTime] = useState<string>('Loading...');
    const [streakCount, setStreakCount] = useState<number>(0);
    const [canClaim, setCanClaim] = useState<boolean>(false);
    const [rewardAmount, setRewardAmount] = useState<string>('0');

    // Initialize provider and contract
    useEffect(() => {
        if (!address) return;

        const init = async () => {
            try {
                const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = web3Provider.getSigner();
                const rewardsContract = new ethers.Contract(contractAddress, DailyRewardsABI, signer);

                setProvider(web3Provider);
                setContract(rewardsContract);

                await loadUserData(rewardsContract, address);
            } catch (err) {
                console.error('Initialization error:', err);
                setErrorMessage('Error connecting to wallet');
            }
        };

        init();
    }, [address]);

    // Load user data
    const loadUserData = async (contract: ethers.Contract, userAddress: string) => {
        try {
            const [userInfo, canClaimNow, timeLeft] = await Promise.all([
                contract.userInfo(userAddress),
                contract.canClaim(userAddress),
                contract.timeUntilNextClaim(userAddress)
            ]);

            setLastClaimed(userInfo.lastClaimed.toNumber());
            setStreakCount(userInfo.streakCount.toNumber());
            setCanClaim(canClaimNow);

            const reward = userInfo.streakCount.toNumber() >= 6 ?
                ethers.utils.formatEther(WEEKLY_BONUS) :
                ethers.utils.formatEther(DAILY_REWARD);
            setRewardAmount(reward);

            updateCountdown(userInfo.lastClaimed.toNumber(), timeLeft.toNumber());
        } catch (err) {
            console.error('Error loading user data:', err);
            setErrorMessage('Error loading contract data');
        }
    };

    // Countdown timer
    const updateCountdown = (lastClaimedTimestamp: number, initialTimeLeft?: number) => {
        // Limpiar intervalo previo si existe
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }

        const now = Math.floor(Date.now() / 1000);
        let timeLeft = initialTimeLeft ?? Math.max(0, (lastClaimedTimestamp + CLAIM_INTERVAL) - now);

        // Actualización inmediata
        const updateDisplay = () => {
            const hours = Math.floor(timeLeft / 3600);
            const minutes = Math.floor((timeLeft % 3600) / 60);
            setNextClaimTime(`${hours}h ${minutes}m`);
        };

        updateDisplay(); // Mostrar el valor inicial inmediatamente

        const newInterval = setInterval(() => {
            timeLeft -= 1;

            if (timeLeft > 0) {
                updateDisplay();
                setCanClaim(false);
            } else {
                setNextClaimTime('Available!');
                setCanClaim(true);
                if (countdownInterval) {
                    clearInterval(countdownInterval);
                }
            }
        }, 1000);

        setCountdownInterval(newInterval);
    };

    useEffect(() => {
        return () => {
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
        };
    }, [countdownInterval]);

    // Claim rewards
    const handleClaim = async () => {
        if (!contract || !canClaim || !address) return;

        setIsClaiming(true);
        setErrorMessage('');

        try {
            const tx = await contract.claimRewards();
            await tx.wait();

            // Refresh user data
            await loadUserData(contract, address);
            setSuccessMessage(`Success! ${rewardAmount} tokens claimed!`);
        } catch (err) {
            console.error('Error claiming rewards:', err);
            setErrorMessage('Error claiming rewards');
        } finally {
            setIsClaiming(false);
        }
    };

    // Twitter verification
    const handleTweet = () => {
        const tweetText = encodeURIComponent(
            "I have just staked some Goblins on @goblinsaga_xyz Mining App what are you waiting for? LFG!. #NFT $POL #Crypto https://x.com/goblinsaga_xyz/status/1912592409650950643"
        );
        const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
        window.open(tweetUrl, "_blank");

        setIsVerifying(true);
        let countdown = 30;

        const countdownInterval = setInterval(() => {
            countdown -= 1;
            setSuccessMessage(`Complete verification within ${countdown} seconds`);

            if (countdown <= 0) {
                clearInterval(countdownInterval);
                setHasTweeted(true);
                setIsVerifying(false);
                setSuccessMessage('Verification complete!');
            }
        }, 1000);
    };

    if (!address) {
        return (
            <div className="container">
                <p>Connect Your Wallet</p>
            </div>
        );
    }

    return (
        <section id="news">
            <div className='container' style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                textAlign: 'center',
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    marginTop: "-10px"
                }}>
                    {!hasTweeted ? (
                        <div style={{ position: "relative", width: "150px", height: "45px", marginRight: "-10px" }}>
                            <button
                                className="metaportal_fn_buttonLW"
                                style={{
                                    cursor: 'pointer',
                                    width: '100%',
                                    display: 'block',
                                    textAlign: 'center',
                                }}
                                onClick={handleTweet}
                                disabled={isVerifying}
                            >
                                {isVerifying ? 'VERIFYING...' : 'Go'}
                            </button>
                            <div>
                                <p style={{ right: "110px", position: "relative", marginTop: "-40px", fontSize: "11px" }}>
                                    Streaks
                                </p>
                                <p style={{ right: "110px", position: "relative", marginTop: "-20px", fontSize: "11px" }}>
                                    ({streakCount})
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div style={{ position: "relative", width: "150px", height: "45px", marginRight: "-10px" }}>
                            <button
                                className="metaportal_fn_buttonLW"
                                style={{
                                    cursor: canClaim ? 'pointer' : 'not-allowed',
                                    width: '100%',
                                    display: 'block',
                                    textAlign: 'center',
                                    opacity: canClaim ? 1 : 0.7
                                }}
                                onClick={handleClaim}
                                disabled={isClaiming || !canClaim}
                            >
                                {isClaiming ? 'Claiming...' : `Claim ${rewardAmount}`}
                            </button>
                            <div>
                                <p style={{ right: "110px", position: "relative", marginTop: "-40px", fontSize: "11px" }}>
                                    Streaks
                                </p>
                                <p style={{ right: "110px", position: "relative", marginTop: "-20px", fontSize: "11px" }}>
                                    ({streakCount})
                                </p>
                            </div>
                        </div>
                    )}

                    <div style={{
                        marginTop: "-5px",
                        fontSize: "14px",
                        textAlign: "center",
                        minHeight: "20px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <p style={{ margin: 0, padding: 0, whiteSpace: "nowrap" }}>
                            Claim In: {nextClaimTime}
                        </p>
                    </div>

                    {successMessage && (
                        <SuccessMessagePopup
                            message={successMessage}
                            onClose={() => setSuccessMessage('')}
                        />
                    )}
                    {errorMessage && (
                        <ErrorMessagePopup
                            message={errorMessage}
                            onClose={() => setErrorMessage('')}
                        />
                    )}
                </div>
            </div>
        </section>
    );
};

export default GSAdr2;
