import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import StakeZeusNFT from './OptionButtons/StakeZeus';
import ZeusClaim from './OptionButtons/ClaimZeus';
import ZeusRewards from './UserStats/ZeusRewards';
import ErrorMessagePopup from "./popups/ErrorMessagePopup";
import SuccessMessagePopup from "./popups/SuccessMessagePopup";
import ZeusMiningCount from './ZeusOwned';

// ABI del contrato HelpZeus
const HELP_ZEUS_ABI = [
    "function donate() payable",
    "function totalDonations() view returns (uint256)",
    "function getAvailableNFTs() view returns (uint256)",
    "function getMinDonation() pure returns (uint256)",
    "function getContractBalance() view returns (uint256)",
    "event DonationReceived(address indexed donor, uint256 amount)",
    "event TokenTransferred(address indexed to, uint256 amount)"
];

const ZeusDonationApp: React.FC = () => {
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [contract, setContract] = useState<ethers.Contract | null>(null);
    const [account, setAccount] = useState<string | null>(null);
    const [donationAmount, setDonationAmount] = useState<string>("10");
    const [totalDonations, setTotalDonations] = useState<string>("0");
    const [availableNFTs, setAvailableNFTs] = useState<number>(0);
    const [minDonation, setMinDonation] = useState<string>("10");
    const [contractBalance, setContractBalance] = useState<string>("0");
    const [txStatus, setTxStatus] = useState<string>("");
    const [nftReceived, setNftReceived] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Configuración inicial (ajusta estas direcciones)
    const HELP_ZEUS_ADDRESS = "0x5a0342893371719dfb3774bDf68C1b55ccD7cF4f"; // Dirección de tu contrato HelpZeus
    const NFT_CONTRACT_ADDRESS = "0x988de71c594FB4d396F6D3bEB4c05075cF05ad12"; // Dirección del contrato ERC1155

    const [width, setWidth] = useState("100%");

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setWidth("100%");
            } else {
                setWidth("100%");
            }
        };

        handleResize(); // Establecer valor inicial
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const loadReadOnlyData = async () => {
            const readOnlyProvider = new ethers.providers.JsonRpcProvider("https://polygon-mainnet.g.alchemy.com/v2/5PDJn3VDxRSiTXjdbz-dfVaZ6GuoVQ8c");
            const zeusContract = new ethers.Contract(HELP_ZEUS_ADDRESS, HELP_ZEUS_ABI, readOnlyProvider);
            await loadContractData(zeusContract);
        };
        loadReadOnlyData();
    }, []);

    // Conectar wallet
    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const web3Signer = web3Provider.getSigner();
                const userAddress = await web3Signer.getAddress();

                const zeusContract = new ethers.Contract(
                    HELP_ZEUS_ADDRESS,
                    HELP_ZEUS_ABI,
                    web3Signer
                );

                setProvider(web3Provider);
                setSigner(web3Signer);
                setContract(zeusContract);
                setAccount(userAddress);

                // Cargar datos iniciales
                loadContractData(zeusContract);
            } catch (error) {
                console.error("Error connecting wallet:", error);
                setErrorMessage("Error connecting wallet");
            }
        } else {
            setErrorMessage("Please install MetaMask!");
        }
    };

    // Cargar datos del contrato
    const loadContractData = async (contractInstance: ethers.Contract) => {
        try {
            const total = await contractInstance.totalDonations();
            const available = await contractInstance.getAvailableNFTs();
            const minDon = await contractInstance.getMinDonation();
            const balance = await contractInstance.getContractBalance();

            setTotalDonations(ethers.utils.formatEther(total));
            setAvailableNFTs(available.toNumber());
            setMinDonation(ethers.utils.formatEther(minDon));
            setContractBalance(ethers.utils.formatEther(balance));
        } catch (error) {
            console.error("Error loading contract data:", error);
        }
    };

    // Realizar donación
    const makeDonation = async () => {
        if (!contract || !donationAmount) return;

        try {
            setTxStatus("Processing donation...");
            const amountInWei = ethers.utils.parseEther(donationAmount);

            const tx = await contract.donate({
                value: amountInWei
            });

            setSuccessMessage("Transaction sent, waiting for confirmation...");
            await tx.wait();

            setSuccessMessage("Donation successful! Check your wallet for the NFT.");
            setNftReceived(true);

            // Actualizar datos
            if (contract) {
                await loadContractData(contract);
            }
        } catch (error: any) {
            console.error("Donation error:", error);
            setErrorMessage(`Error: ${error.message}`);
        }
    };

    // Escuchar eventos de transferencia de NFT
    useEffect(() => {
        if (!contract || !account) return;

        const onTokenTransferred = (to: string) => {
            if (to.toLowerCase() === account?.toLowerCase()) {
                setNftReceived(true);
            }
        };

        contract.on("TokenTransferred", onTokenTransferred);

        return () => {
            contract.off("TokenTransferred", onTokenTransferred);
        };
    }, [contract, account]);

    return (
        <section id='news'>
            <div className="container">
                <h3
                    className="fn__maintitle big"
                    data-align="center"
                >
                    Help Zeus<img src="/img/zeus.png" alt="$GSA" style={{ width: "50px", height: "50px", marginTop: "-10px" }} />
                </h3>
                <div style={{ marginTop: "-100px" }} className="blog__item">
                    {!account ? (
                        <div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "10px",
                                    flexWrap: "wrap", // Para asegurar que los elementos se ajusten bien en pantalla pequeña.
                                }}
                            >
                                <div
                                    style={{
                                        width: "50px",
                                        height: "150px",
                                        flex: "1 1 auto",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        transition: "transform 0.3s ease-in-out",
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                                    onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                                >
                                    <img
                                        src="/img/ZeusWBG.png"
                                        alt="Zeus"
                                        style={{
                                            height: "100%",
                                            objectFit: "cover",
                                            borderRadius: "10px",
                                            border: "1px solid #666666",
                                            boxShadow: "0 0 12px 4px hsla(300, 100.00%, 25.10%, 0.70)",
                                        }}
                                    />
                                </div>

                                <div
                                    style={{
                                        width: "300px",
                                        height: "100px",
                                        flex: "1 1 auto", // Permite que los elementos se adapten.
                                    }}
                                    className="blog__item"
                                >
                                    <div style={{ marginTop: "-20px" }}>
                                        <p style={{ textAlign: "center" }}>Minimum donation</p>
                                        <p style={{ textAlign: "center", marginTop: "-10px" }}>{minDonation} POL</p>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        width: "300px",
                                        height: "100px",
                                        flex: "1 1 auto", // Permite que los elementos se adapten.
                                    }}
                                    className="blog__item"
                                >
                                    <div style={{ marginTop: "-20px" }}>
                                        <p style={{ textAlign: "center" }}>Total Donated</p>
                                        <p style={{ textAlign: "center", marginTop: "-10px" }}>{contractBalance} POL</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p style={{ marginTop: "10px" }}>🐾 Hi, I'm Zeus 🐾</p>
                                <p style={{ textAlign: "justify", fontSize: "14px" }}>I'm 2 years old and an emotional support dog. I've always been there to bring love and comfort, but now I need help. I’ve fallen ill and suffer from seizures… My treatment is expensive, but with your support, I can get better and keep helping others.</p>
                                <p style={{ textAlign: "justify", fontSize: "14px" }}>🙏 Please help me heal. Your donation can change my life.</p>
                                <p style={{ textAlign: "justify", fontSize: "14px" }}>With Love, Zeus 💙</p>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                                <h2 style={{ textAlign: 'center' }}>Make a Donation</h2>
                            </div>
                            <p style={{ textAlign: 'center', fontSize: "11px", marginTop: "-15px" }}>You can make any number of donations, 1 by 1 to get more NFTs from Help Zeus.</p>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <button className="metaportal_fn_buttonLW" onClick={connectWallet}>
                                    Connect Wallet
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div>
                                <p style={{ textAlign: "center" }}>Wallet: {account.slice(0, 6)}...{account.slice(-4)}</p>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "10px",
                                    flexWrap: "wrap", // Para asegurar que los elementos se ajusten bien en pantalla pequeña.
                                }}
                            >
                                <div
                                    style={{
                                        width: "50px",
                                        height: "150px",
                                        flex: "1 1 auto",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        transition: "transform 0.3s ease-in-out",
                                    }}
                                >
                                    <img
                                        src="/img/ZeusWBG.png"
                                        alt="Zeus"
                                        style={{
                                            height: "100%",
                                            objectFit: "cover",
                                            borderRadius: "10px",
                                            border: "1px solid #666666",
                                            boxShadow: "0 0 12px 4px rgba(128, 0, 128, 0.7)",
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                                        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                                    />
                                </div>

                                <div
                                    style={{
                                        width: "300px",
                                        height: "100px",
                                        flex: "1 1 auto", // Permite que los elementos se adapten.
                                    }}
                                    className="blog__item"
                                >
                                    <div style={{ marginTop: "-20px" }}>
                                        <p style={{ textAlign: "center" }}>Minimum donation</p>
                                        <p style={{ textAlign: "center", marginTop: "-10px" }}>{minDonation} POL</p>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        width: "300px",
                                        height: "100px",
                                        flex: "1 1 auto", // Permite que los elementos se adapten.
                                    }}
                                    className="blog__item"
                                >
                                    <div style={{ marginTop: "-20px" }}>
                                        <p style={{ textAlign: "center" }}>Total Donated</p>
                                        <p style={{ textAlign: "center", marginTop: "-10px" }}>{contractBalance} POL</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p style={{ marginTop: "10px" }}>🐾 Hi, I'm Zeus 🐾</p>
                                <p style={{ textAlign: "justify", fontSize: "14px" }}>I'm 2 years old and an emotional support dog. I've always been there to bring love and comfort, but now I need help. I’ve fallen ill and suffer from seizures… My treatment is expensive, but with your support, I can get better and keep helping others.</p>
                                <p style={{ textAlign: "justify", fontSize: "14px" }}>🙏 Please help me heal. Your donation can change my life.</p>
                                <p style={{ textAlign: "justify", fontSize: "14px" }}>With Love, Zeus 💙</p>
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                                    <h2 style={{ textAlign: 'center' }}>Make a Donation</h2>
                                </div>
                                <p style={{ textAlign: 'center', fontSize: "11px", marginTop: "-15px" }}>You can make any number of donations, 1 by 1 to get more NFTs from Help Zeus.</p>
                                <div>
                                    <p style={{ textAlign: "center" }}>Available NFTs: {availableNFTs}</p>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <input
                                        type="number"
                                        value={donationAmount}
                                        onChange={(e) => setDonationAmount(e.target.value)}
                                        min={minDonation}
                                        step="0.1"
                                        placeholder={`Min. ${minDonation} POL`}
                                        style={{
                                            backgroundColor: 'transparent',
                                            borderRadius: '5px',
                                            border: '1px solid grey',
                                            padding: '10px',
                                            color: '#fff',
                                            fontSize: '16px',
                                            outline: 'none',
                                            textAlign: 'center',
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                                    <button
                                        className="metaportal_fn_buttonLW"
                                        onClick={makeDonation}
                                        disabled={
                                            !donationAmount ||
                                            parseFloat(donationAmount) < parseFloat(minDonation) ||
                                            availableNFTs <= 0
                                        }
                                    >
                                        Donate
                                    </button>
                                </div>

                                {nftReceived && (
                                    <div className="nft-received">
                                        <p style={{ textAlign: "center", marginTop: "10px" }}>🎉 You have received an NFT in appreciation!</p>
                                    </div>
                                )}

                                {txStatus && <p className="status">{txStatus}</p>}
                                {successMessage && <SuccessMessagePopup message={successMessage} onClose={() => setSuccessMessage('')} />}
                                {errorMessage && <ErrorMessagePopup message={errorMessage} onClose={() => setErrorMessage('')} />}
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '45px' }}>
                        <h3 style={{ textAlign: 'center' }}>United for Zeus: A Cause That Speaks to Our Hearts</h3>
                    </div>
                    <div>
                        <p style={{ textAlign: "justify", fontSize: "14px" }}>At Goblin Saga and Evil Kongs, we’ve always believed in the power of community to do good. We’ve stood together in difficult times—supporting those affected by natural disasters like Hurricane Otis and contributing to dog shelters that offer hope to the voiceless. Today, a new call for compassion has arrived: helping Zeus, a noble four-legged friend who needs us all.</p>
                        <p style={{ textAlign: "justify", fontSize: "14px" }}>This time, alongside your donation, we want to express our heartfelt gratitude. Everyone who contributes will receive an ERC1155 NFT as a symbol of their support. This NFT can be staked and will generate <span style={{ color: "yellow" }}>2,500 $GSA every 24 hours</span>, a small gesture of appreciation for your kindness.</p>
                        <p style={{ textAlign: "justify", fontSize: "14px" }}>This isn’t just another campaign. It’s a testament to the love and empathy that bring our community together. Because when one of our own needs a helping paw, we’re all in.</p>
                        <p style={{ textAlign: "justify", fontSize: "14px" }}>Thank you for being part of this. Thank you for helping Zeus.</p>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '45px' }}>
                    <h3 style={{ textAlign: 'center' }}>Help & Earn</h3>
                </div>
                <div className="fn_cs_news">
                    <div className="news_part">
                        <div className="left_items">
                            <div className="blog__item">
                                <div className="image">
                                    <img style={{ marginTop: "10px" }} src="/img/ZeusNFTGenesis.png" alt="Zeus NFT" />
                                </div>
                                <p style={{ textAlign: "center", color: "yellow" }}>2,500 $GSA EVERY 24H</p>
                            </div>
                        </div>

                        <div className="right_items">
                            <div style={{ height: "200px" }} className="blog__item">
                                <div style={{ marginTop: "-15px" }} className="meta">
                                    <p>Total Rewards</p>
                                </div>
                                <div className="title">
                                    <h5><ZeusRewards /></h5>
                                </div>
                                <div className="meta">
                                    <p>Help Zeus Owned</p>
                                </div>
                                <div className="title">
                                    <h5><ZeusMiningCount /></h5>
                                </div>
                            </div>
                            <div style={{ height: "200px" }} className="blog__item">
                                <div className="meta">
                                    <p>Mine & Claim</p>
                                </div>

                                <div style={{ marginTop: "20px" }} className="containerGrid">
                                    <StakeZeusNFT />
                                    <ZeusClaim />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '45px' }}>
                        <h3 style={{ textAlign: 'center' }}>Zeus’ Story: An Unbreakable Bond</h3>
                    </div>
                    <div>
                        <p style={{ textAlign: "justify", fontSize: "14px" }}>In a country where the sale of animals like dogs and cats is prohibited, there are countless shelters dedicated to rescuing and giving second chances to those who have been victims of abuse or abandonment. It was in this setting that the story of Zeus began — a puppy who, at just three months old, was rescued from an illegal pet shop.</p>
                        <p style={{ textAlign: "justify", fontSize: "14px" }}>When authorities found him, Zeus was in terrible condition: weak, malnourished, and confined to a tiny cage where he could only lie down. Yet, despite all the suffering, something in him still shone — a spark of life, joy, and hope.</p>
                        <p style={{ textAlign: "justify", fontSize: "14px" }}>He was taken into state custody and later brought to an animal shelter. It was there that he met someone who would change his life forever. The moment this person saw Zeus, he was deeply moved. Even in such a fragile state, Zeus was playful and mischievous, as if he refused to stop being a happy puppy. That small show of joy was enough to capture the heart of his future human companion, who didn’t hesitate to adopt him.</p>
                        <p style={{ textAlign: "justify", fontSize: "14px" }}>Over time, Zeus not only found a home — he became his human’s greatest emotional support. His companion, who battles anxiety and depression after going through difficult moments alone, found in Zeus a reason to smile, a reason to keep going.</p>
                        <p style={{ textAlign: "justify", fontSize: "14px" }}>Together, they built a new life filled with love, long walks, playtime, and a deep understanding of each other. But one day, during a walk, an accident caused by public transportation changed everything. Zeus suffered a spinal injury that affected a major nerve, leading to sudden seizures.</p>
                        <p style={{ textAlign: "justify", fontSize: "14px" }}>Today, his human depends on Zeus just as much as Zeus relies on him. Their bond is strong, real, and now they face a new challenge — Zeus’s recovery.</p>
                        <p style={{ textAlign: "justify", fontSize: "14px" }}>Zeus urgently needs specialized medical care from a neurologic veterinary expert who can provide the treatment he deserves. His story is a powerful reminder of the unconditional love animals give and our responsibility to protect them.</p>
                        <p style={{ textAlign: "justify", fontSize: "14px" }}>With your help, we can give Zeus the chance to run again, to play, and to continue being the emotional anchor of the one who saved him and gave him a new life. Let’s help them move forward — because when one heals, the other heals too.</p>
                    </div>
                    <div>
                        <img
                            src="/img/ZeusNFT.png"
                            style={{
                                width: "20%",
                                borderRadius: "10px",
                                display: "block",
                                margin: "0 auto"
                            }}
                        />
                        <p style={{ textAlign: "center", marginTop: "5px" }}>Zeus Love 💙</p>
                    </div>
                    <div className='blog__item'>
                        <p style={{ textAlign: "justify", fontSize: "14px" }}>If you’d like to help Zeus even more, you can also make donations using different cryptocurrencies. These contributions will be delivered directly to his human companion, with verified proof of receipt.</p>
                        <p style={{ textAlign: "center", fontSize: "14px", color: "yellow" }}>0x5a0342893371719dfb3774bdf68c1b55ccd7cf4f</p>
                        <p style={{ textAlign: "justify", fontSize: "14px" }}>You can send additional crypto donations to the dedicated smart contract created specifically to collect and manage these contributions transparently and securely.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ZeusDonationApp;
