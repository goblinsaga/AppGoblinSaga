import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ErrorMessagePopup from './popups/ErrorMessagePopup';
import SuccessMessagePopup from './popups/SuccessMessagePopup';
import PolygonGasPrice from "./PolygonGasPrice";

const GSA_TOKEN_OLD_ADDRESS = "0x6f5c47c85E55ef4E0d17c4d221C79d0e7a0A4650"; // Dirección del token antiguo
const GSA_TOKEN_NEW_ADDRESS = "0xC3882D10e49Ac4E9888D0C594DB723fC9cE95468"; // Dirección del token nuevo
const TOKEN_MIGRATION_CONTRACT_ADDRESS = "0xeb4c7405490249d75e8232fa03d3387a2b38c3a2"; // Dirección del nuevo contrato

const TOKEN_MIGRATION_ABI = [
    "function swapOldtoNew(uint256 gsaAmount) external",
    "function swapNewtoOld(uint256 xgsaAmount) external",
    "function currentRate() external view returns (uint256)",
];

const GSA_OLD_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
];

const GSA_NEW_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
];

const TokenSwapWGSA = () => {
    const [newTokenAmount, setNewTokenAmount] = useState(1);
    const [oldTokenAmount, setOldTokenAmount] = useState(1);
    const [rate, setRate] = useState(0);
    const [isApproved, setIsApproved] = useState(false);
    const [oldTokenBalance, setOldTokenBalance] = useState(0);
    const [newTokenBalance, setNewTokenBalance] = useState(0);
    const [isOldTokenLoading, setIsOldTokenLoading] = useState(true);
    const [isNewTokenLoading, setIsNewTokenLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOldToNew, setIsOldToNew] = useState(true); // Inicialmente, el swap es de oldToken a newToken
    const [loadingNewToken, setLoadingNewToken] = useState(true);
    const [loadingOldToken, setLoadingOldToken] = useState(true);

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const fetchRateAndBalance = async () => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const migrationContract = new ethers.Contract(TOKEN_MIGRATION_CONTRACT_ADDRESS, TOKEN_MIGRATION_ABI, signer);
            const currentRate = await migrationContract.currentRate();
            setRate(currentRate);

            try {
                // Cargando balance del token antiguo
                setLoadingOldToken(true);
                const oldToken = new ethers.Contract(GSA_TOKEN_OLD_ADDRESS, GSA_OLD_ABI, signer);
                const oldTokenBalance = await oldToken.balanceOf(await signer.getAddress());
                setOldTokenBalance(parseFloat(ethers.utils.formatUnits(oldTokenBalance, 18)).toFixed(2));
            } catch (error) {
                console.error("Error fetching old token balance:", error);
                setOldTokenBalance(0);
            } finally {
                setLoadingOldToken(false);
            }

            try {
                // Cargando balance del token nuevo
                setLoadingNewToken(true);
                const newToken = new ethers.Contract(GSA_TOKEN_NEW_ADDRESS, GSA_NEW_ABI, signer);
                const newTokenBalance = await newToken.balanceOf(await signer.getAddress());
                setNewTokenBalance(parseFloat(ethers.utils.formatUnits(newTokenBalance, 18)).toFixed(2));
            } catch (error) {
                console.error("Error fetching new token balance:", error);
                setNewTokenBalance(0);
            } finally {
                setLoadingNewToken(false);
            }
        }
    };

    useEffect(() => {
        fetchRateAndBalance();
    }, []);

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', () => {
                fetchRateAndBalance();
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', fetchRateAndBalance);
            }
        };
    }, []);

    const handleApprove = async () => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const tokenAddress = isOldToNew ? GSA_TOKEN_OLD_ADDRESS : GSA_TOKEN_NEW_ADDRESS;
            const amount = isOldToNew ? oldTokenAmount : newTokenAmount;
            const tokenAbi = isOldToNew ? GSA_OLD_ABI : GSA_NEW_ABI;
            const token = new ethers.Contract(tokenAddress, tokenAbi, signer);

            setIsLoading(true);

            try {
                const approveTx = await token.approve(TOKEN_MIGRATION_CONTRACT_ADDRESS, ethers.utils.parseUnits(amount.toString(), 18));
                await approveTx.wait();
                setIsApproved(true);
                setSuccessMessage("Successful token approval.");

                // Llamar automáticamente a handleSwap después de la aprobación
                await handleSwap();
            } catch (err) {
                console.error("Error on approve:", err);
                setErrorMessage("Error on approve tokens.");
            } finally {
                setIsLoading(false);
            }
        } else {
            setErrorMessage("Please, install MetaMask.");
        }
    };

    const handleSwap = async () => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const migrationContract = new ethers.Contract(TOKEN_MIGRATION_CONTRACT_ADDRESS, TOKEN_MIGRATION_ABI, signer);

            const adjustedAmount = isOldToNew ? oldTokenAmount : newTokenAmount;

            if (adjustedAmount <= 0) {
                setErrorMessage("The set quantity is not valid. Try another quantity.");
                return;
            }

            setIsLoading(true);

            try {
                const swapTx = isOldToNew
                    ? await migrationContract.swapOldtoNew(ethers.utils.parseUnits(adjustedAmount.toString(), 18))
                    : await migrationContract.swapNewtoOld(ethers.utils.parseUnits(adjustedAmount.toString(), 18));
                await swapTx.wait();
                setSuccessMessage(`Successful Swap: ${adjustedAmount} ${isOldToNew ? 'Old Token' : 'New Token'} for ${isOldToNew ? 'New Token' : 'Old Token'}.`);
                await fetchRateAndBalance();
            } catch (err) {
                console.error("Error on Swap:", err);
                setErrorMessage("Error on Swap. Try Again.");
            } finally {
                setIsLoading(false);
            }
        } else {
            setErrorMessage("Please, install MetaMask.");
        }
    };

    const toggleSwapDirection = () => {
        setIsOldToNew(!isOldToNew);

        // Intercambia los valores entre los inputs
        setOldTokenAmount(newTokenAmount);
        setNewTokenAmount(oldTokenAmount);

        // Restablece el estado de Approve
        setIsApproved(false);
    };

    const handleAmountChange = (event) => {
        let amount = Math.floor(event.target.value); // Redondear hacia abajo para asegurar que sea un número entero

        // Validar que el valor no sea menor a 1
        if (amount < 1) {
            amount = 1;
        }

        // Validar que el valor no supere 1 billón de tokens
        const maxAmount = 800000000000; // 1 billón de tokens
        if (amount > maxAmount) {
            setErrorMessage("Suspicious Activity Detected.");
            return; // Detener la ejecución si el valor es mayor a 1 billón
        }

        if (isOldToNew) {
            setOldTokenAmount(amount);
            if (amount > 0 && rate > 0) {
                const calculatedNewToken = amount * rate;
                setNewTokenAmount(Math.floor(calculatedNewToken)); // Redondear hacia abajo para asegurar que sea un número entero
            }
        } else {
            setNewTokenAmount(amount);
            if (amount > 0 && rate > 0) {
                const calculatedOldToken = amount / rate;
                setOldTokenAmount(Math.floor(calculatedOldToken)); // Redondear hacia abajo para asegurar que sea un número entero
            }
        }
        setIsApproved(false);
    };

    const handleMaxClick = () => {
        const maxAmount = isOldToNew ? oldTokenBalance : newTokenBalance;
        if (maxAmount > 0 && rate > 0) {
            if (isOldToNew) {
                setOldTokenAmount(Math.floor(maxAmount)); // Redondear hacia abajo para asegurar que sea un número entero
                setNewTokenAmount(Math.floor(maxAmount * rate)); // Redondear hacia abajo para asegurar que sea un número entero
            } else {
                setNewTokenAmount(Math.floor(maxAmount)); // Redondear hacia abajo para asegurar que sea un número entero
                setOldTokenAmount(Math.floor(maxAmount / rate)); // Redondear hacia abajo para asegurar que sea un número entero
            }
        }
    };

    return (
        <section id="news">
            <div id="token-swap" className="container">
                <h3 className="fn__maintitle big" data-text="Token Swap" data-align="center">
                    Token Swap
                </h3>
                {/* News Shotcode */}
                <div className="fn_cs_news">
                    <div className="news_part">
                        <div className="left_items">
                            <div className="blog__item">
                                <div className="image">
                                    <p style={{ textAlign: "center" }}>WGSA/GSA Token Swap 1:1</p>
                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <img style={{ width: "50%" }} src="/img/token-swap2.png" alt="Swap" />
                                    </div>
                                </div>
                                {/* Campo superior: Token que se intercambia */}
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "5px" }}>
                                        <div>
                                            <p style={{ fontSize: "12px", margin: 0 }}>
                                                <img src={isOldToNew ? "/img/WGSAV2.png" : "/img/GSAV2.png"} style={{ width: "20px" }} /> Balance: {isOldToNew ? oldTokenBalance : newTokenBalance}
                                            </p>
                                        </div>
                                        <a
                                            style={{
                                                fontSize: '12px',
                                            }}
                                            onClick={handleMaxClick}
                                        >
                                            Set Max
                                        </a>
                                    </div>
                                    <input
                                        id="newTokenAmount"
                                        type="number"
                                        value={isOldToNew ? oldTokenAmount : newTokenAmount}
                                        onChange={handleAmountChange}
                                        min="1"
                                        step="1" // Asegura que solo se puedan ingresar números enteros
                                        style={{
                                            border: "1px solid grey",
                                            backgroundColor: "transparent",
                                            borderRadius: "5px",
                                            textAlign: "center",
                                            width: "100%",
                                            fontFamily: "fiery turk"
                                        }}
                                    />
                                </div>
                                {/* Botón para cambiar dirección del swap */}

                                {/* Campo inferior: Token que se recibe */}
                                <div>
                                    <p style={{ fontSize: "12px", margin: 0, paddingTop: "15px" }}>
                                        <img src={isOldToNew ? "/img/GSAV2.png" : "/img/WGSAV2.png"} style={{ width: "20px" }} /> Balance: {isOldToNew ? newTokenBalance : oldTokenBalance}
                                    </p>
                                    <input
                                        type="number"
                                        value={isOldToNew ? newTokenAmount : oldTokenAmount}
                                        disabled
                                        style={{
                                            backgroundColor: "transparent",
                                            border: "1px solid grey",
                                            borderRadius: "5px",
                                            textAlign: "center",
                                            width: "100%",
                                            marginTop: "5px",
                                            fontFamily: "fiery turk"
                                        }}
                                    />
                                </div>
                                {/* Botones de aprobación y swap */}
                                <div className="actions" style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "2rem" }}>
                                    {!isApproved ? (
                                        <button
                                            onClick={handleApprove}
                                            disabled={isLoading}
                                            className="metaportal_fn_buttonLW"
                                        >
                                            {isLoading ? "Approving..." : "Approve"}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleSwap}
                                            disabled={isLoading}
                                            className="metaportal_fn_buttonLW"
                                        >
                                            {isLoading ? "Swapping..." : "Swap Tokens"}
                                        </button>
                                    )}
                                </div>
                                {errorMessage && <ErrorMessagePopup message={errorMessage} />}
                                {successMessage && <SuccessMessagePopup message={successMessage} />}
                                <div>
                                    <PolygonGasPrice />
                                </div>
                            </div>
                        </div>
                        <div className="right_items">
                            <div className="blog__item" style={{ height: "100%" }}>
                                <div className="counter">
                                    <span className="cc">
                                        <img style={{ marginTop: "-3px" }} src="/img/GSAV2.png" alt="GSA" />
                                    </span>
                                </div>
                                <div className="meta">
                                    <p>New $GSA Balance</p>
                                </div>
                                <div className="title">
                                    <h3>
                                        {loadingNewToken ? "Loading..." : newTokenBalance}
                                    </h3>
                                </div>
                            </div>
                            <div className="blog__item" style={{ height: "100%" }}>
                                <div className="counter">
                                    <span className="cc">
                                        <img style={{ marginTop: "-3px" }} src="/img/WGSAV2.png" alt="WGSA" />
                                    </span>
                                </div>
                                <div className="meta">
                                    <p>$WGSA Balance</p>
                                </div>
                                <div className="title">
                                    <h3>
                                        {loadingOldToken ? "Loading..." : oldTokenBalance}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* !News Shotcode */}
            </div>
        </section>
    );
};
export default TokenSwapWGSA;
