import React, { useState, useEffect } from "react";
import { useAddress, useContract, useContractRead, useOwnedNFTs } from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import { stakingContractAddress, nftDropContractAddress } from "../../../consts/contractAddressesNew";
import SuccessMessagePopup from "../popups/SuccessMessagePopup";
import ErrorMessagePopup from "../popups/ErrorMessagePopup";
import StakingContractGoblinsABI from "../../../contracts/StakingContractGoblinsABI.json"; // Asegúrate de tener el ABI del contrato

const StakeAllNFT: React.FC = () => {
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
    const { contract: nftDropContract } = useContract(nftDropContractAddress, "nft-drop");
    const { contract, isLoading } = useContract(stakingContractAddress);
    const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);
    const { data: stakedTokens } = useContractRead(contract, "getStakeInfo", [address]);

    async function stakeAllNfts() {
        if (!address || !ownedNfts) return;

        const unstackedNfts = ownedNfts.filter((nft) => !isNftStaked(nft.metadata.id));
        if (unstackedNfts.length === 0) {
            console.log("No NFTs to stake.");
            return;
        }

        const nftIds = unstackedNfts.map((nft) => nft.metadata.id);

        try {
            setIsStaking(true);
            if (!window.ethereum) {
                setErrorMessage("No Ethereum wallet found.");
                return;
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();

            const stakingContract = new ethers.Contract(stakingContractAddress, StakingContractGoblinsABI, signer);

            const isApproved = await nftDropContract?.isApproved(address, stakingContractAddress);
            if (!isApproved) {
                await nftDropContract?.setApprovalForAll(stakingContractAddress, true);
            }

            await stakingContract.stake(nftIds);
            setSuccessMessage("Goblins Working");
        } catch (error) {
            setErrorMessage("Error: Transaction rejected or insufficient funds.");
        } finally {
            setIsStaking(false);
        }
    }

    function isNftStaked(nftId: string) {
        return stakedTokens && stakedTokens[0]?.includes(BigNumber.from(nftId));
    }

    return (
        <div>
            {successMessage && <SuccessMessagePopup message={successMessage} onClose={() => setSuccessMessage('')} />}
            {errorMessage && <ErrorMessagePopup message={errorMessage} onClose={() => setErrorMessage('')} />}
            <button
                onClick={stakeAllNfts}
                disabled={isStaking}
                className="metaportal_fn_buttonLW full"
            >
                {isStaking ? "Staking..." : "Mine All NFTs"}
            </button>
        </div>
    );
};

export default StakeAllNFT;
