import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ErrorMessagePopup from './popups/ErrorMessagePopup';
import SuccessMessagePopup from './popups/SuccessMessagePopup';
import PolygonGasPrice from "./PolygonGasPrice";

const GSA_TOKEN_OLD_ADDRESS = "0xC1e2859c9D20456022ADe2d03f2E48345cA177C2"; // Dirección del token antiguo
const GSA_TOKEN_NEW_ADDRESS = "0xC3882D10e49Ac4E9888D0C594DB723fC9cE95468"; // Dirección del token nuevo
const TOKEN_MIGRATION_CONTRACT_ADDRESS = "0x86cdb490248ae43b19dbf0c6aa44a8788d23cfee"; // Dirección del contrato de migración

const TOKEN_MIGRATION_ABI = [
    "function addLiquidity(uint256 gsaAmount, uint256 xgsaAmount) external",
    "function removeLiquidity(uint256 gsaAmount, uint256 xgsaAmount) external",
    "function getContractBalances() external view returns (uint256 gsaBalanceOld, uint256 gsaBalanceNew)",
];

const GSA_OLD_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
];

const GSA_NEW_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
];

const LiquidityManager = () => {
    const [oldTokenAmount, setOldTokenAmount] = useState(0);
    const [newTokenAmount, setNewTokenAmount] = useState(0);
    const [contractOldTokenBalance, setContractOldTokenBalance] = useState(0);
    const [contractNewTokenBalance, setContractNewTokenBalance] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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

    // Función para obtener los balances del contrato
    const fetchContractBalances = async () => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const migrationContract = new ethers.Contract(TOKEN_MIGRATION_CONTRACT_ADDRESS, TOKEN_MIGRATION_ABI, signer);

            try {
                const [oldBalance, newBalance] = await migrationContract.getContractBalances();
                setContractOldTokenBalance(parseFloat(ethers.utils.formatUnits(oldBalance, 18)).toFixed(2));
                setContractNewTokenBalance(parseFloat(ethers.utils.formatUnits(newBalance, 18)).toFixed(2));
            } catch (error) {
                console.error("Error fetching contract balances:", error);
                setErrorMessage("Error fetching contract balances.");
            }
        }
    };

    useEffect(() => {
        fetchContractBalances();
    }, []);

    // Función para aprobar tokens antes de añadir liquidez
    const handleApprove = async (tokenAddress, tokenAbi, amount) => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const token = new ethers.Contract(tokenAddress, tokenAbi, signer);

            try {
                const approveTx = await token.approve(TOKEN_MIGRATION_CONTRACT_ADDRESS, ethers.utils.parseUnits(amount.toString(), 18));
                await approveTx.wait();
                return true;
            } catch (err) {
                console.error("Error on approve:", err);
                setErrorMessage("Error on approve tokens.");
                return false;
            }
        } else {
            setErrorMessage("Please, install MetaMask.");
            return false;
        }
    };

    // Función para añadir liquidez
    const handleAddLiquidity = async () => {
        if (window.ethereum) {
            setIsLoading(true);

            try {
                // Aprobar oldToken
                const oldTokenApproved = await handleApprove(GSA_TOKEN_OLD_ADDRESS, GSA_OLD_ABI, oldTokenAmount);
                if (!oldTokenApproved) return;

                // Aprobar newToken
                const newTokenApproved = await handleApprove(GSA_TOKEN_NEW_ADDRESS, GSA_NEW_ABI, newTokenAmount);
                if (!newTokenApproved) return;

                // Añadir liquidez
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const migrationContract = new ethers.Contract(TOKEN_MIGRATION_CONTRACT_ADDRESS, TOKEN_MIGRATION_ABI, signer);

                const addLiquidityTx = await migrationContract.addLiquidity(
                    ethers.utils.parseUnits(oldTokenAmount.toString(), 18),
                    ethers.utils.parseUnits(newTokenAmount.toString(), 18)
                );
                await addLiquidityTx.wait();
                setSuccessMessage("Liquidity added successfully.");
                await fetchContractBalances();
            } catch (err) {
                console.error("Error adding liquidity:", err);
                setErrorMessage("Error adding liquidity.");
            } finally {
                setIsLoading(false);
            }
        } else {
            setErrorMessage("Please, install MetaMask.");
        }
    };

    // Función para remover liquidez
    const handleRemoveLiquidity = async () => {
        if (window.ethereum) {
            setIsLoading(true);

            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const migrationContract = new ethers.Contract(TOKEN_MIGRATION_CONTRACT_ADDRESS, TOKEN_MIGRATION_ABI, signer);

                const removeLiquidityTx = await migrationContract.removeLiquidity(
                    ethers.utils.parseUnits(oldTokenAmount.toString(), 18),
                    ethers.utils.parseUnits(newTokenAmount.toString(), 18)
                );
                await removeLiquidityTx.wait();
                setSuccessMessage("Liquidity removed successfully.");
                await fetchContractBalances();
            } catch (err) {
                console.error("Error removing liquidity:", err);
                setErrorMessage("Error removing liquidity.");
            } finally {
                setIsLoading(false);
            }
        } else {
            setErrorMessage("Please, install MetaMask.");
        }
    };

    return (
        <section id="news">
            <div className="container">
                <h3 className="fn__maintitle big" data-text="Liquidity Management" data-align="center">
                    Liquidity Management
                </h3>

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div className="blog__item">
                        {/* Campo para añadir/remover liquidez */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "5px" }}>
                                <div>
                                    <p style={{ fontSize: "12px", margin: 0 }}>
                                        <img src="/img/LOGOS-GS-32x32.png" style={{ width: "20px" }} /> Old Token Balance in Contract: {contractOldTokenBalance}
                                    </p>
                                    <p style={{ fontSize: "12px", margin: 0 }}>
                                        <img src="/img/GSAV2.png" style={{ width: "20px" }} /> New Token Balance in Contract: {contractNewTokenBalance}
                                    </p>
                                </div>
                            </div>
                            <input
                                type="number"
                                placeholder="Old Token Amount"
                                value={oldTokenAmount}
                                onChange={(e) => setOldTokenAmount(e.target.value)}
                                min="0"
                                step="any"
                                style={{
                                    border: "1px solid grey",
                                    backgroundColor: "transparent",
                                    borderRadius: "5px",
                                    textAlign: "center",
                                    width: "100%",
                                    fontFamily: "fiery turk",
                                    marginBottom: "10px"
                                }}
                            />
                            <input
                                type="number"
                                placeholder="New Token Amount"
                                value={newTokenAmount}
                                onChange={(e) => setNewTokenAmount(e.target.value)}
                                min="0"
                                step="any"
                                style={{
                                    border: "1px solid grey",
                                    backgroundColor: "transparent",
                                    borderRadius: "5px",
                                    textAlign: "center",
                                    width: "100%",
                                    fontFamily: "fiery turk",
                                    marginBottom: "10px"
                                }}
                            />
                        </div>
                        {/* Botones para añadir/remover liquidez */}
                        <div className="actions" style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "2rem" }}>
                            <button
                                onClick={handleAddLiquidity}
                                disabled={isLoading}
                                className="metaportal_fn_buttonLW"
                                style={{ marginRight: "10px" }}
                            >
                                {isLoading ? "Adding..." : "Add"}
                            </button>
                            <button
                                onClick={handleRemoveLiquidity}
                                disabled={isLoading}
                                className="metaportal_fn_buttonLW"
                            >
                                {isLoading ? "Removing..." : "Remove"}
                            </button>
                        </div>
                        {errorMessage && <ErrorMessagePopup message={errorMessage} />}
                        {successMessage && <SuccessMessagePopup message={successMessage} />}
                        <div>
                            <PolygonGasPrice />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LiquidityManager;