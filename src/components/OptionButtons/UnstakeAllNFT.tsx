import React, { useState, useEffect } from "react";
import { useAddress, useContract, useContractRead, useOwnedNFTs } from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import { stakingContractAddress, nftDropContractAddress } from "../../../consts/contractAddresses";
import SuccessMessagePopup from "../popups/SuccessMessagePopup";
import ErrorMessagePopup from "../popups/ErrorMessagePopup";
import StakingContractGoblinsABI from "../../../contracts/StakingContractGoblinsABI.json";

const UnstakeAllNFT: React.FC = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isUnstaking, setIsUnstaking] = useState(false);

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
    const { contract: nftDropContract } = useContract(nftDropContractAddress, "nft-drop");
    const { contract, isLoading } = useContract(stakingContractAddress);
    const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);
    const { data: stakedTokens } = useContractRead(contract, "getStakeInfo", [address]);

    async function withdrawAllNfts() {
        if (!address || !stakedTokens) return;
        if (stakedTokens[0]?.length === 0) {
            console.log("No NFTs to unstake.");
            return;
        }

        const nftIds = stakedTokens[0].map((stakedToken: BigNumber) => stakedToken.toString());

        try {
            setIsUnstaking(true);
            if (!window.ethereum) {
                setErrorMessage("No Ethereum wallet found.");
                return;
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();

            const stakingContract = new ethers.Contract(stakingContractAddress, StakingContractGoblinsABI, signer);

            await stakingContract.withdraw(nftIds);
            setSuccessMessage("All Goblins are taking a break");
        } catch (error) {
            setErrorMessage("Error: Transaction rejected or insufficient funds.");
        } finally {
            setIsUnstaking(false);
        }
    }

    return (
        <div>
            {successMessage && <SuccessMessagePopup message={successMessage} onClose={() => setSuccessMessage('')} />}
            {errorMessage && <ErrorMessagePopup message={errorMessage} onClose={() => setErrorMessage('')} />}
            <button
                onClick={withdrawAllNfts}
                disabled={isUnstaking}
                className="metaportal_fn_buttonLW full"
            >
                {isUnstaking ? "Unstaking..." : "Unmine all Goblins"}
            </button>
        </div>
    );
};

export default UnstakeAllNFT;
