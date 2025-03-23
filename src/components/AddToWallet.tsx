import { ethers } from "ethers";
import React, { useState } from "react";
import SuccessMessagePopup from "./popups/SuccessMessagePopup";
import ErrorMessagePopup from "./popups/ErrorMessagePopup";

const AddTokenWallet = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const tokens = {
        GSA: {
            address: "0xC3882D10e49Ac4E9888D0C594DB723fC9cE95468",
            symbol: "GSA",
            decimals: 18,
            image: "https://i.ibb.co/twRCxg02/GSAV2.png",
        },
        WGSA: {
            address: "0x6f5c47c85E55ef4E0d17c4d221C79d0e7a0A4650",
            symbol: "WGSA",
            decimals: 18,
            image: "https://i.ibb.co/tPMR1Src/WGSAV2.png",
        },
    };

    const addTokenToWallet = async (token) => {
        if (typeof window.ethereum === "undefined") {
            setErrorMessage("MetaMask is not available. Please install MetaMask!");
            setTimeout(() => setErrorMessage(''), 5000); // Eliminar el mensaje después de 5 segundos
            return;
        }

        // Mostrar mensaje de "Adding..."
        setSuccessMessage(`Adding ${token.symbol}...`);

        try {
            // Crear un proveedor ethers.js con MetaMask
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            // Conectar la billetera si no está conectada
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts", // Solicita que el usuario conecte su billetera
            });

            // Validar si el token existe (ejemplo: balance del signer)
            const erc20Contract = new ethers.Contract(
                token.address,
                [
                    "function balanceOf(address owner) view returns (uint256)",
                    "function decimals() view returns (uint8)",
                    "function symbol() view returns (string)",
                ],
                signer
            );

            const decimals = await erc20Contract.decimals();
            const symbol = await erc20Contract.symbol();

            if (symbol !== token.symbol || decimals !== token.decimals) {
                setErrorMessage("Token information mismatch. Please verify the details.");
                setTimeout(() => setErrorMessage(''), 5000); // Eliminar el mensaje después de 5 segundos
                return;
            }

            // Cambiar a la red Polygon si no está seleccionada
            const polygonChainId = "0x89"; // Chain ID de Polygon Mainnet
            const currentChainId = await window.ethereum.request({ method: "eth_chainId" });

            if (currentChainId !== polygonChainId) {
                await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: polygonChainId }],
                });
            }

            // Añadir el token a MetaMask
            const wasAdded = await window.ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20",
                    options: {
                        address: token.address,
                        symbol: token.symbol,
                        decimals: token.decimals,
                        image: token.image,
                    },
                },
            });

            if (wasAdded) {
                setSuccessMessage(`${token.symbol} token added to MetaMask!`);
                setTimeout(() => setSuccessMessage(''), 5000); // Eliminar el mensaje después de 5 segundos
            } else {
                setErrorMessage("Token addition was declined.");
                setTimeout(() => setErrorMessage(''), 5000); // Eliminar el mensaje después de 5 segundos
            }
        } catch (error) {
            console.error("Error adding token to MetaMask:", error);
            setErrorMessage("An error occurred while adding the token.");
            setTimeout(() => setErrorMessage(''), 5000); // Eliminar el mensaje después de 5 segundos
        }
    };

    return (
        <div style={{ width: "100%", maxWidth: "100%", margin: "0 auto" }}>
            {successMessage && <SuccessMessagePopup message={successMessage} onClose={() => setSuccessMessage('')} />}
            {errorMessage && <ErrorMessagePopup message={errorMessage} onClose={() => setErrorMessage('')} />}

            {/* Div para GSA */}
            <div
                className="blog__item"
                style={{
                    width: "100%",
                    textAlign: "center",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                    padding: "15px",
                    transition: "transform 0.3s ease-in-out",
                    marginBottom: "10px",
                }}
                onClick={() => addTokenToWallet(tokens.GSA)}
                onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img
                        src={tokens.GSA.image}
                        alt="GSA Token"
                        style={{ width: "25px", height: "auto" }}
                    />
                    <span>{tokens.GSA.symbol}</span>
                </div>
                <img
                    src="/img/MetaMask_Fox.png" // Ruta del logo de MetaMask
                    alt="MetaMask Logo"
                    style={{ width: "25px", height: "auto" }}
                />
            </div>

            {/* Div para WGSA */}
            <div
                className="blog__item"
                style={{
                    width: "100%",
                    textAlign: "center",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                    padding: "15px",
                    transition: "transform 0.3s ease-in-out",
                    marginBottom: "10px",
                }}
                onClick={() => addTokenToWallet(tokens.WGSA)}
                onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img
                        src={tokens.WGSA.image}
                        alt="WGSA Token"
                        style={{ width: "25px", height: "auto" }}
                    />
                    <span>{tokens.WGSA.symbol}</span>
                </div>
                <img
                    src="/img/MetaMask_Fox.png" // Ruta del logo de MetaMask
                    alt="MetaMask Logo"
                    style={{ width: "25px", height: "auto" }}
                />
            </div>
        </div>
    );
};

export default AddTokenWallet;
