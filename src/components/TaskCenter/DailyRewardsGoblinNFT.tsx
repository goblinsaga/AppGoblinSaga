import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import DailyRewardsABI from "../../../contracts/DailyRewardsABI.json";
import ErrorMessagePopup from '../popups/ErrorMessagePopup';
import SuccessMessagePopup from '../popups/SuccessMessagePopup';
import { lightTheme, Web3Button } from '@thirdweb-dev/react';

declare global {
    interface Window {
        ethereum?: any;
    }
}

const contractAddress = '0xe18cf2c54c64d76237b06c7b4081f74eda672960';

const ClaimRewardsNFTClaim = () => {
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [contract, setContract] = useState<ethers.Contract | null>(null);
    const [claimableAmount, setClaimableAmount] = useState<number | null>(null);
    const [isClaiming, setIsClaiming] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [address, setAddress] = useState<string | null>(null);
    const [mintSuccess, setMintSuccess] = useState(false);
    const [isMetaMaskMobile, setIsMetaMaskMobile] = useState(false);
    const [quantity, setQuantity] = useState(1);

    // Nuevos estados para lastClaimed, weeklyStreak, lastClaimedDay
    const [lastClaimed, setLastClaimed] = useState<number | null>(null);
    const [weeklyStreak, setWeeklyStreak] = useState<number | null>(null);
    const [lastClaimedDay, setLastClaimedDay] = useState<number | null>(null);
    const [nextClaimTime, setNextClaimTime] = useState<string | null>(null);

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage('');
            }, 4000); // Cierra el mensaje de error después de 4 segundos

            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 4000); // Cierra el mensaje de éxito después de 4 segundos

            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    useEffect(() => {
        const init = async () => {
            try {
                if (window.ethereum) {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();

                    const userAddress = await signer.getAddress().catch(() => {
                        throw new Error(' ');
                    });

                    const contract = new ethers.Contract(contractAddress, DailyRewardsABI, signer);

                    setProvider(provider);
                    setSigner(signer);
                    setContract(contract);
                    setAddress(userAddress);

                    const userInfo = await contract.userInfo(userAddress);

                    setLastClaimed(userInfo.lastClaimed.toNumber());
                    setWeeklyStreak(userInfo.weeklyStreak.toNumber());
                    const now = Math.floor(Date.now() / 1000);
                    const daysSinceLastClaim = Math.floor((now - userInfo.lastClaimed) / (12 * 60 * 60));
                    let reward: number | null = null;

                    if (daysSinceLastClaim >= 1) {
                        reward = userInfo.weeklyStreak === 6 ? 4000 : 2500;
                    }

                    setClaimableAmount(reward);

                    const userAgent = navigator.userAgent;
                    if (/android/i.test(userAgent) && window.ethereum.isMetaMask) {
                        setIsMetaMaskMobile(true);
                    } else if (/iPhone|iPad|iPod/i.test(userAgent) && window.ethereum.isMetaMask) {
                        setIsMetaMaskMobile(true);
                    }

                    const nextClaimTimestamp = userInfo.lastClaimed.toNumber() + 12 * 60 * 60;
                    updateCountdown(nextClaimTimestamp);
                } else {
                    setErrorMessage('Please install MetaMask!');
                }
            } catch (err: any) {
                console.error(err);
                setErrorMessage(err.message || 'Error connecting to wallet');
            }
        };

        const updateCountdown = (nextClaimTimestamp: number) => {
            const interval = setInterval(() => {
                const now = Math.floor(Date.now() / 1000);
                const secondsLeft = nextClaimTimestamp - now;

                if (secondsLeft > 0) {
                    const hours = Math.floor(secondsLeft / 3600);
                    const minutes = Math.floor((secondsLeft % 3600) / 60);
                    setNextClaimTime(`${hours}h ${minutes}m`);
                } else {
                    setNextClaimTime('Available!');
                    clearInterval(interval);
                }
            }, 1000);

            return () => clearInterval(interval);
        };

        init();
    }, []);

    const handleMintSuccess = () => {
        setMintSuccess(true); // Cambiar el estado a exitoso después de hacer el mint
    };

    const handleClaim = async () => {
        if (!contract || !address) return;

        setIsClaiming(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            // Ejecutar la función claimRewards
            const tx = await contract.claimRewards();
            await tx.wait();

            // Obtener nueva información del usuario
            const userInfo = await contract.userInfo(address);
            setWeeklyStreak(userInfo.weeklyStreak.toNumber());
            setLastClaimed(userInfo.lastClaimed.toNumber());

            // Calcular el tiempo hasta el próximo reclamo
            const now = Math.floor(Date.now() / 1000);
            const nextClaimTimestamp = now + 12 * 60 * 60;
            updateCountdown(nextClaimTimestamp);

            // Actualizar recompensa reclamada
            setClaimableAmount(null);

            // Mensaje de éxito
            setSuccessMessage('Rewards claimed successfully!');
        } catch (err: any) {
            console.error('Error claiming rewards:', err);
            setSuccessMessage('Next Claim in 12 Hours.');
        } finally {
            setIsClaiming(false);
        }
    };

    return (
        <section id="news">
            <div
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    textAlign: 'center',
                }}
                className='container'
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px', // Espaciado entre los elementos
                        marginTop: "-10px"
                    }}
                >
                    <>
                        {!mintSuccess ? (
                            <div style={{ position: "relative", width: "150px", height: "45px", marginRight: "-10px" }}>
                                <Web3Button
                                    connectWallet={{
                                        welcomeScreen: {
                                            title: "The Definitive NFT Mining App",
                                            subtitle: "Conquer the DeFi world through NFTs, mining, and rewards in an innovative universe on Polygon 💎",
                                            img: {
                                                src: "/img/LogoGS.png",
                                                width: 320,
                                            },
                                        },
                                        btnTitle: "Go",
                                        modalTitle: "Goblin Saga",
                                        modalSize: "compact",
                                        modalTitleIconUrl: "/img/favicon.ico",
                                        showThirdwebBranding: false,
                                        termsOfServiceUrl: "https://goblinsaga.xyz/terms-conditions",
                                        privacyPolicyUrl: "https://goblinsaga.xyz/policy",
                                    }}
                                    theme={lightTheme({
                                        colors: {
                                            modalBg: "#150024",
                                            borderColor: "#150024",
                                            separatorLine: "#150024",
                                            secondaryText: "#c4c4c4",
                                            primaryText: "#ffffff",
                                            connectedButtonBg: "transparent",
                                            primaryButtonBg: "transparent",
                                            primaryButtonText: "#ffffff",
                                            secondaryButtonHoverBg: "#000b42",
                                            connectedButtonBgHover: "transparent",
                                            walletSelectorButtonHoverBg: "#000b42",
                                            secondaryButtonText: "#ffffff",
                                            secondaryButtonBg: "#000b42",
                                        },
                                    })}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        pointerEvents: "auto",
                                        backgroundColor: "transparent",
                                        borderRadius: "5px",
                                        border: "3px solid yellow",
                                    }}
                                    contractAddress="0x4Ac03107603F37AD24a36c32bEC98b22AF46ABbf"
                                    action={async (contract) => {
                                        await contract.erc721.claim(1);
                                    }}
                                    onError={(error) => {
                                        const errorMessage = error?.message || "Unknown error";

                                        if (
                                            errorMessage.includes("missing revert data") ||
                                            errorMessage.includes("missing revert data")
                                        ) {
                                            setErrorMessage(
                                                `Minting failed: Insufficient funds. Mint price 11.0 POL.`
                                            );
                                        } else {
                                            setErrorMessage(`Minting failed: ${errorMessage}`);
                                        }
                                    }}
                                    onSuccess={() => {
                                        setSuccessMessage(`Successfully minted ${quantity} NFT(s)!`);
                                        handleMintSuccess();
                                    }}
                                >
                                    Go
                                </Web3Button>
                                <div>
                                    <p style={{ right: "110px", position: "relative", marginTop: "-40px", fontSize: "11px" }}>
                                        Streaks
                                    </p>
                                    <p style={{ right: "110px", position: "relative", marginTop: "-20px", fontSize: "11px" }}>
                                        ({weeklyStreak !== null ? weeklyStreak : 'Loading...'})
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div style={{ position: "relative", width: "150px", height: "45px", marginRight: "-10px" }}>
                                <button
                                    className="metaportal_fn_buttonLW"
                                    style={{
                                        cursor: 'pointer',
                                        width: '100%',
                                        display: 'block',
                                        textAlign: 'center',
                                    }}
                                    onClick={handleClaim}
                                    disabled={isClaiming || claimableAmount === null}
                                >
                                    {isClaiming ? 'Claiming...' : 'Claim'}
                                </button>
                                <div>
                                    <p style={{ right: "110px", position: "relative", marginTop: "-40px", fontSize: "11px" }}>
                                        Streaks
                                    </p>
                                    <p style={{ right: "110px", position: "relative", marginTop: "-20px", fontSize: "11px" }}>
                                        ({weeklyStreak !== null ? weeklyStreak : 'Loading...'})
                                    </p>
                                </div>
                            </div>
                        )}
                        {successMessage && <SuccessMessagePopup message={successMessage} onClose={() => setSuccessMessage('')} />}
                        {errorMessage && <ErrorMessagePopup message={errorMessage} onClose={() => setErrorMessage('')} />}
                    </>
                    <div
                        style={{
                            marginTop: "-5px",
                            fontSize: "14px",
                            textAlign: "center",
                            minHeight: "20px", // Altura mínima fija
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <p style={{ margin: 0, padding: 0, whiteSpace: "nowrap" }}>
                            Claim In: {nextClaimTime || 'Loading...'}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ClaimRewardsNFTClaim;
function updateCountdown(nextClaimTimestamp: number) {
    throw new Error('Function not implemented.');
}