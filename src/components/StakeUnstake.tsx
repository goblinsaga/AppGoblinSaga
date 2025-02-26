import React, { useState, useEffect } from "react";
import { useAddress, useContract, useContractRead, useOwnedNFTs } from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import { stakingContractAddress, nftDropContractAddress } from "../../consts/contractAddresses";
import SuccessMessagePopup from "./popups/SuccessMessagePopup";
import ErrorMessagePopup from "./popups/ErrorMessagePopup";
import StakingContractGoblinsABI from "../../contracts/StakingContractGoblinsABI.json";

const StakeUnstakeNFTs: React.FC = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [quantity, setQuantity] = useState<number>(1); // Default starting value
    const [action, setAction] = useState<'stake' | 'unstake'>('stake'); // Determines the action (stake/unstake)

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
    const { contract } = useContract(stakingContractAddress);
    const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);
    const { data: stakedTokens } = useContractRead(contract, "getStakeInfo", [address]);

    const updateQuantity = (type) => {
        setQuantity((prev) => {
          if (type === "+") {
            return prev + 1; // Aumentar de 1000 en 1000
          } else if (type === "-" && prev > 1) {
            return prev - 1; // Disminuir de 1000 en 1000, pero no bajar de 2000
          }
          return prev;
        });
    };
    
    async function processNFTs() {
        if (!address || quantity <= 0) return;

        setIsProcessing(true);

        if (action === 'stake') {
            await stakeNfts();
        } else if (action === 'unstake') {
            await unstakeNfts();
        }

        setIsProcessing(false);
    }

    async function stakeNfts() {
        const unstackedNfts = ownedNfts?.filter((nft) => !isNftStaked(nft.metadata.id)) || [];

        if (unstackedNfts.length === 0) {
            setErrorMessage("No NFTs available to stake.");
            return;
        }

        const selectedNfts = unstackedNfts.slice(0, Math.min(quantity, unstackedNfts.length));
        const nftIds = selectedNfts.map((nft) => nft.metadata.id);

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const stakingContract = new ethers.Contract(stakingContractAddress, StakingContractGoblinsABI, signer);

            const isApproved = await nftDropContract?.isApproved(address, stakingContractAddress);
            if (!isApproved) {
                await nftDropContract?.setApprovalForAll(stakingContractAddress, true);
            }

            await stakingContract.stake(nftIds);
            setSuccessMessage(`Staked ${nftIds.length} NFTs successfully!`);
        } catch (error) {
            setErrorMessage("Error: Transaction rejected or insufficient funds.");
        }
    }

    async function unstakeNfts() {
        const stakedNftIds = stakedTokens?.[0]?.map((stakedToken: BigNumber) => stakedToken.toString()) || [];

        if (stakedNftIds.length === 0) {
            setErrorMessage("No NFTs available to unstake.");
            return;
        }

        const selectedNfts = stakedNftIds.slice(0, Math.min(quantity, stakedNftIds.length));

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const stakingContract = new ethers.Contract(stakingContractAddress, StakingContractGoblinsABI, signer);

            await stakingContract.withdraw(selectedNfts);
            setSuccessMessage(`Unstaked ${selectedNfts.length} NFTs successfully!`);
        } catch (error) {
            setErrorMessage("Error: Transaction rejected or insufficient funds.");
        }
    }

    function isNftStaked(nftId: string) {
        return stakedTokens && stakedTokens[0]?.includes(BigNumber.from(nftId));
    }

    return (
        <div>
            {successMessage && <SuccessMessagePopup message={successMessage} onClose={() => setSuccessMessage('')} />}
            {errorMessage && <ErrorMessagePopup message={errorMessage} onClose={() => setErrorMessage('')} />}

            <div className="item" style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: "-20px",
                paddingTop: "3rem"
            }}>
                <p>Goblins to Mine/Unmine</p>
                <div className="qnt">
                    <span className="decrease" onClick={() => updateQuantity("-")}>-</span>
                    <span className="summ">{quantity}</span>
                    <span className="increase" onClick={() => updateQuantity("+")}>+</span>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
                <button className="metaportal_fn_buttonLW" onClick={() => setAction('stake')} disabled={action === 'stake'}>
                    Set Mine
                </button>
                <button className="metaportal_fn_buttonLW" onClick={() => setAction('unstake')} disabled={action === 'unstake'}>
                    Set Unmine
                </button>
            </div>

            <button
                onClick={processNFTs}
                disabled={isProcessing}
                className="metaportal_fn_buttonLW full"
                style={{ marginTop: '10px' }}
            >
                {isProcessing ? `${action === 'stake' ? "Mining..." : "Unmining..."}` : `${action === 'stake' ? "Mine" : "Unmine"} NFTs`}
            </button>
        </div>
    );
};

export default StakeUnstakeNFTs;
