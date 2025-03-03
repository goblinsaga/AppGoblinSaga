import React, { useState, useEffect } from "react";
import { useAddress, useContract } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { STAKING_CONTRACT_ADDRESS, BUSINESSES_CONTRACT_ADDRESS2 } from "../../../consts/contracts2New";
import SuccessMessagePopup from "../popups/SuccessMessagePopup";
import ErrorMessagePopup from "../popups/ErrorMessagePopup";
import StakingContractABI from "../../../contracts/StakingContractBussinesABI.json";
import NFTContractABI from "../../../contracts/BoxContractABI.json";

const StakeAllBox: React.FC = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isStaking, setIsStaking] = useState(false);
    
    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(''), 4000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 4000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const address = useAddress();
    const { contract: stakingContract } = useContract(STAKING_CONTRACT_ADDRESS, StakingContractABI);
    const { contract: nftContract } = useContract(BUSINESSES_CONTRACT_ADDRESS2, NFTContractABI);

    async function approveAndStake() {
        if (!address) return;
        try {
            setIsStaking(true);
            if (!window.ethereum) {
                setErrorMessage("No Ethereum wallet found.");
                return;
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();

            const nftContractInstance = new ethers.Contract(BUSINESSES_CONTRACT_ADDRESS2, NFTContractABI, signer);
            const stakingContractInstance = new ethers.Contract(STAKING_CONTRACT_ADDRESS, StakingContractABI, signer);

            // Verificar aprobación
            const isApproved = await nftContractInstance.isApprovedForAll(address, STAKING_CONTRACT_ADDRESS);
            if (!isApproved) {
                console.log("Aprobando NFTs para staking...");
                const approvalTx = await nftContractInstance.setApprovalForAll(STAKING_CONTRACT_ADDRESS, true);
                await approvalTx.wait();
                console.log("Aprobación completada.");
            }

            // Revisar qué NFTs tiene en cartera (IDs 0 al 8)
            const stakedTokenIds = [];
            const stakedTokenAmounts = [];
            
            for (let tokenId = 0; tokenId <= 8; tokenId++) {
                const balance = await nftContractInstance.balanceOf(address, tokenId);
                if (balance.gt(0)) {
                    stakedTokenIds.push(tokenId);
                    stakedTokenAmounts.push(balance.toNumber());
                }
            }

            if (stakedTokenIds.length === 0) {
                setErrorMessage("No NFTs to stake.");
                return;
            }

            // Hacer el staking
            const txPromises = stakedTokenIds.map((tokenId, i) => {
                const amount = stakedTokenAmounts[i];
                return stakingContractInstance.stake(tokenId, amount, { gasLimit: 500000 });
            });

            const txResults = await Promise.all(txPromises);
            await Promise.all(txResults.map(tx => tx.wait()));

            setSuccessMessage("All NFTs Staked Successfully");
        } catch (error) {
            console.error("Error during staking:", error);
            setErrorMessage("Failed to stake NFTs: " + error.message);
        } finally {
            setIsStaking(false);
        }
    }

    return (
        <div>
            {successMessage && <SuccessMessagePopup message={successMessage} onClose={() => setSuccessMessage('')} />}
            {errorMessage && <ErrorMessagePopup message={errorMessage} onClose={() => setErrorMessage('')} />}
            <button
                onClick={approveAndStake}
                disabled={isStaking}
                className="metaportal_fn_buttonLW"
            >
                {isStaking ? "Mining..." : "Mine All S.Items"}
            </button>
        </div>
    );
};

export default StakeAllBox;
